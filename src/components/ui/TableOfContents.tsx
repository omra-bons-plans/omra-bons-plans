import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List, ChevronRight } from 'lucide-react';

interface TableOfContentsProps {
  content: string;
  className?: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export const TableOfContents = ({ content, className = '' }: TableOfContentsProps) => {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from content
    const lines = content.split('\n');
    const headings: TocItem[] = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Check for markdown-style headings (##, ###, etc.)
      const headingMatch = trimmed.match(/^(#{2,4})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2];
        const id = `heading-${index}`;
        headings.push({ id, text, level });
      }
      
      // Check for text that looks like a heading (standalone line with title case)
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
        headings.push({ id, text: trimmed, level: 2 });
      }
    });

    setTocItems(headings);
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = tocItems.map(item => 
        document.getElementById(item.id)
      ).filter(Boolean);

      let currentActive = '';
      
      for (const element of headingElements) {
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            currentActive = element.id;
          }
        }
      }
      
      setActiveId(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (tocItems.length === 0) return null;

  return (
    <Card className={`sticky top-24 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <List className="w-5 h-5 mr-2" />
          Sommaire
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {tocItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToHeading(item.id)}
            className={`
              flex items-center w-full text-left px-2 py-2 rounded-md text-sm transition-colors
              ${activeId === item.id 
                ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }
              ${item.level === 3 ? 'ml-4' : ''}
              ${item.level === 4 ? 'ml-8' : ''}
            `}
          >
            <ChevronRight className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="line-clamp-2 leading-tight">{item.text}</span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
};