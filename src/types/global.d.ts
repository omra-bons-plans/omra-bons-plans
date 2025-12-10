// Global type declarations for the application

declare global {
  interface Window {
    __HIDE_PRERENDER__?: () => void;
  }
}

export {};
