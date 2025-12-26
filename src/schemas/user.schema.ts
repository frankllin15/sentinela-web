import { z } from 'zod';
import { UserRole } from '@/types/auth.types';

export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 dígitos')
    .max(12, 'Senha deve ter no máximo 12 dígitos')
    .regex(/^\d+$/, 'Senha deve conter apenas números'),
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
  role: z.enum([
    UserRole.ADMIN_GERAL,
    UserRole.PONTO_FOCAL,
    UserRole.GESTOR,
    UserRole.USUARIO,
  ], { required_error: 'Perfil é obrigatório' }),
  forceId: z.number().optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
