import { NuxtConfig } from 'nuxt/schema';

declare module 'nuxt/schema' {
  interface NuxtConfig {
    compatibilityDate?: string;
    components?: boolean;
    app: Array;
    css: Array;
    runtimeConfig: any;
    router: any;
  }
}
