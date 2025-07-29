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
  onFormatStateChange?: (state: FormatState) => void; // NEW
}

export interface FormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  orderedList: boolean;
  unorderedList: boolean;
  link: boolean;
}

export interface RichTextEditorRef {
  applyFormatting: (command: string, value?: string, previewText?: string) => void; // previewText for links
  focus: () => void;
  getFormatState: () => FormatState;
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(({ 
  value, 
  onChange, 
  placeholder = "Write your email message here...",
  className = "",
  onSelectionChange,
  onFormatStateChange
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

  const getCurrentFormatState = useCallback((): FormatState => {
    if (!editorRef.current) return {
      bold: false, italic: false, underline: false, strikethrough: false, orderedList: false, unorderedList: false, link: false
    };
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return {
      bold: false, italic: false, underline: false, strikethrough: false, orderedList: false, unorderedList: false, link: false
    };
    let node = sel.anchorNode as HTMLElement | null;
    if (node && node.nodeType === 3) node = node.parentElement;
    let state: FormatState = {
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      orderedList: false,
      unorderedList: false,
      link: false
    };
    let el = node;
    while (el && el !== editorRef.current) {
      const tag = el.tagName;
      if (tag === 'B' || tag === 'STRONG') state.bold = true;
      if (tag === 'I' || tag === 'EM') state.italic = true;
      if (tag === 'U') state.underline = true;
      if (tag === 'DEL' || tag === 'S') state.strikethrough = true;
      if (tag === 'A') state.link = true;
      if (tag === 'OL') state.orderedList = true;
      if (tag === 'UL') state.unorderedList = true;
      el = el.parentElement;
    }
    // Also check if inside a list item
    el = node;
    while (el && el !== editorRef.current) {
      if (el.tagName === 'LI') {
        if (el.parentElement?.tagName === 'OL') state.orderedList = true;
        if (el.parentElement?.tagName === 'UL') state.unorderedList = true;
      }
      el = el.parentElement;
    }
    // DEBUG LOG
    console.log('[RTE] getCurrentFormatState:', {
      node: node ? node.tagName : null,
      parent: node?.parentElement?.tagName,
      state
    });
    return state;
  }, []);

  // Handle selection changes for format button states
  const handleSelectionChange = useCallback(() => {
    if (editorRef.current) {
      if (onSelectionChange) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          if (editorRef.current.contains(range.startContainer)) {
            onSelectionChange(0, 0); // (legacy, can be improved)
          }
        }
      }
      if (typeof onFormatStateChange === 'function') {
        onFormatStateChange(getCurrentFormatState());
      }
    }
  }, [onSelectionChange, onFormatStateChange, getCurrentFormatState]);

  // Handle keyboard shortcuts and list Enter/Backspace
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle Enter in lists
    if (e.key === 'Enter') {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        let li = range.startContainer as HTMLElement;
        while (li && li.nodeType === 3) li = li.parentElement!;
        if (li && li.tagName === 'LI') {
          // If the list item is empty, exit the list
          if (li.textContent === '' || li.textContent === '\u200B') {
            e.preventDefault();
            // Move caret after the list
            const parent = li.parentElement;
            if (parent) {
              const after = document.createElement('div');
              after.innerHTML = '<br>';
              parent.insertAdjacentElement('afterend', after);
              const newRange = document.createRange();
              newRange.setStart(after, 0);
              newRange.collapse(true);
              sel.removeAllRanges();
              sel.addRange(newRange);
              // Remove the empty li
              li.remove();
              return;
            }
          }
        }
      }
    }
    // Handle Backspace at start of list item
    if (e.key === 'Backspace') {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        let li = range.startContainer as HTMLElement;
        while (li && li.nodeType === 3) li = li.parentElement!;
        if (li && li.tagName === 'LI') {
          // If caret is at start
          if (range.startOffset === 0) {
            e.preventDefault();
            // Convert to paragraph
            const p = document.createElement('div');
            p.innerHTML = li.innerHTML || '<br>';
            li.parentElement?.insertAdjacentElement('afterend', p);
            li.remove();
            // Move caret to new div
            const newRange = document.createRange();
            newRange.setStart(p, 0);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
            return;
          }
        }
      }
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
  const applyFormatting = useCallback((command: string, value?: string, previewText?: string) => {
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
          // If previewText is provided, insert as <a href=value>previewText</a>
          if (previewText) {
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
              const range = sel.getRangeAt(0);
              range.deleteContents();
              const a = document.createElement('a');
              a.href = value;
              a.target = '_blank';
              a.rel = 'noopener noreferrer';
              a.className = 'text-blue-600 hover:underline';
              a.textContent = previewText;
              range.insertNode(a);
              // Move caret after link
              range.setStartAfter(a);
              range.collapse(true);
              sel.removeAllRanges();
              sel.addRange(range);
            }
          } else {
            document.execCommand('createLink', false, value);
          }
        }
        break;
      case 'insertUnorderedList':
        document.execCommand('insertUnorderedList', false);
        break;
      case 'insertOrderedList':
        document.execCommand('insertOrderedList', false);
        break;
    }
    // Always update the parent component with the new content and format state
    setTimeout(() => {
      if (editorRef.current) {
        const markdownText = convertHTMLToMarkdown(editorRef.current.innerHTML);
        onChange(markdownText);
        if (typeof onFormatStateChange === 'function') {
          const state = getCurrentFormatState();
          onFormatStateChange(state);
          // DEBUG LOG
          const sel = window.getSelection();
          let node = sel && sel.rangeCount > 0 ? sel.anchorNode : null;
          if (node && node.nodeType === 3) node = node.parentElement;
          console.log('[RTE] applyFormatting:', {
            command,
            html: editorRef.current.innerHTML,
            selectionNode: node ? node.tagName : null,
            parent: node?.parentElement?.tagName,
            state
          });
        }
        // Special handling for lists: ensure caret is inside a <li>
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          let node = sel.anchorNode as HTMLElement | null;
          if (node && node.nodeType === 3) node = node.parentElement;
          let foundLI = false;
          let el = node;
          while (el && el !== editorRef.current) {
            if (el.tagName === 'LI') {
              foundLI = true;
              break;
            }
            el = el.parentElement;
          }
          if (!foundLI) {
            // Try to move caret into the first <li> if a list was just created
            const list = editorRef.current.querySelector('ul,ol');
            if (list && list.firstChild && list.firstChild.nodeName === 'LI') {
              const li = list.firstChild as HTMLElement;
              const range = document.createRange();
              range.selectNodeContents(li);
              range.collapse(true);
              sel.removeAllRanges();
              sel.addRange(range);
              if (typeof onFormatStateChange === 'function') {
                const state = getCurrentFormatState();
                onFormatStateChange(state);
                // DEBUG LOG
                console.log('[RTE] moved caret into <li>:', {
                  html: editorRef.current.innerHTML,
                  li,
                  state
                });
              }
            }
          }
        }
      }
    }, 0);
  }, [onChange, convertHTMLToMarkdown, onFormatStateChange, getCurrentFormatState]);

  const focusEditor = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    applyFormatting,
    focus: focusEditor,
    getFormatState: getCurrentFormatState
  }), [applyFormatting, focusEditor, getCurrentFormatState]);

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