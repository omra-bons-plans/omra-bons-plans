import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Page non trouvée - 404 | Omra Bons Plans</title>
        <meta name="description" content="La page que vous recherchez n'existe pas ou a été déplacée. Retournez à l'accueil pour découvrir nos offres Omra." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://omrabonsplans.fr/404" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 p-8">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-primary">404</h1>
            <h2 className="text-2xl font-semibold text-foreground">Page non trouvée</h2>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-md">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          
          <div className="space-y-4">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Retour à l'accueil
            </Link>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <Link to="/blog" className="text-primary hover:underline">
                Découvrir notre blog
              </Link>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <Link to="/contact" className="text-primary hover:underline">
                Nous contacter
              </Link>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-8">
            URL demandée : {location.pathname}
          </p>
        </div>
      </div>
    </>
  );
};

export default NotFound;
