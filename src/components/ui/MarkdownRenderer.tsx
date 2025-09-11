import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({ content, className = '' }: MarkdownRendererProps) => {
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    let html = '';
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Check for markdown-style headings (##, ###, etc.) and add IDs
      const headingMatch = trimmed.match(/^(#{2,4})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        let headingText = headingMatch[2];
        // Process bold text in headings too
        headingText = headingText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
        const id = `heading-${index}`;
        
        if (level === 2) {
          html += `<h2 id="${id}" class="text-xl font-semibold text-foreground mt-8 mb-4">${headingText}</h2>`;
        } else if (level === 3) {
          html += `<h3 id="${id}" class="text-lg font-semibold text-foreground mt-6 mb-3">${headingText}</h3>`;
        } else if (level === 4) {
          html += `<h4 id="${id}" class="text-base font-semibold text-foreground mt-4 mb-2">${headingText}</h4>`;
        }
      }
      // Check for text that looks like a heading (standalone line with title case) and add IDs
      else if (
        trimmed.length > 10 && 
        trimmed.length < 100 && 
        trimmed.match(/^[A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ][a-zA-ZÀ-ÿ\s:'()0-9-]+$/) &&
        !trimmed.includes('.') &&
        !trimmed.includes(',') &&
        index > 0 && 
        lines[index - 1]?.trim() === '' &&
        (index + 1 >= lines.length || lines[index + 1]?.trim() === '')
      ) {
        const id = `heading-${index}`;
        // Process bold text in auto-detected headings too
        const processedText = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
        html += `<h2 id="${id}" class="text-xl font-semibold text-foreground mt-8 mb-4">${processedText}</h2>`;
      }
      // Process regular text with all markdown elements
      else {
        let processedLine = line
          // Convert bold **text** to <strong>text</strong>
          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
          // Convert links [text](url) to <a href="url">text</a>
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80 underline decoration-2 underline-offset-2 transition-colors">$1</a>');
        
        html += processedLine + '<br>';
      }
    });
    
    return html;
  };

  if (!content) return null;

  return (
    <div 
      className={`prose prose-sm max-w-none text-foreground leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: renderContent(content) }}
    />
  );
};