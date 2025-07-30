/**
 * Email formatting service for rich text formatting
 */

export type FormatType = 'bold' | 'italic' | 'underline' | 'strikethrough';
export type AlignType = 'left' | 'center' | 'right';
export type ListType = 'bullet' | 'numbered';

export interface FormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  align: AlignType;
}

export interface TextSelection {
  start: number;
  end: number;
  text: string;
}

export class EmailFormattingService {
  /**
   * Apply formatting to selected text
   */
  static applyFormat(text: string, selection: TextSelection, format: FormatType): string {
    const { start, end } = selection;
    const selectedText = text.substring(start, end);
    
    if (!selectedText) return text;
    
    let formattedText = selectedText;
    
    switch (format) {
      case 'bold':
        if (this.hasFormat(selectedText, 'bold')) {
          formattedText = this.removeFormat(selectedText, 'bold');
        } else {
          formattedText = `**${selectedText}**`;
        }
        break;
      case 'italic':
        if (this.hasFormat(selectedText, 'italic')) {
          formattedText = this.removeFormat(selectedText, 'italic');
        } else {
          formattedText = `*${selectedText}*`;
        }
        break;
      case 'underline':
        if (this.hasFormat(selectedText, 'underline')) {
          formattedText = this.removeFormat(selectedText, 'underline');
        } else {
          formattedText = `<u>${selectedText}</u>`;
        }
        break;
      case 'strikethrough':
        if (this.hasFormat(selectedText, 'strikethrough')) {
          formattedText = this.removeFormat(selectedText, 'strikethrough');
        } else {
          formattedText = `~~${selectedText}~~`;
        }
        break;
    }
    
    return text.substring(0, start) + formattedText + text.substring(end);
  }
  
  /**
   * Check if text has specific formatting
   */
  static hasFormat(text: string, format: FormatType): boolean {
    switch (format) {
      case 'bold':
        return text.startsWith('**') && text.endsWith('**');
      case 'italic':
        return text.startsWith('*') && text.endsWith('*') && !text.startsWith('**');
      case 'underline':
        return text.startsWith('<u>') && text.endsWith('</u>');
      case 'strikethrough':
        return text.startsWith('~~') && text.endsWith('~~');
      default:
        return false;
    }
  }
  
  /**
   * Remove formatting from text
   */
  static removeFormat(text: string, format: FormatType): string {
    switch (format) {
      case 'bold':
        return text.replace(/^\*\*(.*)\*\*$/, '$1');
      case 'italic':
        return text.replace(/^\*(.*)\*$/, '$1');
      case 'underline':
        return text.replace(/^<u>(.*)<\/u>$/, '$1');
      case 'strikethrough':
        return text.replace(/^~~(.*)~~$/, '$1');
      default:
        return text;
    }
  }
  
  /**
   * Insert a list at cursor position
   */
  static insertList(text: string, cursorPosition: number, type: ListType): { text: string; newCursorPosition: number } {
    const lines = text.split('\n');
    let currentLine = 0;
    let currentPosition = 0;
    
    // Find which line the cursor is on
    for (let i = 0; i < lines.length; i++) {
      if (currentPosition + lines[i].length >= cursorPosition) {
        currentLine = i;
        break;
      }
      currentPosition += lines[i].length + 1; // +1 for newline
    }
    
    const listPrefix = type === 'bullet' ? '• ' : '1. ';
    const currentLineText = lines[currentLine];
    
    // If line already has list formatting, remove it
    if (currentLineText.match(/^[\s]*[•\-*][\s]/) || currentLineText.match(/^[\s]*\d+\.[\s]/)) {
      lines[currentLine] = currentLineText.replace(/^[\s]*([•\-*]|\d+\.)[\s]/, '');
    } else {
      // Add list formatting
      lines[currentLine] = listPrefix + currentLineText;
    }
    
    const newText = lines.join('\n');
    const newCursorPosition = cursorPosition + (newText.length - text.length);
    
    return { text: newText, newCursorPosition };
  }
  
  /**
   * Insert a link at cursor position
   */
  static insertLink(text: string, cursorPosition: number, url: string, linkText?: string): { text: string; newCursorPosition: number } {
    const displayText = linkText || url;
    const linkMarkdown = `[${displayText}](${url})`;
    
    const newText = text.substring(0, cursorPosition) + linkMarkdown + text.substring(cursorPosition);
    const newCursorPosition = cursorPosition + linkMarkdown.length;
    
    return { text: newText, newCursorPosition };
  }
  
  /**
   * Convert markdown formatting to HTML for email sending
   */
  static convertToHtml(text: string): string {
    let html = text;
    
    // Convert bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert strikethrough
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    // Convert links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // Convert bullet lists
    html = html.replace(/^[\s]*[•\-*][\s](.*)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Convert numbered lists
    html = html.replace(/^[\s]*\d+\.[\s](.*)$/gm, '<li>$1</li>');
    
    // Convert line breaks
    html = html.replace(/\n/g, '<br>');
    
    return html;
  }
  
  /**
   * Get current format state at cursor position
   */
  static getFormatStateAtPosition(text: string, cursorPosition: number): FormatState {
    // Find the current word or selection around cursor
    const beforeCursor = text.substring(0, cursorPosition);
    const afterCursor = text.substring(cursorPosition);
    
    // Simple detection - check if cursor is within formatted text
    const bold = beforeCursor.includes('**') && afterCursor.includes('**');
    const italic = beforeCursor.includes('*') && afterCursor.includes('*') && !bold;
    const underline = beforeCursor.includes('<u>') && afterCursor.includes('</u>');
    const strikethrough = beforeCursor.includes('~~') && afterCursor.includes('~~');
    
    return {
      bold,
      italic,
      underline,
      strikethrough,
      align: 'left' // Default alignment
    };
  }
  
  /**
   * Clean up formatting for plain text email
   */
  static stripFormatting(text: string): string {
    let plainText = text;
    
    // Remove markdown formatting
    plainText = plainText.replace(/\*\*(.*?)\*\*/g, '$1'); // Bold
    plainText = plainText.replace(/\*(.*?)\*/g, '$1'); // Italic
    plainText = plainText.replace(/~~(.*?)~~/g, '$1'); // Strikethrough
    plainText = plainText.replace(/<u>(.*?)<\/u>/g, '$1'); // Underline
    plainText = plainText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Links
    
    // Remove list formatting
    plainText = plainText.replace(/^[\s]*[•\-*][\s]/gm, '');
    plainText = plainText.replace(/^[\s]*\d+\.[\s]/gm, '');
    
    return plainText;
  }
}