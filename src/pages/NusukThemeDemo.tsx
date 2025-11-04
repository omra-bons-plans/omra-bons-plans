import { NusukStyleDemo } from '@/components/ui/NusukStyleDemo';
import { DynamicSEO } from '@/components/SEO/DynamicSEO';
import ResponsiveLayout from '@/components/ResponsiveLayout';

export default function NusukThemeDemo() {
  return (
    <ResponsiveLayout>
      <DynamicSEO
        title="Aperçu Thème Nusuk - Omra Bons Plans"
        description="Aperçu de la nouvelle palette de couleurs inspirée de l'application Nusuk"
        path="/nusuk-theme-demo"
      />
      <NusukStyleDemo />
    </ResponsiveLayout>
  );
}
