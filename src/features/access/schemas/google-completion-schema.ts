import { z } from 'zod'

export const googleCompletionSchema = z
  .object({
    tipoDocumento: z.string().min(1, 'auth.errors.docTypeRequired'),
    numeroDocumento: z.string().min(1, 'auth.errors.docNumberRequired'),
    password: z
      .string()
      .min(1, 'auth.errors.passwordRequired')
      .min(8, 'auth.errors.passwordMinLength')
      .regex(/[A-Z]/, 'auth.errors.passwordUppercase')
      .regex(/\d/, 'auth.errors.passwordDigit'),
    confirmPassword: z.string().min(1, 'auth.errors.confirmPasswordRequired'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.errors.passwordMismatch',
    path: ['confirmPassword'],
  })

export type GoogleCompletionFormData = z.infer<typeof googleCompletionSchema>
