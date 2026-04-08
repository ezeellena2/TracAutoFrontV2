import { z } from 'zod'

export const registroEmailVerificationSchema = z.object({
  codigo: z
    .string()
    .min(1, 'auth.errors.codigoVerificacionRequired')
    .regex(/^\d{6}$/, 'auth.errors.codigoVerificacionInvalid'),
})

export type RegistroEmailVerificationFormData = z.infer<
  typeof registroEmailVerificationSchema
>
