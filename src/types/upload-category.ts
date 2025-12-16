// Definimos os tipos de pastas permitidas para evitar bagunça
export const UploadCategory = {
  FACE: "FACE",
  FULL_BODY: "FULL_BODY",
  TATTOO: "TATTOO",
  WARRANT: "WARRANT",
} as const;

export type UploadCategory =
  (typeof UploadCategory)[keyof typeof UploadCategory];
