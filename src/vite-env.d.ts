/// <reference types="vite/client" />

// Importação de arquivos Markdown como string crua (Vite `?raw`).
declare module '*.md?raw' {
  const content: string
  export default content
}
