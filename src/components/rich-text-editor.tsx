/**
 * Rich text editor component with live preview
 */

import { useRef, useEffect, useCallback, useState, forwardRef, useImperativeHandle } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onSelectionChange?: (start: number, end: number) => void;
}

export interface RichTextEditorRef {
  applyFormatting: (command: string, value?: string) => void;
  focus: () => void;
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(({ 
  value, 
  onChange, 
  placeholder = "Write your email message here...",
  className = "",
  onSelectionChange 
}, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize editor content only once
  useEffect(() => {
    if (editorRef.current && !isInitialized && value) {
      editorRef.current.innerHTML = convertMarkdownToHTML(value);
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  // Convert markdown-like syntax to HTML for initial display
  const convertMarkdownToHTML = useCallback((text: string): string => {
    let html = text;
    
    // Convert bold **text** to <strong>text</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert italic *text* to <em>text</em> (but not if it's part of **)
    html = html.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
    
    // Convert strikethrough ~~text~~ to <del>text</del>
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    // Convert links [text](url) to <a href="url">text</a>
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>');
    
    // Convert bullet lists
    html = html.replace(/^[\s]*[•\-\*][\s](.*)$/gm, '<li class="ml-4">• $1</li>');
    
    // Convert numbered lists  
    html = html.replace(/^[\s]*\d+\.[\s](.*)$/gm, '<li class="ml-4">$1</li>');
    
    // Convert line breaks
    html = html.replace(/\n/g, '<br>');
    
    return html;
  }, []);

  // Convert HTML back to markdown for storage
  const convertHTMLToMarkdown = useCallback((html: string): string => {
    let text = html;
    
    // Convert HTML back to markdown-like syntax
    text = text.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
    text = text.replace(/<b>(.*?)<\/b>/g, '**$1**');
    text = text.replace(/<em>(.*?)<\/em>/g, '*$1*');
    text = text.replace(/<i>(.*?)<\/i>/g, '*$1*');
    text = text.replace(/<del>(.*?)<\/del>/g, '~~$1~~');
    text = text.replace(/<u>(.*?)<\/u>/g, '<u>$1</u>'); // Keep underline as HTML
    text = text.replace(/<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g, '[$2]($1)');
    text = text.replace(/<li[^>]*>•\s*(.*?)<\/li>/g, '• $1');
    text = text.replace(/<li[^>]*>(.*?)<\/li>/g, '1. $1');
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<div><br><\/div>/gi, '\n');
    text = text.replace(/<div>/gi, '\n');
    text = text.replace(/<\/div>/gi, '');
    text = text.replace(/<[^>]+>/g, ''); // Remove any remaining HTML tags
    
    return text.trim();
  }, []);

  // Handle content changes
  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const editor = e.currentTarget;
    const markdownText = convertHTMLToMarkdown(editor.innerHTML);
    onChange(markdownText);
  }, [onChange, convertHTMLToMarkdown]);

  // Handle selection changes for format button states
  const handleSelectionChange = useCallback(() => {
    if (editorRef.current && onSelectionChange) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (editorRef.current.contains(range.startContainer)) {
          // You can add logic here to determine active formats
          onSelectionChange(0, 0); // Simplified for now
        }
      }
    }
  }, [onSelectionChange]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle Enter key for line breaks
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertHTML', false, '<br><br>');
      return;
    }

    // Handle Tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
      return;
    }

    // Let formatting shortcuts pass through
    if (e.ctrlKey || e.metaKey) {
      return;
    }
  }, []);

  // Handle paste events
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  // Apply formatting at cursor position
  const applyFormatting = useCallback((command: string, value?: string) => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    
    switch (command) {
      case 'bold':
        document.execCommand('bold', false);
        break;
      case 'italic':
        document.execCommand('italic', false);
        break;
      case 'underline':
        document.execCommand('underline', false);
        break;
      case 'strikethrough':
        document.execCommand('strikeThrough', false);
        break;
      case 'insertLink':
        if (value) {
          document.execCommand('createLink', false, value);
        }
        break;
      case 'insertUnorderedList':
        document.execCommand('insertUnorderedList', false);
        break;
      case 'insertOrderedList':
        document.execCommand('insertOrderedList', false);
        break;
    }

    // Update the parent component with the new content
    setTimeout(() => {
      if (editorRef.current) {
        const markdownText = convertHTMLToMarkdown(editorRef.current.innerHTML);
        onChange(markdownText);
      }
    }, 0);
  }, [onChange, convertHTMLToMarkdown]);

  const focusEditor = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    applyFormatting,
    focus: focusEditor
  }), [applyFormatting, focusEditor]);

  // Set up selection change listener
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [handleSelectionChange]);

  return (
    <div className="relative">
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className={`
          min-h-[300px] p-3 
          focus:outline-none focus:ring-0 
          prose prose-sm max-w-none
          ${className}
        `}
        style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />
      
      {/* Placeholder */}
      {!value && (
        <div 
          className="absolute top-3 left-3 pointer-events-none text-muted-foreground"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {placeholder}
        </div>
      )}
      
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #6b7280;
          pointer-events: none;
        }
        
        [contenteditable] strong, [contenteditable] b {
          font-weight: bold;
        }
        
        [contenteditable] em, [contenteditable] i {
          font-style: italic;
        }
        
        [contenteditable] del {
          text-decoration: line-through;
        }
        
        [contenteditable] u {
          text-decoration: underline;
        }
        
        [contenteditable] a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        [contenteditable] a:hover {
          text-decoration: none;
        }
      `}</style>
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';