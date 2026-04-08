import { z } from 'zod'

export const restablecerPasswordSchema = z
  .object({
    token: z.string().min(1, 'validation.token.required'),
    nuevaPassword: z
      .string()
      .min(1, 'auth.errors.passwordRequired')
      .min(8, 'auth.errors.passwordMinLength')
      .regex(/[A-Z]/, 'auth.errors.passwordUppercase')
      .regex(/\d/, 'auth.errors.passwordDigit'),
    confirmPassword: z.string().min(1, 'auth.errors.confirmPasswordRequired'),
  })
  .refine((data) => data.nuevaPassword === data.confirmPassword, {
    message: 'auth.errors.passwordMismatch',
    path: ['confirmPassword'],
  })

export type RestablecerPasswordFormData = z.infer<typeof restablecerPasswordSchema>
