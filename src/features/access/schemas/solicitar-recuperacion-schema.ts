import { z } from 'zod'

export const solicitarRecuperacionPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'auth.errors.emailRequired')
    .email('auth.errors.emailInvalid'),
})

export type SolicitarRecuperacionPasswordFormData = z.infer<
  typeof solicitarRecuperacionPasswordSchema
>
