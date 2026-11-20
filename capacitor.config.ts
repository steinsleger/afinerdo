import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'ar.com.steinsleger.afinerdo',
  appName: 'Afinerdo',
  webDir: 'dist',
  // Every page asks for viewport-fit=cover, so the WebView starts edge to edge instead of jumping there on the first page.
  plugins: {
    SystemBars: { initialViewportFitValueHint: 'cover' },
  },
}

export default config
