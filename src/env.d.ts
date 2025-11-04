/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV?: boolean;
  readonly VITE_API_URL?: string;
  readonly VITE_STREAMING_URL?: string;
  // add other VITE_ variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
