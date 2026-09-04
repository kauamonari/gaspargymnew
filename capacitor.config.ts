import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.gaspargym.app",
  appName: "Gaspar Gym",
  // Nitro (motor por trás do TanStack Start) publica os assets estáticos
  // finais em .output/public — é isso que vira o app dentro do WebView.
  webDir: ".output/public",
  server: {
    androidScheme: "https",
  },
};

export default config;
