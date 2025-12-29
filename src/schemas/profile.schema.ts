import { z } from 'zod';

export const profileSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
    email: z
      .string()
      .min(1, 'Email é obrigatório')
      .email('Email inválido'),
    password: z
      .string()
      .min(6, 'Senha deve ter no mínimo 6 dígitos')
      .max(12, 'Senha deve ter no máximo 12 dígitos')
      .regex(/^\d+$/, 'Senha deve conter apenas números')
      .optional()
      .or(z.literal('')),
    confirmPassword: z
      .string()
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      // Se a senha foi preenchida, a confirmação também deve ser preenchida
      if (data.password && data.password.trim() !== '') {
        return data.confirmPassword === data.password;
      }
      // Se a senha está vazia, não precisa validar confirmação
      return true;
    },
    {
      message: 'As senhas não coincidem',
      path: ['confirmPassword'],
    }
  );

export type ProfileFormData = z.infer<typeof profileSchema>;
