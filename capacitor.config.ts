import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.8234ef117e83470ea37659dbc0325988',
  appName: 'agri-link-ebeer',
  webDir: 'dist',
  server: {
    url: 'https://8234ef11-7e83-470e-a376-59dbc0325988.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      backgroundColor: '#00562C',
      showSpinner: false,
    },
  },
};

export default config;