import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0d32be0f306d480bb7fda00d6f7142c4',
  appName: 'pilgrim-plans',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://0d32be0f-306d-480b-b7fd-a00d6f7142c4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;