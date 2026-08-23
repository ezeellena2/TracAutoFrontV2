/**
 * La puerta del catálogo de íconos.
 *
 * Se importa `@/shared/ui/iconos`, nunca `lucide-react`: esa es la regla **R-IC-2**, y la hace
 * cumplir `no-restricted-imports` en `eslint.config.js`.
 */
export { ICONOS, iconoDe, type NombreDeIcono } from './catalogo'
