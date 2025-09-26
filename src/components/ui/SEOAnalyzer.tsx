import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertCircle, XCircle, Search, Target, FileText, Image } from 'lucide-react';

interface SEOAnalysis {
  title: {
    score: number;
    length: number;
    suggestions: string[];
  };
  excerpt: {
    score: number;
    length: number;
    suggestions: string[];
  };
  content: {
    score: number;
    wordCount: number;
    readingTime: number;
    headings: {
      h1: number;
      h2: number;
      h3: number;
    };
    suggestions: string[];
  };
  keywords: {
    score: number;
    density: number;
    suggestions: string[];
  };
  images: {
    score: number;
    count: number;
    suggestions: string[];
  };
  overall: number;
}

interface SEOAnalyzerProps {
  title: string;
  excerpt: string;
  content: string;
  images: string[];
  coverImage: string;
}

export const SEOAnalyzer = ({ title, excerpt, content, images, coverImage }: SEOAnalyzerProps) => {
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [targetKeyword, setTargetKeyword] = useState('');

  useEffect(() => {
    if (title || content) {
      analyzeContent();
    }
  }, [title, excerpt, content, images, coverImage, targetKeyword]);

  const analyzeContent = () => {
    const titleAnalysis = analyzeTitleSEO(title);
    const excerptAnalysis = analyzeExcerptSEO(excerpt);
    const contentAnalysis = analyzeContentSEO(content);
    const keywordAnalysis = analyzeKeywords(title, content, targetKeyword);
    const imageAnalysis = analyzeImages(images, coverImage);

    const overallScore = Math.round(
      (titleAnalysis.score + excerptAnalysis.score + contentAnalysis.score + 
       keywordAnalysis.score + imageAnalysis.score) / 5
    );

    setAnalysis({
      title: titleAnalysis,
      excerpt: excerptAnalysis,
      content: contentAnalysis,
      keywords: keywordAnalysis,
      images: imageAnalysis,
      overall: overallScore
    });
  };

  const analyzeTitleSEO = (title: string) => {
    const length = title.length;
    let score = 0;
    const suggestions: string[] = [];

    // Longueur optimale : 50-60 caractères
    if (length >= 30 && length <= 60) {
      score += 40;
    } else if (length < 30) {
      suggestions.push('Le titre est trop court (minimum 30 caractères recommandé)');
    } else if (length > 60) {
      suggestions.push('Le titre est trop long (maximum 60 caractères recommandé)');
    }

    // Présence du mot-clé cible
    if (targetKeyword && title.toLowerCase().includes(targetKeyword.toLowerCase())) {
      score += 30;
    } else if (targetKeyword) {
      suggestions.push(`Incluez le mot-clé "${targetKeyword}" dans le titre`);
    }

    // Structure et lisibilité
    if (title.split(' ').length >= 5) {
      score += 20;
    } else {
      suggestions.push('Le titre pourrait être plus descriptif (minimum 5 mots)');
    }

    // Éviter les mots vides en début
    const stopWords = ['le', 'la', 'les', 'un', 'une', 'des', 'du', 'de'];
    const firstWord = title.toLowerCase().split(' ')[0];
    if (!stopWords.includes(firstWord)) {
      score += 10;
    } else {
      suggestions.push('Évitez de commencer par des mots vides (le, la, un...)');
    }

    return { score: Math.min(score, 100), length, suggestions };
  };

  const analyzeExcerptSEO = (excerpt: string) => {
    const length = excerpt.length;
    let score = 0;
    const suggestions: string[] = [];

    // Longueur optimale : 120-160 caractères
    if (length >= 120 && length <= 160) {
      score += 50;
    } else if (length < 120) {
      suggestions.push('La description est trop courte (120-160 caractères recommandé)');
    } else if (length > 160) {
      suggestions.push('La description est trop longue (120-160 caractères recommandé)');
    }

    // Présence du mot-clé cible
    if (targetKeyword && excerpt.toLowerCase().includes(targetKeyword.toLowerCase())) {
      score += 30;
    } else if (targetKeyword) {
      suggestions.push(`Incluez le mot-clé "${targetKeyword}" dans la description`);
    }

    // Appel à l'action
    const callToActionWords = ['découvrez', 'apprenez', 'explorez', 'trouvez', 'consultez'];
    const hasCallToAction = callToActionWords.some(word => 
      excerpt.toLowerCase().includes(word)
    );
    if (hasCallToAction) {
      score += 20;
    } else {
      suggestions.push('Ajoutez un appel à l\'action (découvrez, apprenez...)');
    }

    return { score: Math.min(score, 100), length, suggestions };
  };

  const analyzeContentSEO = (content: string) => {
    const wordCount = content.split(' ').filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200); // 200 mots par minute
    let score = 0;
    const suggestions: string[] = [];

    // Longueur du contenu
    if (wordCount >= 300) {
      score += 30;
    } else {
      suggestions.push('Le contenu est trop court (minimum 300 mots recommandé)');
    }

    // Structure des titres - recherche des titres Markdown ET HTML
    const markdownH1 = (content.match(/^# /gm) || []).length;
    const markdownH2 = (content.match(/^## /gm) || []).length;
    const markdownH3 = (content.match(/^### /gm) || []).length;
    
    // Recherche des titres HTML dans le contenu
    const htmlH1 = (content.match(/<h1[^>]*>/gi) || []).length;
    const htmlH2 = (content.match(/<h2[^>]*>/gi) || []).length;
    const htmlH3 = (content.match(/<h3[^>]*>/gi) || []).length;
    
    // Recherche des titres H1 dans la page actuelle (DOM)
    const pageH1Count = document.querySelectorAll('h1').length;
    
    const h1Count = markdownH1 + htmlH1 + (pageH1Count > 0 ? 1 : 0);
    const h2Count = markdownH2 + htmlH2;
    const h3Count = markdownH3 + htmlH3;

    const headings = { h1: h1Count, h2: h2Count, h3: h3Count };

    if (h1Count === 1) {
      score += 20;
    } else if (h1Count === 0) {
      suggestions.push('Ajoutez un titre H1 unique');
    } else {
      suggestions.push('Utilisez un seul titre H1 par article');
    }

    if (h2Count >= 2) {
      score += 20;
    } else {
      suggestions.push('Ajoutez au moins 2 sous-titres H2 pour structurer le contenu');
    }

    // Présence de listes
    const hasLists = content.includes('-') || content.includes('*') || /\d+\.\s/.test(content);
    if (hasLists) {
      score += 15;
    } else {
      suggestions.push('Ajoutez des listes à puces ou numérotées pour améliorer la lisibilité');
    }

    // Liens internes/externes
    const linkCount = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
    if (linkCount >= 2) {
      score += 15;
    } else {
      suggestions.push('Ajoutez des liens internes et externes pour enrichir le contenu');
    }

    return { 
      score: Math.min(score, 100), 
      wordCount, 
      readingTime, 
      headings, 
      suggestions 
    };
  };

  const analyzeKeywords = (title: string, content: string, keyword: string) => {
    let score = 0;
    let density = 0;
    const suggestions: string[] = [];

    if (!keyword) {
      suggestions.push('Définissez un mot-clé cible pour optimiser votre contenu');
      return { score: 0, density, suggestions };
    }

    const text = (title + ' ' + content).toLowerCase();
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const keywordOccurrences = words.filter(word => 
      word.includes(keyword.toLowerCase())
    ).length;

    density = (keywordOccurrences / words.length) * 100;

    // Densité optimale : 1-3%
    if (density >= 1 && density <= 3) {
      score += 50;
    } else if (density < 1) {
      suggestions.push(`Augmentez la fréquence du mot-clé "${keyword}" (densité actuelle: ${density.toFixed(1)}%)`);
    } else {
      suggestions.push(`Réduisez la fréquence du mot-clé "${keyword}" (densité actuelle: ${density.toFixed(1)}%)`);
    }

    // Présence dans le titre
    if (title.toLowerCase().includes(keyword.toLowerCase())) {
      score += 30;
    } else {
      suggestions.push(`Incluez le mot-clé "${keyword}" dans le titre`);
    }

    // Présence en début de contenu
    const firstParagraph = content.split('\n')[0] || '';
    if (firstParagraph.toLowerCase().includes(keyword.toLowerCase())) {
      score += 20;
    } else {
      suggestions.push(`Incluez le mot-clé "${keyword}" dans le premier paragraphe`);
    }

    return { score: Math.min(score, 100), density, suggestions };
  };

  const analyzeImages = (images: string[], coverImage: string) => {
    const totalImages = images.length + (coverImage ? 1 : 0);
    let score = 0;
    const suggestions: string[] = [];

    if (totalImages > 0) {
      score += 40;
    } else {
      suggestions.push('Ajoutez au moins une image pour enrichir votre contenu');
    }

    if (coverImage) {
      score += 30;
    } else {
      suggestions.push('Ajoutez une image de couverture attractive');
    }

    // Recommandations générales
    if (totalImages > 0) {
      score += 30;
      suggestions.push('N\'oubliez pas d\'optimiser les images (format WebP, compression)');
      suggestions.push('Ajoutez des textes alternatifs descriptifs pour toutes les images');
    }

    return { score: Math.min(score, 100), count: totalImages, suggestions };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (score >= 60) return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  if (!analysis) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="w-5 h-5 mr-2" />
          Analyse SEO
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score global */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${getScoreColor(analysis.overall)}`}>
            {analysis.overall}/100
          </div>
          <p className="text-sm text-muted-foreground">Score SEO global</p>
          <Progress value={analysis.overall} className="mt-2" />
        </div>

        {/* Mot-clé cible */}
        <div className="space-y-2">
          <Label htmlFor="target-keyword">Mot-clé cible</Label>
          <Input
            id="target-keyword"
            value={targetKeyword}
            onChange={(e) => setTargetKeyword(e.target.value)}
            placeholder="Entrez votre mot-clé principal"
          />
        </div>

        {/* Analyses détaillées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Titre */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Titre</span>
              <div className="flex items-center space-x-1">
                {getScoreIcon(analysis.title.score)}
                <span className={`text-sm ${getScoreColor(analysis.title.score)}`}>
                  {analysis.title.score}/100
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {analysis.title.length} caractères
            </p>
            {analysis.title.suggestions.map((suggestion, index) => (
              <Alert key={index} className="py-2">
                <AlertDescription className="text-xs">{suggestion}</AlertDescription>
              </Alert>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Description</span>
              <div className="flex items-center space-x-1">
                {getScoreIcon(analysis.excerpt.score)}
                <span className={`text-sm ${getScoreColor(analysis.excerpt.score)}`}>
                  {analysis.excerpt.score}/100
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {analysis.excerpt.length} caractères
            </p>
            {analysis.excerpt.suggestions.map((suggestion, index) => (
              <Alert key={index} className="py-2">
                <AlertDescription className="text-xs">{suggestion}</AlertDescription>
              </Alert>
            ))}
          </div>

          {/* Contenu */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Contenu</span>
              <div className="flex items-center space-x-1">
                {getScoreIcon(analysis.content.score)}
                <span className={`text-sm ${getScoreColor(analysis.content.score)}`}>
                  {analysis.content.score}/100
                </span>
              </div>
            </div>
            <div className="flex space-x-4 text-xs text-muted-foreground">
              <span>{analysis.content.wordCount} mots</span>
              <span>{analysis.content.readingTime} min de lecture</span>
            </div>
            <div className="flex space-x-2">
              <Badge variant="outline" className="text-xs">
                H1: {analysis.content.headings.h1}
              </Badge>
              <Badge variant="outline" className="text-xs">
                H2: {analysis.content.headings.h2}
              </Badge>
              <Badge variant="outline" className="text-xs">
                H3: {analysis.content.headings.h3}
              </Badge>
            </div>
            {analysis.content.suggestions.map((suggestion, index) => (
              <Alert key={index} className="py-2">
                <AlertDescription className="text-xs">{suggestion}</AlertDescription>
              </Alert>
            ))}
          </div>

          {/* Mots-clés */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Mots-clés</span>
              <div className="flex items-center space-x-1">
                {getScoreIcon(analysis.keywords.score)}
                <span className={`text-sm ${getScoreColor(analysis.keywords.score)}`}>
                  {analysis.keywords.score}/100
                </span>
              </div>
            </div>
            {targetKeyword && (
              <p className="text-xs text-muted-foreground">
                Densité: {analysis.keywords.density.toFixed(1)}%
              </p>
            )}
            {analysis.keywords.suggestions.map((suggestion, index) => (
              <Alert key={index} className="py-2">
                <AlertDescription className="text-xs">{suggestion}</AlertDescription>
              </Alert>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium flex items-center">
              <Image className="w-4 h-4 mr-1" />
              Images
            </span>
            <div className="flex items-center space-x-1">
              {getScoreIcon(analysis.images.score)}
              <span className={`text-sm ${getScoreColor(analysis.images.score)}`}>
                {analysis.images.score}/100
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {analysis.images.count} image(s)
          </p>
          {analysis.images.suggestions.map((suggestion, index) => (
            <Alert key={index} className="py-2">
              <AlertDescription className="text-xs">{suggestion}</AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};