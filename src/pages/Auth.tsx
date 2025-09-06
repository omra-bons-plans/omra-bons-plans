import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { validatePassword } from '@/utils/validation';
import PasswordStrengthIndicator from '@/components/ui/PasswordStrengthIndicator';
import { Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const { signIn, signUp, signInWithGoogle, resetPassword, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setError('');

    if (!email) {
      setError('Veuillez saisir votre adresse email');
      setResetLoading(false);
      return;
    }

    const { error } = await resetPassword(email);
    
    if (error) {
      setError('Erreur lors de l\'envoi de l\'email de réinitialisation');
    } else {
      setShowResetConfirmation(true);
      setEmail('');
    }
    
    setResetLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    
    const { error } = await signInWithGoogle();
    
    if (error) {
      if (error.message.includes('popup_closed_by_user')) {
        // User closed popup, don't show error
      } else {
        setError('Erreur lors de la connexion avec Google');
      }
    }
    
    setGoogleLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    const { error } = await signIn(email, password);
    
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('Email ou mot de passe incorrect');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Veuillez confirmer votre email avant de vous connecter');
      } else {
        setError(error.message);
      }
    } else {
      toast.success('Connexion réussie !');
      navigate('/');
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    // Validation du mot de passe sécurisé
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(`Mot de passe trop faible. Requis : ${passwordValidation.errors.join(', ')}`);
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password);
    
    if (error) {
      if (error.message.includes('User already registered')) {
        setError('Un compte existe déjà avec cet email');
      } else {
        setError(error.message);
      }
    } else {
      setShowEmailConfirmation(true);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
    
    setLoading(false);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setShowEmailConfirmation(false);
    setShowResetConfirmation(false);
    setShowResetForm(false);
    setGoogleLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-2xl font-bold text-foreground">OmraBonsPlans.fr</h1>
          <p className="text-muted-foreground">Votre plateforme dédiée à l'Omra</p>
        </div>

        {/* Message de confirmation email */}
        {showEmailConfirmation && (
          <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
            <CardHeader className="text-center pb-3">
              <div className="mx-auto mb-3 w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-green-800 dark:text-green-200 text-xl">
                Inscription réussie !
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Vérifiez votre email</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Un email de confirmation a été envoyé à votre adresse.
                </p>
                <div className="bg-white/60 dark:bg-black/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                    📧 Important : Vérifiez aussi votre dossier SPAM
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    L'email de confirmation peut parfois arriver dans les spams. 
                    Pensez à vérifier ce dossier si vous ne le trouvez pas dans votre boîte de réception.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowEmailConfirmation(false)}
                  className="flex-1"
                >
                  Retour
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Accueil
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Message de confirmation réinitialisation */}
        {showResetConfirmation && (
          <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
            <CardHeader className="text-center pb-3">
              <div className="mx-auto mb-3 w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-blue-800 dark:text-blue-200 text-xl">
                Email envoyé ! 🔐
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="space-y-3">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Un email de réinitialisation a été envoyé à votre adresse.
                </p>
                <div className="bg-white/60 dark:bg-black/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                    ⏱️ Lien valable 1 heure
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Suivez les instructions dans l'email pour créer un nouveau mot de passe sécurisé.
                    Vérifiez aussi vos spams !
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowResetConfirmation(false)}
                  className="flex-1"
                >
                  Retour
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Accueil
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!showEmailConfirmation && !showResetConfirmation && !showResetForm && (
          <>
            <Tabs defaultValue="signin" className="w-full" onValueChange={resetForm}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Connexion</TabsTrigger>
                <TabsTrigger value="signup">Inscription</TabsTrigger>
              </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Se connecter</CardTitle>
                <CardDescription>
                  Connectez-vous à votre compte pour accéder à vos annonces
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Bouton Google */}
                <div className="space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 h-11"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                  >
                    {googleLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        Connexion...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Continuer avec Google
                      </>
                    )}
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Ou avec email
                      </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Mot de passe</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading || googleLoading}
                  >
                    {loading ? 'Connexion...' : 'Se connecter'}
                  </Button>

                  {/* Lien mot de passe oublié */}
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm text-muted-foreground hover:text-primary"
                      onClick={() => setShowResetForm(true)}
                    >
                      Mot de passe oublié ?
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Créer un compte</CardTitle>
                <CardDescription>
                  Créez votre compte pour publier vos annonces
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Bouton Google */}
                <div className="space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 h-11"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                  >
                    {googleLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        Connexion...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Continuer avec Google
                      </>
                    )}
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Ou créer avec email
                      </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Mot de passe</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <PasswordStrengthIndicator password={password} />
                    
                    {/* Password requirements info */}
                    {!password && (
                      <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        <p className="font-medium mb-1">Exigences de sécurité :</p>
                        <ul className="space-y-0.5 text-xs">
                          <li>• Au moins 8 caractères</li>
                          <li>• Une majuscule et une minuscule</li>
                          <li>• Au moins un chiffre</li>
                          <li>• Un caractère spécial (!@#$%...)</li>
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading || googleLoading}
                  >
                    {loading ? 'Inscription...' : 'Créer un compte'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
            </Tabs>

            {/* Formulaire de réinitialisation de mot de passe */}
            {showResetForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🔐 Mot de passe oublié
                  </CardTitle>
                  <CardDescription>
                    Saisissez votre email pour recevoir un lien de réinitialisation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Adresse email</Label>
                      <Input
                        id="reset-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setShowResetForm(false)}
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1"
                        disabled={resetLoading}
                      >
                        {resetLoading ? 'Envoi...' : 'Envoyer le lien'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Back to home */}
            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Retour à l'accueil
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;