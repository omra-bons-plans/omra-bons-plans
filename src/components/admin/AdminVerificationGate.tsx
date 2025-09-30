import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Shield } from 'lucide-react';
import { useAdminVerification } from '@/hooks/useAdminVerification';

interface AdminVerificationGateProps {
  children: React.ReactNode;
}

export const AdminVerificationGate = ({ children }: AdminVerificationGateProps) => {
  const [code, setCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const {
    isVerified,
    isLoading,
    isSendingCode,
    isVerifyingCode,
    requestCode,
    verifyCode
  } = useAdminVerification();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (isVerified) {
    return <>{children}</>;
  }

  const handleRequestCode = async () => {
    const success = await requestCode();
    if (success) {
      setShowCodeInput(true);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await verifyCode(code);
    if (success) {
      setCode('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-2xl">🔒 Vérification Admin</CardTitle>
          <CardDescription>
            {showCodeInput 
              ? "Entrez le code de vérification reçu par email"
              : "Pour accéder à l'interface admin, demandez un code de vérification"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showCodeInput ? (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Un code de vérification à 6 chiffres sera envoyé à votre adresse email admin 
                    <strong> fafaland@hotmail.fr</strong>. 
                    Ce code sera valide pendant <strong>5 minutes</strong>.
                  </span>
                </p>
              </div>
              <Button 
                onClick={handleRequestCode}
                disabled={isSendingCode}
                className="w-full"
                size="lg"
              >
                {isSendingCode ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Recevoir le code par email
                  </>
                )}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code de vérification</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest font-mono"
                  disabled={isVerifyingCode}
                  autoFocus
                />
                <p className="text-xs text-muted-foreground text-center">
                  Entrez le code à 6 chiffres reçu par email
                </p>
              </div>
              <div className="space-y-2">
                <Button 
                  type="submit"
                  disabled={code.length !== 6 || isVerifyingCode}
                  className="w-full"
                  size="lg"
                >
                  {isVerifyingCode ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Vérifier le code
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRequestCode}
                  disabled={isSendingCode}
                  className="w-full"
                >
                  {isSendingCode ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    "Renvoyer un code"
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
