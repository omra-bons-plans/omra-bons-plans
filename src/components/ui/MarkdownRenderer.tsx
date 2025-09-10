import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({ content, className = '' }: MarkdownRendererProps) => {
  const renderContent = (text: string) => {
    // Convert markdown to HTML with proper styling
    let html = text
      // Convert headings
      .replace(/^### (.*)$/gm, '<h3 class="text-lg font-semibold text-foreground mt-6 mb-3">$1</h3>')
      .replace(/^## (.*)$/gm, '<h2 class="text-xl font-semibold text-foreground mt-8 mb-4">$1</h2>')
      .replace(/^# (.*)$/gm, '<h1 class="text-2xl font-bold text-foreground mt-8 mb-6">$1</h1>')
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