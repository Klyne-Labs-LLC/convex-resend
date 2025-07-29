/**
 * Custom hook for email composer functionality
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Recipients, RecipientManagementService } from '@/services/recipient-management';
import { EmailFormattingService, FormatType, TextSelection } from '@/services/email-formatting';
import { EmailValidationService } from '@/services/email-validation';
import { KeyboardShortcutsService, ShortcutAction } from '@/services/keyboard-shortcuts';
import { EmailTemplate, EmailTemplateService } from '@/services/email-templates';

export interface EmailComposerState {
  recipients: Recipients;
  subject: string;
  message: string;
  priority: 'low' | 'normal' | 'high';
  requestReceipt: boolean;
  confidential: boolean;
  scheduleTime: string;
  showCC: boolean;
  showBCC: boolean;
  isSending: boolean;
  success: boolean;
  error: string | null;
  activeFormats: Set<string>;
}

export interface EmailComposerActions {
  // Recipient management
  addRecipient: (type: keyof Recipients, email: string) => void;
  removeRecipient: (type: keyof Recipients, email: string) => void;
  addMultipleRecipients: (type: keyof Recipients, emailString: string) => void;
  clearRecipients: (type?: keyof Recipients) => void;
  
  // Content management
  setSubject: (subject: string) => void;
  setMessage: (message: string) => void;
  applyFormatting: (format: FormatType, selection?: TextSelection) => void;
  insertList: (type: 'bullet' | 'numbered', cursorPosition: number) => void;
  insertLink: (url: string, text?: string, cursorPosition?: number) => void;
  
  // UI controls
  setShowCC: (show: boolean) => void;
  setShowBCC: (show: boolean) => void;
  setPriority: (priority: 'low' | 'normal' | 'high') => void;
  setRequestReceipt: (request: boolean) => void;
  setConfidential: (confidential: boolean) => void;
  setScheduleTime: (time: string) => void;
  
  // Actions
  sendEmail: () => Promise<void>;
  saveDraft: () => void;
  clearForm: () => void;
  loadTemplate: (template: EmailTemplate, variables?: Record<string, string>) => void;
  
  // Validation
  validateForm: () => { isValid: boolean; error?: string };
}

export function useEmailComposer() {
  const sendEmailMutation = useMutation(api.emails.sendEmail);
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Keep for backward compatibility
  
  // State
  const [state, setState] = useState<EmailComposerState>({
    recipients: { to: [], cc: [], bcc: [] },
    subject: '',
    message: '',
    priority: 'normal',
    requestReceipt: false,
    confidential: false,
    scheduleTime: '',
    showCC: false,
    showBCC: false,
    isSending: false,
    success: false,
    error: null,
    activeFormats: new Set()
  });

  // Helper to update state
  const updateState = useCallback((updates: Partial<EmailComposerState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Recipient management
  const addRecipient = useCallback((type: keyof Recipients, email: string) => {
    try {
      const newRecipients = RecipientManagementService.addRecipient(state.recipients, type, email);
      updateState({ recipients: newRecipients, error: null });
      
      // Save to recent recipients
      RecipientManagementService.saveRecentRecipient(email);
    } catch (error) {
      updateState({ error: error instanceof Error ? error.message : 'Failed to add recipient' });
    }
  }, [state.recipients, updateState]);

  const removeRecipient = useCallback((type: keyof Recipients, email: string) => {
    const newRecipients = RecipientManagementService.removeRecipient(state.recipients, type, email);
    updateState({ recipients: newRecipients });
  }, [state.recipients, updateState]);

  const addMultipleRecipients = useCallback((type: keyof Recipients, emailString: string) => {
    const newRecipients = RecipientManagementService.addMultipleRecipients(state.recipients, type, emailString);
    updateState({ recipients: newRecipients });
  }, [state.recipients, updateState]);

  const clearRecipients = useCallback((type?: keyof Recipients) => {
    if (type) {
      const newRecipients = RecipientManagementService.clearField(state.recipients, type);
      updateState({ recipients: newRecipients });
    } else {
      updateState({ recipients: RecipientManagementService.clearAllRecipients() });
    }
  }, [state.recipients, updateState]);

  // Content management
  const setSubject = useCallback((subject: string) => {
    updateState({ subject, error: null });
  }, [updateState]);

  const setMessage = useCallback((message: string) => {
    updateState({ message, error: null });
  }, [updateState]);

  const applyFormatting = useCallback((format: FormatType, selection?: TextSelection) => {
    if (!editorRef.current) return;
    
    const editor = editorRef.current as any;
    if (editor.applyFormatting) {
      editor.applyFormatting(format);
    }
  }, []);

  const insertList = useCallback((type: 'bullet' | 'numbered', cursorPosition: number) => {
    if (editorRef.current) {
      const editor = editorRef.current as any;
      if (editor.applyFormatting) {
        if (type === 'bullet') {
          editor.applyFormatting('insertUnorderedList');
        } else {
          editor.applyFormatting('insertOrderedList');
        }
      }
    } else {
      // Fallback for textarea mode
      const result = EmailFormattingService.insertList(state.message, cursorPosition, type);
      updateState({ message: result.text });
      
      if (textareaRef.current) {
        setTimeout(() => {
          textareaRef.current!.focus();
          textareaRef.current!.setSelectionRange(result.newCursorPosition, result.newCursorPosition);
        }, 0);
      }
    }
  }, [state.message, updateState]);

  const insertLink = useCallback((url: string, text?: string, cursorPosition?: number) => {
    if (editorRef.current) {
      const editor = editorRef.current as any;
      if (editor.applyFormatting) {
        editor.applyFormatting('insertLink', url);
      }
    } else {
      // Fallback for textarea mode
      const position = cursorPosition ?? textareaRef.current?.selectionStart ?? 0;
      const result = EmailFormattingService.insertLink(state.message, position, url, text);
      updateState({ message: result.text });
      
      if (textareaRef.current) {
        setTimeout(() => {
          textareaRef.current!.focus();
          textareaRef.current!.setSelectionRange(result.newCursorPosition, result.newCursorPosition);
        }, 0);
      }
    }
  }, [state.message, updateState]);

  // UI controls
  const setShowCC = useCallback((show: boolean) => {
    updateState({ showCC: show });
  }, [updateState]);

  const setShowBCC = useCallback((show: boolean) => {
    updateState({ showBCC: show });
  }, [updateState]);

  const setPriority = useCallback((priority: 'low' | 'normal' | 'high') => {
    updateState({ priority });
  }, [updateState]);

  const setRequestReceipt = useCallback((request: boolean) => {
    updateState({ requestReceipt: request });
  }, [updateState]);

  const setConfidential = useCallback((confidential: boolean) => {
    updateState({ confidential });
  }, [updateState]);

  const setScheduleTime = useCallback((time: string) => {
    updateState({ scheduleTime: time });
  }, [updateState]);

  // Validation
  const validateForm = useCallback(() => {
    return EmailValidationService.validateComposition(state.recipients, state.subject, state.message);
  }, [state.recipients, state.subject, state.message]);

  // Actions
  const sendEmail = useCallback(async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      updateState({ error: validation.error });
      return;
    }

    updateState({ isSending: true, error: null });
    
    try {
      // For now, send to the first recipient only (Convex API limitation)
      const exportedRecipients = RecipientManagementService.exportForSending(state.recipients);
      
      await sendEmailMutation({
        to: exportedRecipients.primary,
        subject: state.subject,
        body: EmailFormattingService.convertToHtml(state.message)
      });
      
      updateState({ 
        success: true,
        isSending: false
      });
      
      // Clear form after successful send
      setTimeout(() => {
        clearForm();
        updateState({ success: false });
      }, 3000);
      
    } catch (error) {
      updateState({ 
        error: error instanceof Error ? error.message : 'Failed to send email',
        isSending: false 
      });
    }
  }, [validateForm, sendEmailMutation, state.recipients, state.subject, state.message, updateState]);

  const saveDraft = useCallback(() => {
    // TODO: Implement draft saving
    console.log('Saving draft...');
  }, []);

  const clearForm = useCallback(() => {
    updateState({
      recipients: { to: [], cc: [], bcc: [] },
      subject: '',
      message: '',
      priority: 'normal',
      requestReceipt: false,
      confidential: false,
      scheduleTime: '',
      showCC: false,
      showBCC: false,
      error: null,
      activeFormats: new Set()
    });
  }, [updateState]);

  const loadTemplate = useCallback((template: EmailTemplate, variables?: Record<string, string>) => {
    const applied = EmailTemplateService.applyTemplate(template, variables);
    updateState({
      subject: applied.subject,
      message: applied.body
    });
  }, [updateState]);

  // Keyboard shortcuts
  const handleKeyboardShortcut = useCallback((action: ShortcutAction, event: KeyboardEvent) => {
    switch (action) {
      case 'send':
        if (!state.isSending) {
          sendEmail();
        }
        break;
      case 'save_draft':
        saveDraft();
        break;
      case 'bold':
        applyFormatting('bold');
        break;
      case 'italic':
        applyFormatting('italic');
        break;
      case 'underline':
        applyFormatting('underline');
        break;
      case 'toggle_cc':
        setShowCC(!state.showCC);
        break;
      case 'toggle_bcc':
        setShowBCC(!state.showBCC);
        break;
      case 'insert_bullet_list':
        if (editorRef.current) {
          insertList('bullet', 0); // Position doesn't matter for rich text editor
        } else if (textareaRef.current) {
          insertList('bullet', textareaRef.current.selectionStart);
        }
        break;
      case 'insert_numbered_list':
        if (editorRef.current) {
          insertList('numbered', 0); // Position doesn't matter for rich text editor
        } else if (textareaRef.current) {
          insertList('numbered', textareaRef.current.selectionStart);
        }
        break;
    }
  }, [state, sendEmail, saveDraft, applyFormatting, setShowCC, setShowBCC, insertList]);

  // Setup keyboard shortcuts
  useEffect(() => {
    KeyboardShortcutsService.registerListener('email-composer', handleKeyboardShortcut);
    
    return () => {
      KeyboardShortcutsService.unregisterListener('email-composer');
    };
  }, [handleKeyboardShortcut]);

  const actions: EmailComposerActions = {
    addRecipient,
    removeRecipient,
    addMultipleRecipients,
    clearRecipients,
    setSubject,
    setMessage,
    applyFormatting,
    insertList,
    insertLink,
    setShowCC,
    setShowBCC,
    setPriority,
    setRequestReceipt,
    setConfidential,
    setScheduleTime,
    sendEmail,
    saveDraft,
    clearForm,
    loadTemplate,
    validateForm
  };

  return {
    state,
    actions,
    textareaRef,
    editorRef
  };
}