import { z } from "zod";
import { validateCPF } from "@/lib/cpf.utils";

export const registerPersonSchema = z.object({
  // Seção A: Mídia
  facePhoto: z
    .instanceof(File)
    .nullable()
    .refine((file) => file !== null, "Foto de rosto é obrigatória"),
  fullBodyPhoto: z
    .instanceof(File)
    .nullable()
    .refine((file) => file !== null, "Foto de corpo inteiro é obrigatória"),
  tattoos: z.array(
    z.object({
      photo: z.instanceof(File),
      location: z.string().min(1, "Local é obrigatório"),
      description: z.string().optional(),
    })
  ),

  // Seção B: Dados Pessoais
  fullName: z
    .string()
    .min(1, "Nome completo é obrigatório")
    .max(255, "Nome muito longo"),
  nickname: z.string().max(100).optional().or(z.literal("")),
  cpf: z
    .string()
    .optional()
    .refine((val) => !val || validateCPF(val), "CPF inválido")
    .or(z.literal("")),
  rg: z.string().max(20).optional().or(z.literal("")),
  voterId: z.string().max(20).optional().or(z.literal("")),
  motherName: z.string().max(255).optional().or(z.literal("")),
  fatherName: z.string().max(255).optional().or(z.literal("")),

  // Seção C: Localização e Legal
  addressPrimary: z.string().min(1, "Endereço é obrigatório"),
  addressSecondary: z.string().optional().or(z.literal("")),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  hasWarrant: z.boolean().default(false),
  warrantStatus: z.string().optional().or(z.literal("")),
  warrantFile: z.instanceof(File).nullable().optional(),
  isConfidential: z.boolean().default(false),
  notes: z.string().optional().or(z.literal("")),
});

export type RegisterPersonFormData = z.infer<typeof registerPersonSchema>;
