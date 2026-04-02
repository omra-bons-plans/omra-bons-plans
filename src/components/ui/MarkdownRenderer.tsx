import React from 'react';
import DOMPurify from 'dompurify';
import VideoPlayer from './VideoPlayer';
import { getImageUrl } from '@/utils/imageUtils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({ content, className = '' }: MarkdownRendererProps) => {
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Check for YouTube URLs (standalone lines)
      const youtubeMatch = trimmed.match(/^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
      if (youtubeMatch) {
        elements.push(
          <div key={`video-${index}`} className="my-6">
            <VideoPlayer 
              videoUrl={trimmed} 
              title="Vidéo intégrée"
              className="w-full max-w-2xl"
            />
          </div>
        );
        return;
      }
      
      // Check for markdown-style headings (##, ###, etc.) and add IDs
      const headingMatch = trimmed.match(/^(#{2,4})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        let headingText = headingMatch[2];
        // Process bold text in headings too
        headingText = headingText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
        const id = `heading-${index}`;
        
        // Sanitize heading content
        const sanitizedHeading = DOMPurify.sanitize(headingText, { 
          ALLOWED_TAGS: ['strong', 'em', 'code'],
          ALLOWED_ATTR: ['class']
        });
        
        if (level === 2) {
          elements.push(
            <h2 key={`h2-${index}`} id={id} className="text-xl font-semibold text-foreground mt-8 mb-4" 
                dangerouslySetInnerHTML={{ __html: sanitizedHeading }} />
          );
        } else if (level === 3) {
          elements.push(
            <h3 key={`h3-${index}`} id={id} className="text-lg font-semibold text-foreground mt-6 mb-3" 
                dangerouslySetInnerHTML={{ __html: sanitizedHeading }} />
          );
        } else if (level === 4) {
          elements.push(
            <h4 key={`h4-${index}`} id={id} className="text-base font-semibold text-foreground mt-4 mb-2" 
                dangerouslySetInnerHTML={{ __html: sanitizedHeading }} />
          );
        }
        return;
      }
      
      // Check for text that looks like a heading (standalone line with title case) and add IDs
      if (
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
        const sanitizedHeading = DOMPurify.sanitize(processedText, { 
          ALLOWED_TAGS: ['strong', 'em', 'code'],
          ALLOWED_ATTR: ['class']
        });
        elements.push(
          <h2 key={`auto-h2-${index}`} id={id} className="text-xl font-semibold text-foreground mt-8 mb-4" 
              dangerouslySetInnerHTML={{ __html: sanitizedHeading }} />
        );
        return;
      }
      
      // Check for images first ![alt](url) ou [Image](url)
      const imageMatch = trimmed.match(/^!?\[([^\]]*)\]\(([^)]+)\)$/);
      const isImage = trimmed.startsWith('![') || (imageMatch && imageMatch[1]?.toLowerCase() === 'image');
      
      if (imageMatch && isImage) {
        const altText = imageMatch[1] || 'Image';
        let imageUrl = imageMatch[2];
        
        // Si ce n'est pas déjà une URL complète, utiliser le bucket blog-images par défaut
        if (!imageUrl.startsWith('http')) {
          imageUrl = getImageUrl(imageUrl, undefined, 'blog-images');
        }
        
        elements.push(
          <div key={`image-${index}`} className="my-6">
            <img 
              src={imageUrl} 
              alt={altText}
              className="max-w-full h-auto rounded-lg shadow-sm border border-border/20 mx-auto block"
              loading="lazy"
            />
            {altText && altText !== 'Image' && (
              <p className="text-sm text-muted-foreground text-center mt-2 italic">
                {altText}
              </p>
            )}
          </div>
        );
        return;
      }
      
      // Process regular text with all markdown elements
      let processedLine = line
        // Convert bold **text** to <strong>text</strong>
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
        // Convert images ![alt](url) to <img> (for inline images in text)
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
          let optimizedUrl = url;
          if (!url.startsWith('http')) {
            optimizedUrl = getImageUrl(url, undefined, 'blog-images');
          }
          // 🔐 SECURITY: Use class instead of inline style to prevent CSS injection
          return `<img src="${optimizedUrl}" alt="${alt}" class="inline-block max-w-full h-auto rounded border border-border/20 mx-1 block markdown-img-inline" loading="lazy" />`;
        })
        // Convert links [text](url) to <a href="url">text</a>
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80 underline decoration-2 underline-offset-2 transition-colors">$1</a>');
      
      // 🔐 SECURITY: Sanitize the processed line
      // ⚠️ NOTE: Removed 'style' attribute to prevent CSS injection attacks
      const sanitizedLine = DOMPurify.sanitize(processedLine, {
        ALLOWED_TAGS: ['strong', 'em', 'a', 'img', 'code', 'br', 'div'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'target', 'rel', 'loading'],
        ALLOW_DATA_ATTR: false // 🔐 Prevent data-* attributes which can be used for injection
      });
      
      if (sanitizedLine.trim()) {
        elements.push(
          <div key={`text-${index}`} dangerouslySetInnerHTML={{ __html: sanitizedLine }} />
        );
      } else {
        elements.push(<br key={`br-${index}`} />);
      }
    });
    
    return elements;
  };

  if (!content) return null;

  return (
    <div className={`prose prose-sm max-w-none text-foreground leading-relaxed ${className}`}>
      {renderContent(content)}
    </div>
  );
};
