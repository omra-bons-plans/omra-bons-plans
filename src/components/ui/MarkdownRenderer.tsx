import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({ content, className = '' }: MarkdownRendererProps) => {
  const renderContent = (text: string) => {
    // Convert markdown to HTML with proper styling
    let html = text
      // Convert headers # ## ### etc. to proper HTML with IDs
      .replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, title) => {
        const level = hashes.length;
        const id = title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
        const classes = {
          1: 'text-2xl font-bold text-foreground mb-4 mt-8',
          2: 'text-xl font-semibold text-foreground mb-3 mt-6',
          3: 'text-lg font-medium text-foreground mb-2 mt-4',
          4: 'text-base font-medium text-foreground mb-2 mt-3',
          5: 'text-sm font-medium text-foreground mb-1 mt-2',
          6: 'text-sm font-medium text-muted-foreground mb-1 mt-2'
        };
        return `<h${level} id="${id}" class="${classes[level as keyof typeof classes] || classes[6]}">${title}</h${level}>`;
      })
      // Convert bold **text** to <strong>text</strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      // Convert links [text](url) to <a href="url">text</a>
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80 underline decoration-2 underline-offset-2 transition-colors">$1</a>')
      // Convert line breaks to <br>
      .replace(/\n/g, '<br>');
    
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