/**
 * Keyboard shortcuts service for email composer
 */

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  description: string;
  action: string;
}

export type ShortcutAction = 
  | 'send'
  | 'save_draft'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'insert_link'
  | 'toggle_cc'
  | 'toggle_bcc'
  | 'focus_to'
  | 'focus_subject'
  | 'focus_body'
  | 'insert_bullet_list'
  | 'insert_numbered_list'
  | 'undo'
  | 'redo';

export class KeyboardShortcutsService {
  private static readonly SHORTCUTS: Record<ShortcutAction, KeyboardShortcut> = {
    send: {
      key: 'Enter',
      ctrlKey: true,
      description: 'Send email',
      action: 'send'
    },
    save_draft: {
      key: 's',
      ctrlKey: true,
      description: 'Save draft',
      action: 'save_draft'
    },
    bold: {
      key: 'b',
      ctrlKey: true,
      description: 'Bold text',
      action: 'bold'
    },
    italic: {
      key: 'i',
      ctrlKey: true,
      description: 'Italic text',
      action: 'italic'
    },
    underline: {
      key: 'u',
      ctrlKey: true,
      description: 'Underline text',
      action: 'underline'
    },
    insert_link: {
      key: 'k',
      ctrlKey: true,
      description: 'Insert link',
      action: 'insert_link'
    },
    toggle_cc: {
      key: 'c',
      ctrlKey: true,
      shiftKey: true,
      description: 'Toggle CC field',
      action: 'toggle_cc'
    },
    toggle_bcc: {
      key: 'b',
      ctrlKey: true,
      shiftKey: true,
      description: 'Toggle BCC field',
      action: 'toggle_bcc'
    },
    focus_to: {
      key: 't',
      ctrlKey: true,
      description: 'Focus To field',
      action: 'focus_to'
    },
    focus_subject: {
      key: 'j',
      ctrlKey: true,
      description: 'Focus Subject field',
      action: 'focus_subject'
    },
    focus_body: {
      key: 'm',
      ctrlKey: true,
      description: 'Focus message body',
      action: 'focus_body'
    },
    insert_bullet_list: {
      key: 'l',
      ctrlKey: true,
      shiftKey: true,
      description: 'Insert bullet list',
      action: 'insert_bullet_list'
    },
    insert_numbered_list: {
      key: 'n',
      ctrlKey: true,
      shiftKey: true,
      description: 'Insert numbered list',
      action: 'insert_numbered_list'
    },
    undo: {
      key: 'z',
      ctrlKey: true,
      description: 'Undo',
      action: 'undo'
    },
    redo: {
      key: 'y',
      ctrlKey: true,
      description: 'Redo',
      action: 'redo'
    }
  };

  private static listeners: Map<string, (action: ShortcutAction, event: KeyboardEvent) => void> = new Map();

  /**
   * Register keyboard shortcut listener
   */
  static registerListener(id: string, callback: (action: ShortcutAction, event: KeyboardEvent) => void): void {
    this.listeners.set(id, callback);
  }

  /**
   * Unregister keyboard shortcut listener
   */
  static unregisterListener(id: string): void {
    this.listeners.delete(id);
  }

  /**
   * Handle keyboard event
   */
  static handleKeyboardEvent(event: KeyboardEvent): boolean {
    const action = this.getActionFromEvent(event);
    
    if (action) {
      // Prevent default browser behavior for our shortcuts
      event.preventDefault();
      event.stopPropagation();
      
      // Notify all listeners
      this.listeners.forEach(callback => {
        callback(action, event);
      });
      
      return true;
    }
    
    return false;
  }

  /**
   * Get action from keyboard event
   */
  static getActionFromEvent(event: KeyboardEvent): ShortcutAction | null {
    for (const [action, shortcut] of Object.entries(this.SHORTCUTS)) {
      if (this.matchesShortcut(event, shortcut)) {
        return action as ShortcutAction;
      }
    }
    return null;
  }

  /**
   * Check if event matches shortcut
   */
  static matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
    const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
    const ctrlMatches = !!event.ctrlKey === !!shortcut.ctrlKey;
    const shiftMatches = !!event.shiftKey === !!shortcut.shiftKey;
    const altMatches = !!event.altKey === !!shortcut.altKey;
    const metaMatches = !!event.metaKey === !!shortcut.metaKey;

    return keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches;
  }

  /**
   * Get shortcut for action
   */
  static getShortcut(action: ShortcutAction): KeyboardShortcut {
    return this.SHORTCUTS[action];
  }

  /**
   * Get all shortcuts
   */
  static getAllShortcuts(): Record<ShortcutAction, KeyboardShortcut> {
    return { ...this.SHORTCUTS };
  }

  /**
   * Format shortcut for display
   */
  static formatShortcut(shortcut: KeyboardShortcut): string {
    const parts: string[] = [];
    
    if (shortcut.ctrlKey) parts.push('Ctrl');
    if (shortcut.shiftKey) parts.push('Shift');
    if (shortcut.altKey) parts.push('Alt');
    if (shortcut.metaKey) parts.push('Meta');
    
    parts.push(shortcut.key.toUpperCase());
    
    return parts.join(' + ');
  }

  /**
   * Get shortcuts help text
   */
  static getShortcutsHelp(): string {
    const shortcuts = Object.values(this.SHORTCUTS);
    return shortcuts
      .map(shortcut => `${this.formatShortcut(shortcut)}: ${shortcut.description}`)
      .join('\n');
  }

  /**
   * Initialize keyboard shortcuts for an element
   */
  static initializeForElement(element: HTMLElement, id: string, callback: (action: ShortcutAction, event: KeyboardEvent) => void): () => void {
    const handleKeyDown = (event: KeyboardEvent) => {
      this.handleKeyboardEvent(event);
    };

    // Register listener
    this.registerListener(id, callback);
    
    // Add event listener to element
    element.addEventListener('keydown', handleKeyDown);

    // Return cleanup function
    return () => {
      this.unregisterListener(id);
      element.removeEventListener('keydown', handleKeyDown);
    };
  }

  /**
   * Check if target element should ignore shortcuts
   */
  static shouldIgnoreShortcuts(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    
    // Ignore shortcuts in input fields for certain actions
    const inputElements = ['INPUT', 'TEXTAREA', 'SELECT'];
    const isInputElement = inputElements.includes(target.tagName);
    const isContentEditable = target.contentEditable === 'true';
    
    return isInputElement || isContentEditable;
  }

  /**
   * Get platform-specific modifier key
   */
  static getModifierKey(): 'Ctrl' | 'Cmd' {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? 'Cmd' : 'Ctrl';
  }

  /**
   * Update shortcuts for current platform
   */
  static updateShortcutsForPlatform(): void {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    
    if (isMac) {
      // On Mac, use Cmd instead of Ctrl for most shortcuts
      Object.values(this.SHORTCUTS).forEach(shortcut => {
        if (shortcut.ctrlKey) {
          shortcut.ctrlKey = false;
          shortcut.metaKey = true;
        }
      });
    }
  }
}