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
  Img,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface ConfirmationEmailProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
  user_email: string
}

export const ConfirmationEmail = ({
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
  user_email,
}: ConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Confirmez votre compte OmraBonsPlans.fr</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with Logo */}
        <Section style={header}>
          <Heading style={logo}>OmraBonsPlans.fr</Heading>
          <Text style={tagline}>Votre plateforme dédiée au Hajj et à l'Omra</Text>
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Heading style={h1}>Bienvenue ! 🕌</Heading>
          
          <Text style={text}>
            Nous sommes ravis de vous accueillir sur <strong>OmraBonsPlans.fr</strong>, 
            votre plateforme de confiance pour organiser votre voyage spirituel.
          </Text>

          <Text style={text}>
            Pour finaliser votre inscription et accéder à toutes nos fonctionnalités, 
            veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :
          </Text>

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Link
              href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
              style={button}
            >
              Confirmer mon compte
            </Link>
          </Section>

          <Text style={alternativeText}>
            Ou copiez ce lien dans votre navigateur :
          </Text>
          
          <Text style={linkText}>
            {`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
          </Text>

          <Hr style={divider} />

          {/* Features */}
          <Section style={featuresSection}>
            <Heading style={h2}>Une fois votre compte confirmé, vous pourrez :</Heading>
            
            <Text style={featureItem}>
              ✅ <strong>Publier vos annonces</strong> - Séjours, vols, hébergements, services de guide
            </Text>
            <Text style={featureItem}>
              ✅ <strong>Gérer votre profil</strong> - Créez votre vitrine professionnelle
            </Text>
            <Text style={featureItem}>
              ✅ <strong>Contacter directement</strong> - Échangez avec les pèlerins
            </Text>
            <Text style={featureItem}>
              ✅ <strong>Accéder aux ventes flash</strong> - Profitez des meilleures offres
            </Text>
          </Section>

          <Hr style={divider} />

          <Text style={securityNote}>
            🔒 <strong>Sécurité :</strong> Ce lien est valable 24h et ne peut être utilisé qu'une seule fois.
            Si vous n'avez pas créé de compte sur OmraBonsPlans.fr, vous pouvez ignorer cet email en toute sécurité.
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            Besoin d'aide ? Contactez-nous à{' '}
            <Link href="mailto:support@omrabonsplans.fr" style={footerLink}>
              support@omrabonsplans.fr
            </Link>
          </Text>
          
          <Text style={footerText}>
            <Link href="https://omrabonsplans.fr" style={footerLink}>
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

export default ConfirmationEmail

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
  backgroundColor: '#1e40af',
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
  color: '#e0e7ff',
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
  backgroundColor: '#1e40af',
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
  color: '#1e40af',
  fontSize: '12px',
  wordBreak: 'break-all' as const,
  backgroundColor: '#f3f4f6',
  padding: '12px',
  borderRadius: '6px',
  margin: '0 0 24px 0',
}

const divider = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
}

const featuresSection = {
  margin: '24px 0',
}

const featureItem = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 8px 0',
}

const securityNote = {
  backgroundColor: '#fef3c7',
  border: '1px solid #f59e0b',
  borderRadius: '8px',
  color: '#92400e',
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
  color: '#1e40af',
  textDecoration: 'underline',
}

const copyright = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '16px 0 0 0',
}