import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 dígitos')
    .max(12, 'Senha deve ter no máximo 12 dígitos')
    .regex(/^\d+$/, 'Senha deve conter apenas números'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
