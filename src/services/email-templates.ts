/**
 * Email template service for managing reusable email templates
 */

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  isDefault?: boolean;
}

export interface TemplateVariable {
  name: string;
  description: string;
  defaultValue?: string;
}

export class EmailTemplateService {
  private static readonly STORAGE_KEY = 'email_templates';
  private static readonly DEFAULT_TEMPLATES: EmailTemplate[] = [
    {
      id: 'welcome',
      name: 'Welcome Email',
      subject: 'Welcome to our service!',
      body: `Hello {{name}},

Welcome to our service! We're excited to have you on board.

Getting started is easy:
1. Complete your profile
2. Explore our features
3. Reach out if you need help

Best regards,
The Team`,
      category: 'onboarding',
      tags: ['welcome', 'onboarding'],
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault: true
    },
    {
      id: 'followup',
      name: 'Follow-up Email',
      subject: 'Following up on {{subject}}',
      body: `Hi {{name}},

I wanted to follow up on our previous conversation about {{subject}}.

{{followup_message}}

Please let me know if you have any questions or if there's anything else I can help you with.

Best regards,
{{sender_name}}`,
      category: 'business',
      tags: ['followup', 'business'],
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault: true
    },
    {
      id: 'announcement',
      name: 'Announcement',
      subject: 'Important Update: {{announcement_title}}',
      body: `Dear {{name}},

We have an important announcement to share with you.

**{{announcement_title}}**

{{announcement_details}}

If you have any questions, please don't hesitate to contact us.

Thank you,
{{company_name}}`,
      category: 'announcement',
      tags: ['announcement', 'update'],
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault: true
    }
  ];
  
