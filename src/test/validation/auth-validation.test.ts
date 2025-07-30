import { describe, it, expect } from 'vitest';

/**
 * Authentication Validation Tests
 * 
 * These tests verify the validation logic for authentication forms,
 * including email format validation, password requirements, and 
 * form data structure validation.
 */

describe('Authentication Validation', () => {
  describe('Email Validation', () => {
    const validateEmail = (email: string): boolean => {
      // More comprehensive email validation regex that prevents leading/trailing dots
      const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    };

    it('accepts valid email formats', () => {
      const validEmails = [
        'user@domain.com',
        'user.name@domain.com',
        'user+tag@domain.com',
        'user123@domain.co.uk',
        'test.email+tag@subdomain.domain.org',
        'a@b.co',
        'user@domain-with-dashes.com',
        'user_name@domain.com',
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('rejects invalid email formats', () => {
      const invalidEmails = [
        '',
        'plainaddress',
        '@missingdomain.com',
        'missing@.com',
        'missing@domain',
        'spaces @domain.com',
        'user@',
        '@domain.com',
        'user@domain.',
        '.user@domain.com',
        'user@.domain.com',
        'user name@domain.com',
        'user@domain .com',
        'user@domain,com',
        'user@domain.c', // TLD too short
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });

    it('handles edge cases for email validation', () => {
      const edgeCases = [
        { email: 'ab@cd.co', valid: true }, // shortest valid email
        { email: 'user@domain.museum', valid: true }, // long TLD
        { email: 'user+tag+another@domain.com', valid: true }, // multiple plus signs
        { email: 'user@sub.sub.domain.com', valid: true }, // multiple subdomains
      ];

      edgeCases.forEach(({ email, valid }) => {
        expect(validateEmail(email)).toBe(valid);
      });
    });
  });

  describe('Password Validation', () => {
    const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];

      if (!password) {
        errors.push('Password is required');
        return { valid: false, errors };
      }

      if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
      }

      if (password.length > 128) {
        errors.push('Password must be less than 128 characters long');
      }

      // Check for at least one letter
      if (!/[a-zA-Z]/.test(password)) {
        errors.push('Password must contain at least one letter');
      }

      // Check for at least one number
      if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
      }

      return { valid: errors.length === 0, errors };
    };

    it('accepts strong passwords', () => {
      const strongPasswords = [
        'password123',
        'mySecureP4ss',
        'TestPassword1',
        'complexPass123!',
        '12345678a',
        'abcdefgh1',
      ];

      strongPasswords.forEach(password => {
        const result = validatePassword(password);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('rejects weak passwords', () => {
      const weakPasswords = [
        { password: '', expectedErrors: ['Password is required'] },
        { password: 'short', expectedErrors: ['Password must be at least 8 characters long'] },
        { password: '12345678', expectedErrors: ['Password must contain at least one letter'] },
        { password: 'abcdefgh', expectedErrors: ['Password must contain at least one number'] },
        { password: 'abc123', expectedErrors: ['Password must be at least 8 characters long'] },
      ];

      weakPasswords.forEach(({ password, expectedErrors }) => {
        const result = validatePassword(password);
        expect(result.valid).toBe(false);
        expectedErrors.forEach(error => {
          expect(result.errors).toContain(error);
        });
      });
    });

    it('handles very long passwords', () => {
      const veryLongPassword = 'a'.repeat(129) + '1';
      const result = validatePassword(veryLongPassword);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be less than 128 characters long');
    });
  });

  describe('Name Validation', () => {
    const validateName = (name: string): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];

      if (!name || name.trim() === '') {
        errors.push('Name is required');
        return { valid: false, errors };
      }

      if (name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
      }

      if (name.length > 100) {
        errors.push('Name must be less than 100 characters long');
      }

      // Check for valid characters (letters, spaces, hyphens, apostrophes)
      // Using Unicode property escapes to support international characters
      if (!/^[\p{L}\s'-]+$/u.test(name)) {
        errors.push('Name can only contain letters, spaces, hyphens, and apostrophes');
      }

      return { valid: errors.length === 0, errors };
    };

    it('accepts valid names', () => {
      const validNames = [
        'John Doe',
        'Mary-Jane Smith',
        "O'Connor",
        'José María',
        'Jean-Pierre',
        'Anne-Marie',
        'Van Der Berg',
        'Ibn Rushd',
        'Li Wei',
        'Muhammad Al-Rashid',
      ];

      validNames.forEach(name => {
        const result = validateName(name);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('rejects invalid names', () => {
      const invalidNames = [
        { name: '', expectedErrors: ['Name is required'] },
        { name: '   ', expectedErrors: ['Name is required'] },
        { name: 'A', expectedErrors: ['Name must be at least 2 characters long'] },
        { name: 'John123', expectedErrors: ['Name can only contain letters, spaces, hyphens, and apostrophes'] },
        { name: 'John@Doe', expectedErrors: ['Name can only contain letters, spaces, hyphens, and apostrophes'] },
        { name: 'User.Name', expectedErrors: ['Name can only contain letters, spaces, hyphens, and apostrophes'] },
      ];

      invalidNames.forEach(({ name, expectedErrors }) => {
        const result = validateName(name);
        expect(result.valid).toBe(false);
        expectedErrors.forEach(error => {
          expect(result.errors).toContain(error);
        });
      });
    });

    it('handles very long names', () => {
      const veryLongName = 'A'.repeat(101);
      const result = validateName(veryLongName);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Name must be less than 100 characters long');
    });
  });

  describe('Form Data Validation', () => {
    interface AuthFormData {
      email: string;
      name: string;
      password: string;
      flow: 'signIn' | 'signUp';
    }

    const validateAuthForm = (data: Partial<AuthFormData>): { valid: boolean; errors: Record<string, string[]> } => {
      const errors: Record<string, string[]> = {};

      // Email validation
      if (!data.email) {
        errors.email = ['Email is required'];
      } else {
        const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(data.email)) {
          errors.email = ['Please enter a valid email address'];
        }
      }

      // Name validation
      if (!data.name || data.name.trim() === '') {
        errors.name = ['Name is required'];
      } else if (data.name.trim().length < 2) {
        errors.name = ['Name must be at least 2 characters long'];
      }

      // Password validation
      if (!data.password) {
        errors.password = ['Password is required'];
      } else if (data.password.length < 8) {
        errors.password = ['Password must be at least 8 characters long'];
      }

      // Flow validation
      if (!data.flow || !['signIn', 'signUp'].includes(data.flow)) {
        errors.flow = ['Invalid authentication flow'];
      }

      return { valid: Object.keys(errors).length === 0, errors };
    };

    it('validates complete form data successfully', () => {
      const validFormData: AuthFormData = {
        email: 'user@verified-domain.com',
        name: 'John Doe',
        password: 'securepassword123',
        flow: 'signUp',
      };

      const result = validateAuthForm(validFormData);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('identifies multiple validation errors', () => {
      const invalidFormData: Partial<AuthFormData> = {
        email: 'invalid-email',
        name: '',
        password: 'short',
        flow: 'invalid' as any,
      };

      const result = validateAuthForm(invalidFormData);
      expect(result.valid).toBe(false);
      expect(result.errors.email).toContain('Please enter a valid email address');
      expect(result.errors.name).toContain('Name is required');
      expect(result.errors.password).toContain('Password must be at least 8 characters long');
      expect(result.errors.flow).toContain('Invalid authentication flow');
    });

    it('handles missing required fields', () => {
      const incompleteFormData: Partial<AuthFormData> = {};

      const result = validateAuthForm(incompleteFormData);
      expect(result.valid).toBe(false);
      expect(result.errors.email).toContain('Email is required');
      expect(result.errors.name).toContain('Name is required');
      expect(result.errors.password).toContain('Password is required');
    });

    it('validates sign-in vs sign-up flow requirements', () => {
      const signInData: AuthFormData = {
        email: 'existing@domain.com',
        name: 'Existing User',
        password: 'existingpassword123',
        flow: 'signIn',
      };

      const signUpData: AuthFormData = {
        email: 'new@domain.com',
        name: 'New User',
        password: 'newpassword123',
        flow: 'signUp',
      };

      expect(validateAuthForm(signInData).valid).toBe(true);
      expect(validateAuthForm(signUpData).valid).toBe(true);
    });
  });

  describe('Security Validation', () => {
    it('prevents injection attacks in email field', () => {
      const maliciousEmails = [
        'user@domain.com<script>alert("xss")</script>',
        'user@domain.com"; DROP TABLE users; --',
        'user@domain.com\'; INSERT INTO users VALUES (\'hacker\'); --',
      ];

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      maliciousEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });

    it('prevents injection attacks in name field', () => {
      const maliciousNames = [
        'John<script>alert("xss")</script>',
        'John"; DROP TABLE users; --',
        'John\'; DELETE FROM users; --',
      ];

      const nameRegex = /^[\p{L}\s'-]+$/u;
      
      maliciousNames.forEach(name => {
        expect(nameRegex.test(name)).toBe(false);
      });
    });

    it('handles special characters safely', () => {
      const specialCharacterInputs = [
        { input: 'user@domain.com\n', expected: false },
        { input: 'user@domain.com\r', expected: false },
        { input: 'user@domain.com\t', expected: false },
        { input: 'user@domain.com\0', expected: false },
      ];

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      specialCharacterInputs.forEach(({ input, expected }) => {
        expect(emailRegex.test(input)).toBe(expected);
      });
    });
  });
});