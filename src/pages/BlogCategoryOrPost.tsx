import { useParams } from 'react-router-dom';
import Blog from './Blog';
import BlogPost from './BlogPost';

const KNOWN_CATEGORIES = ['general', 'restaurants', 'associations', 'vendeurs', 'all'];

/**
 * /blog/:param peut être :
 * - une catégorie (ex: /blog/general) => page catégorie
 * - un slug d'article court (ex: /blog/omra-hajj-sans-voile-soeurs) => article
 */
const BlogCategoryOrPost = () => {
  const { category } = useParams();

  if (category && !KNOWN_CATEGORIES.includes(category)) {
    return <BlogPost slugOverride={category} categoryOverride="general" />;
  }

  return <Blog />;
};

export default BlogCategoryOrPost;
