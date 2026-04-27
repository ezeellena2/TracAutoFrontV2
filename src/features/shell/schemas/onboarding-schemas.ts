import { z } from 'zod'

export const step1Schema = z.object({
  patente: z.string().min(1, 'validation.required'),
  marca: z.string().min(1, 'validation.required'),
  modelo: z.string().min(1, 'validation.required'),
  anio: z
    .number({ message: 'validation.required' })
    .min(1990, 'validation.yearMin')
    .max(2030, 'validation.yearMax'),
  tipo: z.string().min(1, 'validation.required'),
})

export const step2Schema = z.object({
  imei: z.string().optional(),
  dispModelo: z.string().optional(),
  sim: z.string().optional(),
})

export const step3Schema = z.object({
  nombre: z.string().optional(),
  apellido: z.string().optional(),
  dni: z.string().optional(),
  email: z.string().optional(),
  licenciaCategoria: z.string().optional(),
})

export type Step1Data = z.infer<typeof step1Schema>
export type Step2Data = z.infer<typeof step2Schema>
export type Step3Data = z.infer<typeof step3Schema>
