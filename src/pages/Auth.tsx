import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [showUpdatePasswordForm, setShowUpdatePasswordForm] = useState(false);
  const { signIn, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for password reset in URL parameters or hash
  useEffect(() => {
    const mode = searchParams.get('mode');
    const type = searchParams.get('type');
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    // Also check hash parameters for Supabase redirects
    const hash = window.location.hash.substring(1);
    const hashParams = new URLSearchParams(hash);
    const accessToken = hashParams.get('access_token');
    const tokenType = hashParams.get('type');
    
    console.log('Auth page - URL params check:', {
      mode,
      type,
      token: !!token,
      email,
      accessToken: !!accessToken,
      tokenType,
      hash: window.location.hash,
      search: window.location.search,
      showUpdatePasswordForm
    });
    
    // Handle direct token from email (preferred method)
    if (type === 'recovery' && token && email) {
      console.log('Direct token detected, verifying OTP...');
      handleTokenVerification(token, email);
      return;
    }
    
    // Fallback for hash-based tokens or manual mode setting
    if (mode === 'reset-password' || tokenType === 'recovery' || accessToken) {
      console.log('Setting showUpdatePasswordForm to true');
      setShowUpdatePasswordForm(true);
    }
  }, [searchParams]);

  // Handle token verification from email link
  const handleTokenVerification = async (token: string, email: string) => {
    try {
      console.log('Verifying OTP token...');
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'recovery',
        email: email,
      });

      if (error) {
        console.error('Token verification failed:', error);
        toast.error('Lien de réinitialisation invalide ou expiré. Demandez un nouveau lien.');
        return;
      }

      console.log('Token verified successfully, user logged in');
      setShowUpdatePasswordForm(true);
      
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      toast.success('Lien vérifié ! Vous pouvez maintenant changer votre mot de passe.');
    } catch (err) {
      console.error('Token verification error:', err);
      toast.error('Erreur lors de la vérification du lien. Réessayez.');
    }
  };

  // Redirect if already authenticated (except in reset password mode)
  useEffect(() => {
    const mode = searchParams.get('mode');
    const type = searchParams.get('type');
    
    console.log('Auth page - Redirect check:', {
      user: !!user,
      mode,
      type,
      showUpdatePasswordForm,
      shouldRedirect: user && mode !== 'reset-password' && type !== 'recovery' && !showUpdatePasswordForm
    });
    
    // Don't redirect if we're in password reset mode or if the session is for password recovery
    if (user && mode !== 'reset-password' && type !== 'recovery' && !showUpdatePasswordForm) {
      console.log('Redirecting to home page');
      navigate('/');
    }
  }, [user, navigate, searchParams, showUpdatePasswordForm]);

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

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    setError('');

    if (!newPassword || !confirmNewPassword) {
      setError('Veuillez remplir tous les champs');
      setUpdateLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Les mots de passe ne correspondent pas');
      setUpdateLoading(false);
      return;
    }

    // Validation du mot de passe sécurisé
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setError(`Mot de passe trop faible. Requis : ${passwordValidation.errors.join(', ')}`);
      setUpdateLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      if (error.message.includes('New password should be different from the old password')) {
        setError('Le nouveau mot de passe doit être différent de l\'ancien mot de passe');
      } else {
        setError('Erreur lors de la mise à jour du mot de passe');
      }
    } else {
      toast.success('Mot de passe mis à jour avec succès !');
      navigate('/');
    }
    
    setUpdateLoading(false);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setError('');
    setShowEmailConfirmation(false);
    setShowResetConfirmation(false);
    setShowResetForm(false);
    setShowUpdatePasswordForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-2xl font-bold text-foreground">OmraBonsPlans.fr</h1>
          <p className="text-muted-foreground">Votre plateforme dédiée à la Omra</p>
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

        {/* Formulaire de mise à jour du mot de passe */}
        {showUpdatePasswordForm && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔐 Nouveau mot de passe
              </CardTitle>
              <CardDescription>
                Choisissez un nouveau mot de passe sécurisé pour votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <PasswordStrengthIndicator password={newPassword} />
                  
                  {/* Password requirements info */}
                  {!newPassword && (
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
                  <Label htmlFor="confirm-new-password">Confirmer le nouveau mot de passe</Label>
                  <Input
                    id="confirm-new-password"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={updateLoading}
                >
                  {updateLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

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

        {!showEmailConfirmation && !showResetConfirmation && !showResetForm && !showUpdatePasswordForm && (
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
                    disabled={loading}
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
                    disabled={loading}
                  >
                    {loading ? 'Inscription...' : 'Créer un compte'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
            </Tabs>

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