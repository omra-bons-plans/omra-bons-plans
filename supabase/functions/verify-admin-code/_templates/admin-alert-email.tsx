import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Text,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface AdminAlertEmailProps {
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export const AdminAlertEmail = ({
  ipAddress,
  userAgent,
  timestamp,
}: AdminAlertEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🔒 Alerte de Connexion Admin</Heading>
        <Text style={text}>
          Une connexion à l'interface admin a été effectuée avec succès.
        </Text>
        <div style={infoBox}>
          <Text style={infoText}>
            <strong>📅 Date et heure:</strong> {timestamp}
          </Text>
          <Text style={infoText}>
            <strong>🌐 Adresse IP:</strong> {ipAddress || 'Non disponible'}
          </Text>
          <Text style={infoText}>
            <strong>💻 Appareil:</strong> {userAgent}
          </Text>
        </div>
        <Text style={warningText}>
          ⚠️ Si ce n'est pas vous, veuillez changer immédiatement votre mot de passe 
          et contacter l'équipe de sécurité.
        </Text>
        <Text style={footer}>
          OmraBonsPlans - Système de sécurité
        </Text>
      </Container>
    </Body>
  </Html>
);

export default AdminAlertEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#0B1E3A',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 20px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 20px',
};

const infoBox = {
  backgroundColor: '#f5f5f5',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 20px',
};

const infoText = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
};

const warningText = {
  color: '#d32f2f',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '24px 0',
  padding: '16px 20px',
  backgroundColor: '#ffebee',
  borderRadius: '8px',
  border: '1px solid #ef5350',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 20px',
  marginTop: '32px',
};
