import { z } from 'zod'

export const registroSchema = z
  .object({
    email: z
      .string()
      .min(1, 'auth.errors.emailRequired')
      .email('auth.errors.emailInvalid'),
    tipoDocumento: z
      .string()
      .min(1, 'auth.errors.docTypeRequired'),
    numeroDocumento: z
      .string()
      .min(1, 'auth.errors.docNumberRequired'),
    password: z
      .string()
      .min(1, 'auth.errors.passwordRequired')
      .min(8, 'auth.errors.passwordMinLength')
      .regex(/[A-Z]/, 'auth.errors.passwordUppercase')
      .regex(/[a-z]/, 'auth.errors.passwordLowercase')
      .regex(/\d/, 'auth.errors.passwordDigit')
      .regex(/[!@#$%^&*()\-_+=\[\]{}|;:',.<>?/]/, 'auth.errors.passwordSpecialChar'),
    confirmPassword: z
      .string()
      .min(1, 'auth.errors.confirmPasswordRequired'),
    nombre: z
      .string()
      .min(1, 'auth.errors.nombreRequired'),
    apellido: z
      .string()
      .min(1, 'auth.errors.apellidoRequired'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.errors.passwordMismatch',
    path: ['confirmPassword'],
  })

export type RegistroFormData = z.infer<typeof registroSchema>
