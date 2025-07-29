/**
 * Email validation service for validating email addresses and content
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class EmailValidationService {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  /**
   * Validate a single email address
   */
  static validateEmail(email: string): ValidationResult {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      return { isValid: false, error: "Email address is required" };
    }
    
    if (!this.EMAIL_REGEX.test(trimmedEmail)) {
      return { isValid: false, error: "Invalid email format" };
    }
    
    if (trimmedEmail.length > 254) {
      return { isValid: false, error: "Email address is too long" };
    }
    
    return { isValid: true };
  }
  
  /**
   * Validate multiple email addresses
   */
  static validateEmails(emails: string[]): ValidationResult {
    if (emails.length === 0) {
      return { isValid: false, error: "At least one recipient is required" };
    }
    
    for (const email of emails) {
      const result = this.validateEmail(email);
      if (!result.isValid) {
        return { isValid: false, error: `Invalid email "${email}": ${result.error}` };
      }
    }
    
    return { isValid: true };
  }
  
  /**
   * Validate subject line
   */
  static validateSubject(subject: string): ValidationResult {
    const trimmedSubject = subject.trim();
    
    if (!trimmedSubject) {
      return { isValid: false, error: "Subject is required" };
    }
    
    if (trimmedSubject.length > 200) {
      return { isValid: false, error: "Subject is too long (max 200 characters)" };
    }
    
    return { isValid: true };
  }
  
  /**
   * Validate message content
   */
  static validateMessage(message: string): ValidationResult {
    const trimmedMessage = message.trim();
    
    if (!trimmedMessage) {
      return { isValid: false, error: "Message content is required" };
    }
    
    if (trimmedMessage.length > 50000) {
      return { isValid: false, error: "Message is too long (max 50,000 characters)" };
    }
    
    return { isValid: true };
  }
  
  /**
   * Validate complete email composition
   */
  static validateComposition(recipients: {to: string[], cc: string[], bcc: string[]}, subject: string, message: string): ValidationResult {
    // Validate recipients
    const allRecipients = [...recipients.to, ...recipients.cc, ...recipients.bcc];
    const recipientResult = this.validateEmails(recipients.to);
    if (!recipientResult.isValid) return recipientResult;
    
    // Validate CC recipients if present
    if (recipients.cc.length > 0) {
      const ccResult = this.validateEmails(recipients.cc);
      if (!ccResult.isValid) return ccResult;
    }
    
    // Validate BCC recipients if present
    if (recipients.bcc.length > 0) {
      const bccResult = this.validateEmails(recipients.bcc);
      if (!bccResult.isValid) return bccResult;
    }
    
    // Check for duplicate recipients across all fields
    const uniqueRecipients = new Set(allRecipients);
    if (uniqueRecipients.size !== allRecipients.length) {
      return { isValid: false, error: "Duplicate recipients found" };
    }
    
    // Validate subject
    const subjectResult = this.validateSubject(subject);
    if (!subjectResult.isValid) return subjectResult;
    
    // Validate message
    const messageResult = this.validateMessage(message);
    if (!messageResult.isValid) return messageResult;
    
    return { isValid: true };
  }
  
  /**
   * Parse email string and extract multiple emails
   */
  static parseEmailString(emailString: string): string[] {
    return emailString
      .split(/[,;]/)
      .map(email => email.trim())
      .filter(email => email.length > 0);
  }
  
  /**
   * Check if email is a test email address
   */
  static isTestEmail(email: string): boolean {
    const testDomains = ['resend.dev', 'example.com', 'test.com'];
    return testDomains.some(domain => email.endsWith(`@${domain}`));
  }
}