  /**
   * Get all templates
   */
  static getAllTemplates(): EmailTemplate[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const customTemplates = stored ? JSON.parse(stored) : [];
      
      // Combine default and custom templates
      return [...this.DEFAULT_TEMPLATES, ...customTemplates].map(template => ({
        ...template,
        createdAt: new Date(template.createdAt),
        updatedAt: new Date(template.updatedAt)
      }));
    } catch (error) {
      console.warn('Failed to load templates:', error);
      return this.DEFAULT_TEMPLATES;
    }
  }
  
  /**
   * Get template by ID
   */
  static getTemplate(id: string): EmailTemplate | null {
    const templates = this.getAllTemplates();
    return templates.find(template => template.id === id) || null;
  }
  
  /**
   * Save template
   */
  static saveTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): EmailTemplate {
    const newTemplate: EmailTemplate = {
      ...template,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    try {
      const customTemplates = this.getCustomTemplates();
      customTemplates.push(newTemplate);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customTemplates));
    } catch (error) {
      console.error('Failed to save template:', error);
      throw new Error('Failed to save template');
    }
    
    return newTemplate;
  }
  
  /**
   * Update existing template
   */
  static updateTemplate(id: string, updates: Partial<Omit<EmailTemplate, 'id' | 'createdAt'>>): EmailTemplate {
    const template = this.getTemplate(id);
    if (!template) {
      throw new Error('Template not found');
    }
    
    if (template.isDefault) {
      throw new Error('Cannot modify default templates');
    }
    
    const updatedTemplate: EmailTemplate = {
      ...template,
      ...updates,
      updatedAt: new Date()
    };
    
    try {
      const customTemplates = this.getCustomTemplates();
      const index = customTemplates.findIndex(t => t.id === id);
      if (index !== -1) {
        customTemplates[index] = updatedTemplate;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customTemplates));
      }
    } catch (error) {
      console.error('Failed to update template:', error);
      throw new Error('Failed to update template');
    }
    
    return updatedTemplate;
  }
  
  /**
   * Delete template
   */
  static deleteTemplate(id: string): void {
    const template = this.getTemplate(id);
    if (!template) {
      throw new Error('Template not found');
    }
    
    if (template.isDefault) {
      throw new Error('Cannot delete default templates');
    }
    
    try {
      const customTemplates = this.getCustomTemplates();
      const filteredTemplates = customTemplates.filter(t => t.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredTemplates));
    } catch (error) {
      console.error('Failed to delete template:', error);
      throw new Error('Failed to delete template');
    }
  }
  
  /**
   * Get templates by category
   */
  static getTemplatesByCategory(category: string): EmailTemplate[] {
    return this.getAllTemplates().filter(template => template.category === category);
  }
  
  /**
   * Search templates
   */
  static searchTemplates(query: string): EmailTemplate[] {
    const queryLower = query.toLowerCase();
    return this.getAllTemplates().filter(template => 
      template.name.toLowerCase().includes(queryLower) ||
      template.subject.toLowerCase().includes(queryLower) ||
      template.body.toLowerCase().includes(queryLower) ||
      template.tags?.some(tag => tag.toLowerCase().includes(queryLower))
    );
  }
  
  /**
   * Apply template to email composition
   */
  static applyTemplate(template: EmailTemplate, variables?: Record<string, string>): { subject: string; body: string } {
    let subject = template.subject;
    let body = template.body;
    
    // Replace variables if provided
    if (variables) {
      for (const [key, value] of Object.entries(variables)) {
        const placeholder = `{{${key}}}`;
        subject = subject.replace(new RegExp(placeholder, 'g'), value);
        body = body.replace(new RegExp(placeholder, 'g'), value);
      }
    }
    
    return { subject, body };
  }
  
  /**
   * Extract variables from template
   */
  static extractVariables(template: EmailTemplate): TemplateVariable[] {
    const content = template.subject + ' ' + template.body;
    const variableMatches = content.match(/\{\{([^}]+)\}\}/g) || [];
    const uniqueVariables = [...new Set(variableMatches.map(match => match.slice(2, -2)))];
    
    return uniqueVariables.map(name => ({
      name,
      description: this.getVariableDescription(name),
      defaultValue: this.getVariableDefaultValue(name)
    }));
  }
  
  /**
   * Validate template content
   */
  static validateTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!template.name.trim()) {
      errors.push('Template name is required');
    }
    
    if (!template.subject.trim()) {
      errors.push('Template subject is required');
    }
    
    if (!template.body.trim()) {
      errors.push('Template body is required');
    }
    
    // Check for unclosed variables
    const openBraces = (template.subject + template.body).match(/\{\{/g)?.length || 0;
    const closeBraces = (template.subject + template.body).match(/\}\}/g)?.length || 0;
    if (openBraces !== closeBraces) {
      errors.push('Template has unclosed variable placeholders');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Export templates
   */
  static exportTemplates(): string {
    const templates = this.getCustomTemplates();
    return JSON.stringify(templates, null, 2);
  }
  
  /**
   * Import templates
   */
  static importTemplates(jsonData: string): { success: number; errors: string[] } {
    let success = 0;
    const errors: string[] = [];
    
    try {
      const importedTemplates = JSON.parse(jsonData);
      
      if (!Array.isArray(importedTemplates)) {
        throw new Error('Invalid format: expected array of templates');
      }
      
      for (const template of importedTemplates) {
        try {
          const validation = this.validateTemplate(template);
          if (validation.isValid) {
            this.saveTemplate(template);
            success++;
          } else {
            errors.push(`Template "${template.name}": ${validation.errors.join(', ')}`);
          }
        } catch (error) {
          errors.push(`Failed to import template "${template.name}": ${String(error)}`);
        }
      }
    } catch (error) {
      errors.push(`Failed to parse JSON: ${String(error)}`);
    }
    
    return { success, errors };
  }
  
  /**
   * Get custom (non-default) templates
   */
  private static getCustomTemplates(): EmailTemplate[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
  
  /**
   * Generate unique ID for template
   */
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  /**
   * Get description for common variables
   */
  private static getVariableDescription(name: string): string {
    const descriptions: Record<string, string> = {
      name: 'Recipient name',
      email: 'Recipient email address',
      subject: 'Email subject',
      sender_name: 'Sender name',
      company_name: 'Company name',
      date: 'Current date',
      announcement_title: 'Announcement title',
      announcement_details: 'Announcement details',
      followup_message: 'Follow-up message content'
    };
    
    return descriptions[name] || `Variable: ${name}`;
  }
  
  /**
   * Get default value for common variables
   */
  private static getVariableDefaultValue(name: string): string | undefined {
    const defaults: Record<string, string> = {
      date: new Date().toLocaleDateString(),
      sender_name: 'Your Name',
      company_name: 'Your Company'
    };
    
    return defaults[name];
  }
}