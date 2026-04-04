import { z } from 'zod'

/**
 * Valida formato CUIT argentino: XX-XXXXXXXX-X (con o sin guiones).
 * Solo formato, no digito verificador.
 */
function isValidCuitFormat(value: string): boolean {
  const clean = value.replace(/-/g, '')
  return /^\d{11}$/.test(clean)
}

export const registroEmpresaSchema = z
  .object({
    // Paso 1: datos de contacto
    nombre: z.string().min(1, 'auth.errors.nombreRequired'),
    apellido: z.string().min(1, 'auth.errors.apellidoRequired'),
    email: z
      .string()
      .min(1, 'auth.errors.emailRequired')
      .email('auth.errors.emailInvalid'),
    telefono: z.string().optional(),
    tipoDocumento: z.string().min(1, 'auth.errors.docTypeRequired'),
    numeroDocumento: z.string().min(1, 'auth.errors.docNumberRequired'),

    // Paso 2: password
    password: z
      .string()
      .min(1, 'auth.errors.passwordRequired')
      .min(8, 'auth.errors.passwordMinLength')
      .regex(/[A-Z]/, 'auth.errors.passwordUppercase')
      .regex(/\d/, 'auth.errors.passwordDigit'),
    confirmPassword: z.string().min(1, 'auth.errors.confirmPasswordRequired'),

    // Paso 3: empresa
    empresaNombre: z.string().min(1, 'auth.errors.empresaNombreRequired'),
    empresaCuit: z
      .string()
      .min(1, 'auth.errors.empresaCuitRequired')
      .refine(isValidCuitFormat, 'auth.errors.empresaCuitInvalid'),
    empresaRubro: z.string().optional(),

    // Paso 4: modulos
    modulos: z.array(z.string()).min(1, 'auth.errors.modulosRequired'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.errors.passwordMismatch',
    path: ['confirmPassword'],
  })

export type RegistroEmpresaFormData = z.infer<typeof registroEmpresaSchema>
