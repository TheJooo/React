/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_API_URL: string;
  readonly PORT: string;
  readonly DB_HOST: string;
  readonly DB_USER: string;
  readonly DB_PASSWORD: string;
  readonly DB_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
