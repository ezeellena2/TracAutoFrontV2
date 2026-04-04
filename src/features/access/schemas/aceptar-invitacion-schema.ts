import { z } from 'zod'

/**
 * Schema para caso A: usuario existente que acepta invitacion con login.
 */
export const invitacionLoginSchema = z.object({
  token: z.string().min(1),
  email: z
    .string()
    .min(1, 'auth.errors.emailRequired')
    .email('auth.errors.emailInvalid'),
  password: z.string().min(1, 'auth.errors.passwordRequired'),
  esRegistroNuevo: z.literal(false),
})

export type InvitacionLoginFormData = z.infer<typeof invitacionLoginSchema>

/**
 * Schema para caso B: usuario nuevo que se registra al aceptar invitacion.
 */
export const invitacionRegistroSchema = z
  .object({
    token: z.string().min(1),
    email: z
      .string()
      .min(1, 'auth.errors.emailRequired')
      .email('auth.errors.emailInvalid'),
    nombre: z.string().min(1, 'auth.errors.nombreRequired'),
    apellido: z.string().min(1, 'auth.errors.apellidoRequired'),
    tipoDocumento: z.string().min(1, 'auth.errors.docTypeRequired'),
    numeroDocumento: z.string().min(1, 'auth.errors.docNumberRequired'),
    password: z
      .string()
      .min(1, 'auth.errors.passwordRequired')
      .min(8, 'auth.errors.passwordMinLength')
      .regex(/[A-Z]/, 'auth.errors.passwordUppercase')
      .regex(/\d/, 'auth.errors.passwordDigit'),
    confirmPassword: z.string().min(1, 'auth.errors.confirmPasswordRequired'),
    esRegistroNuevo: z.literal(true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.errors.passwordMismatch',
    path: ['confirmPassword'],
  })

export type InvitacionRegistroFormData = z.infer<typeof invitacionRegistroSchema>
