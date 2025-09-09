import { useState, useRef } from 'react';
import { Bold, Link2, Eye, Code } from 'lucide-react';
import { Button } from './button';
import { Textarea } from './textarea';
import { Input } from './input';
import { Label } from './label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Badge } from './badge';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = "Rédigez votre contenu...", 
  rows = 8,
  className = ""
}: RichTextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [linkDialog, setLinkDialog] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const getSelectionText = () => {
    if (!textareaRef.current) return '';
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    return value.substring(start, end);
  };

  const insertTextAtCursor = (textToInsert: string, replacementLength: number = 0) => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    
    const newValue = 
      value.substring(0, start) + 
      textToInsert + 
      value.substring(replacementLength > 0 ? start + replacementLength : end);
    
    onChange(newValue);
    
    // Restore cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = start + textToInsert.length;
        textareaRef.current.selectionStart = newCursorPos;
        textareaRef.current.selectionEnd = newCursorPos;
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleBold = () => {
    const selectedText = getSelectionText();
    if (selectedText) {
      insertTextAtCursor(`**${selectedText}**`, selectedText.length);
    } else {
      insertTextAtCursor('**texte en gras**');
    }
  };

  const handleLinkClick = () => {
    const selectedText = getSelectionText();
    setLinkText(selectedText || 'texte du lien');
    setLinkUrl('');
    setLinkDialog(true);
  };

  const insertLink = () => {
    if (!linkText.trim() || !linkUrl.trim()) return;
    
    const selectedText = getSelectionText();
    const linkMarkdown = `[${linkText}](${linkUrl})`;
    
    if (selectedText) {
      insertTextAtCursor(linkMarkdown, selectedText.length);
    } else {
      insertTextAtCursor(linkMarkdown);
    }
    
    setLinkDialog(false);
    setLinkText('');
    setLinkUrl('');
  };

  const renderPreview = (text: string) => {
    // Convert markdown to HTML
    let html = text
      // Convert bold **text** to <strong>text</strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert links [text](url) to <a href="url">text</a>
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80 underline">$1</a>')
      // Convert line breaks to <br>
      .replace(/\n/g, '<br>');
    
    return <div 
      className="prose max-w-none text-foreground"
      dangerouslySetInnerHTML={{ __html: html }}
    />;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center space-x-2 border-b border-border pb-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleBold}
          className="p-2"
          title="Gras (sélectionnez du texte puis cliquez)"
        >
          <Bold className="w-4 h-4" />
        </Button>
        
        <Dialog open={linkDialog} onOpenChange={setLinkDialog}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLinkClick}
              className="p-2"
              title="Insérer un lien"
            >
              <Link2 className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un lien</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkText">Texte du lien</Label>
                <Input
                  id="linkText"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Texte à afficher"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkUrl">URL</Label>
                <Input
                  id="linkUrl"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setLinkDialog(false)}>
                  Annuler
                </Button>
                <Button onClick={insertLink}>
                  Insérer le lien
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="h-4 w-px bg-border" />
        
        <Button
          type="button"
          variant={showPreview ? "default" : "outline"}
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="p-2"
          title="Basculer en mode aperçu"
        >
          <Eye className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="p-2"
          title="Aide markdown"
        >
          <Code className="w-4 h-4" />
        </Button>
      </div>

      {/* Help badges */}
      <div className="flex flex-wrap gap-2 text-xs">
        <Badge variant="secondary" className="text-xs">
          **gras**
        </Badge>
        <Badge variant="secondary" className="text-xs">
          [texte](url)
        </Badge>
      </div>

      {/* Editor/Preview */}
      {showPreview ? (
        <div className="min-h-[200px] p-4 border border-border rounded-md bg-muted/20">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Aperçu :</h4>
          {value ? renderPreview(value) : (
            <p className="text-muted-foreground italic">Aucun contenu à prévisualiser</p>
          )}
        </div>
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="min-h-[200px] font-mono text-sm"
        />
      )}

      {/* Character count */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{value.length} caractères</span>
        {showPreview && (
          <span>Mode aperçu - cliquez sur l&apos;œil pour revenir à l&apos;édition</span>
        )}
      </div>
    </div>
  );
};