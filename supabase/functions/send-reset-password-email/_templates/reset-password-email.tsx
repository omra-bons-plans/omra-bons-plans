import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface ResetPasswordEmailProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
  user_email: string
}

export const ResetPasswordEmail = ({
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
  user_email,
}: ResetPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>Réinitialisez votre mot de passe OmraBonsPlans.fr</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with Logo */}
        <Section style={header}>
          <Heading style={logo}>OmraBonsPlans.fr</Heading>
          <Text style={tagline}>Votre plateforme dédiée au Hajj et à l'Omra</Text>
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Heading style={h1}>Réinitialisation de mot de passe 🔐</Heading>
          
          <Text style={text}>
            Bonjour,
          </Text>

          <Text style={text}>
            Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte 
            <strong> OmraBonsPlans.fr</strong> associé à l'adresse email : <strong>{user_email}</strong>
          </Text>

          <Text style={text}>
            Si vous êtes à l'origine de cette demande, cliquez sur le bouton ci-dessous 
            pour créer un nouveau mot de passe sécurisé :
          </Text>

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Link
              href={`${redirect_to}?token=${token}&type=recovery&email=${user_email}`}
              style={button}
            >
              Réinitialiser mon mot de passe
            </Link>
          </Section>

          <Text style={alternativeText}>
            Ou copiez ce lien dans votre navigateur :
          </Text>
          
          <Text style={linkText}>
            {`${redirect_to}?token=${token}&type=recovery&email=${user_email}`}
          </Text>

          <Hr style={divider} />

          {/* Security Instructions */}
          <Section style={instructionsSection}>
            <Heading style={h2}>Pour votre sécurité :</Heading>
            
            <Text style={instructionItem}>
              🔒 <strong>Choisissez un mot de passe fort</strong> - Au moins 8 caractères avec majuscules, minuscules, chiffres et caractères spéciaux
            </Text>
            <Text style={instructionItem}>
              🔄 <strong>Utilisez un mot de passe unique</strong> - Ne réutilisez pas vos autres mots de passe
            </Text>
            <Text style={instructionItem}>
              💾 <strong>Sauvegardez-le en sécurité</strong> - Utilisez un gestionnaire de mots de passe si possible
            </Text>
            <Text style={instructionItem}>
              📱 <strong>Activez la double authentification</strong> - Pour une protection renforcée (bientôt disponible)
            </Text>
          </Section>

          <Hr style={divider} />

          <Section style={warningSection}>
            <Text style={warningTitle}>⚠️ Important :</Text>
            <Text style={warningText}>
              • Ce lien de réinitialisation est valable <strong>1 heure</strong> uniquement
            </Text>
            <Text style={warningText}>
              • Il ne peut être utilisé qu'<strong>une seule fois</strong>
            </Text>
            <Text style={warningText}>
              • Si vous n'avez pas demandé cette réinitialisation, ignorez cet email
            </Text>
            <Text style={warningText}>
              • Votre mot de passe actuel reste inchangé tant que vous ne créez pas le nouveau
            </Text>
          </Section>

          <Text style={securityNote}>
            🛡️ <strong>Vous n'avez pas demandé cette réinitialisation ?</strong><br />
            Si vous n'êtes pas à l'origine de cette demande, quelqu'un d'autre a peut-être saisi votre adresse email par erreur. 
            Vous pouvez ignorer cet email en toute sécurité. Votre compte reste protégé.
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            Besoin d'aide ? Contactez notre support à{' '}
            <Link href="mailto:support@omrabonsplans.fr" style={footerLink}>
              support@omrabonsplans.fr
            </Link>
          </Text>
          
          <Text style={footerText}>
            <Link href={new URL(redirect_to).origin} style={footerLink}>
              OmraBonsPlans.fr
            </Link>{' '}
            - Votre compagnon de voyage spirituel
          </Text>
          
          <Text style={copyright}>
            © 2024 OmraBonsPlans.fr - Tous droits réservés
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ResetPasswordEmail

// Styles
const main = {
  backgroundColor: '#f8fafc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  marginTop: '40px',
  marginBottom: '40px',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  maxWidth: '600px',
}

const header = {
  backgroundColor: '#dc2626', // Rouge pour les alertes de sécurité
  padding: '40px 32px 32px 32px',
  borderRadius: '12px 12px 0 0',
  textAlign: 'center' as const,
}

const logo = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
}

const tagline = {
  color: '#fecaca',
  fontSize: '14px',
  margin: '0',
  fontWeight: 'normal',
}

const content = {
  padding: '40px 32px',
}

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#374151',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px 0',
}

const text = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#dc2626',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  border: 'none',
}

const alternativeText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '24px 0 8px 0',
  textAlign: 'center' as const,
}

const linkText = {
  color: '#dc2626',
  fontSize: '12px',
  wordBreak: 'break-all' as const,
  backgroundColor: '#fee2e2',
  padding: '12px',
  borderRadius: '6px',
  margin: '0 0 24px 0',
}

const divider = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
}

const instructionsSection = {
  margin: '24px 0',
}

const instructionItem = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 12px 0',
}

const warningSection = {
  backgroundColor: '#fef3c7',
  border: '1px solid #f59e0b',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const warningTitle = {
  color: '#92400e',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
}

const warningText = {
  color: '#92400e',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 6px 0',
}

const securityNote = {
  backgroundColor: '#f3f4f6',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  color: '#374151',
  fontSize: '14px',
  lineHeight: '20px',
  padding: '16px',
  margin: '24px 0 0 0',
}

const footer = {
  backgroundColor: '#f9fafb',
  padding: '32px',
  borderRadius: '0 0 12px 12px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 8px 0',
}

const footerLink = {
  color: '#dc2626',
  textDecoration: 'underline',
}

const copyright = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '16px 0 0 0',
}