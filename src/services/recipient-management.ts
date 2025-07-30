/**
 * Recipient management service for handling email recipients
 */

import { EmailValidationService } from './email-validation';

export interface Recipients {
  to: string[];
  cc: string[];
  bcc: string[];
}

export interface RecipientSuggestion {
  email: string;
  name?: string;
  isFrequent?: boolean;
  isContact?: boolean;
}

export class RecipientManagementService {
  private static readonly STORAGE_KEY = 'email_recent_recipients';
  private static readonly MAX_RECENT_RECIPIENTS = 50;
  
  /**
   * Add recipient to a specific field
   */
  static addRecipient(recipients: Recipients, type: keyof Recipients, email: string): Recipients {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Validate email first
    const validation = EmailValidationService.validateEmail(trimmedEmail);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    
    // Check if email already exists in any field
    const allEmails = [...recipients.to, ...recipients.cc, ...recipients.bcc];
    if (allEmails.includes(trimmedEmail)) {
      return recipients; // Don't add duplicates
    }
    
    return {
      ...recipients,
      [type]: [...recipients[type], trimmedEmail]
    };
  }
  
  /**
   * Remove recipient from a specific field
   */
  static removeRecipient(recipients: Recipients, type: keyof Recipients, email: string): Recipients {
    return {
      ...recipients,
      [type]: recipients[type].filter(e => e !== email)
    };
  }
  
  /**
   * Move recipient between fields (e.g., from TO to CC)
   */
  static moveRecipient(recipients: Recipients, email: string, fromType: keyof Recipients, toType: keyof Recipients): Recipients {
    if (fromType === toType) return recipients;
    
    // Remove from source field
    let newRecipients = this.removeRecipient(recipients, fromType, email);
    
    // Add to destination field
    try {
      newRecipients = this.addRecipient(newRecipients, toType, email);
    } catch {
      // If adding fails, return original recipients
      return recipients;
    }
    
    return newRecipients;
  }
  
  /**
   * Parse and add multiple recipients from a string
   */
  static addMultipleRecipients(recipients: Recipients, type: keyof Recipients, emailString: string): Recipients {
    const emails = EmailValidationService.parseEmailString(emailString);
    let newRecipients = recipients;
    
    for (const email of emails) {
      try {
        newRecipients = this.addRecipient(newRecipients, type, email);
      } catch (error) {
        // Continue with other emails if one fails
        console.warn(`Failed to add recipient ${email}:`, error);
      }
    }
    
    return newRecipients;
  }
  
  /**
   * Get total recipient count
   */
  static getTotalRecipientCount(recipients: Recipients): number {
    return recipients.to.length + recipients.cc.length + recipients.bcc.length;
  }
  
  /**
   * Get all unique recipients
   */
  static getAllRecipients(recipients: Recipients): string[] {
    const allEmails = [...recipients.to, ...recipients.cc, ...recipients.bcc];
    return [...new Set(allEmails)];
  }
  
  /**
   * Clear all recipients
   */
  static clearAllRecipients(): Recipients {
    return { to: [], cc: [], bcc: [] };
  }
  
  /**
   * Clear specific field
   */
  static clearField(recipients: Recipients, type: keyof Recipients): Recipients {
    return {
      ...recipients,
      [type]: []
    };
  }
  
  /**
   * Save recent recipients to localStorage
   */
  static saveRecentRecipient(email: string): void {
    try {
      const recentRecipients = this.getRecentRecipients();
      const newRecipients = [email, ...recentRecipients.filter(e => e !== email)]
        .slice(0, this.MAX_RECENT_RECIPIENTS);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newRecipients));
    } catch (error) {
      console.warn('Failed to save recent recipient:', error);
    }
  }
  
  /**
   * Get recent recipients from localStorage
   */
  static getRecentRecipients(): string[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load recent recipients:', error);
      return [];
    }
  }
  
  /**
   * Get recipient suggestions based on input
   */
  static getRecipientSuggestions(input: string): RecipientSuggestion[] {
    const recentRecipients = this.getRecentRecipients();
    const inputLower = input.toLowerCase();
    
    // Filter recent recipients that match input
    const suggestions: RecipientSuggestion[] = recentRecipients
      .filter(email => email.toLowerCase().includes(inputLower))
      .map(email => ({
        email,
        isFrequent: true
      }));
    
    // Add test email addresses if they match
    const testEmails = [
      'delivered@resend.dev',
      'bounced@resend.dev',
      'complained@resend.dev'
    ];
    
    for (const email of testEmails) {
      if (email.toLowerCase().includes(inputLower) && !suggestions.some(s => s.email === email)) {
        suggestions.push({
          email,
          name: `Test Email (${email.split('@')[0]})`,
          isContact: false
        });
      }
    }
    
    return suggestions.slice(0, 10); // Limit to 10 suggestions
  }
  
  /**
   * Validate all recipients before sending
   */
  static validateAllRecipients(recipients: Recipients): { isValid: boolean; error?: string } {
    return EmailValidationService.validateComposition(recipients, 'temp', 'temp');
  }
  
  /**
   * Export recipients to a format suitable for email sending
   */
  static exportForSending(recipients: Recipients): { primary: string; cc?: string[]; bcc?: string[] } {
    if (recipients.to.length === 0) {
      throw new Error('At least one recipient is required');
    }
    
    return {
      primary: recipients.to[0], // Convex API currently only supports single recipient
      cc: recipients.cc.length > 0 ? recipients.cc : undefined,
      bcc: recipients.bcc.length > 0 ? recipients.bcc : undefined
    };
  }
  
  /**
   * Create recipients object from email strings
   */
  static createFromEmails(to?: string[], cc?: string[], bcc?: string[]): Recipients {
    return {
      to: to || [],
      cc: cc || [],
      bcc: bcc || []
    };
  }
}