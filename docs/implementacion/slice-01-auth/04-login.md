# 04 - Login

## Estado: ✅ Completado (2026-04-03)

## Objetivo

Implementar la pantalla de login del slice-01 alineada visualmente con `docs/mockups/login/index.html`.

## Documentacion a leer (OBLIGATORIO)

### Reglas y patrones del proyecto
- `CLAUDE.md` del frontend (reglas, patrones de implementacion, antipatrones, checklist)

### Arquitectura y contratos del backend
- `C:\Users\ezequ\source\repos\TracAutoV2\CLAUDE.md` (reglas del backend, endpoints, JWT, Session Snapshot)
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\planes\arquitectura-v3\12-patrones-de-implementacion-web-y-servicios.md` (patrones cross-cutting del backend)

### Documentacion web normativa
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\planes\web\base-y-alcance-web.md`
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\planes\web\estructura-base-y-capas-web.md`
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\planes\web\sesion-contexto-y-contratos-web.md`
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\planes\web\navegacion-y-superficies-web.md`
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\planes\web\calidad-seguridad-y-operacion-web.md`
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\planes\web\reglas-para-ia-web.md`

### Especifico de este prompt
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\mockups\login\index.html` (login mockup - OBLIGATORIO)
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\implementacion\slice-01-auth-identidad\09-login-jwt-session.md` (backend login flow, request/response)

## Patrones obligatorios

- React Hook Form + Zod
- axios centralizado
- i18n
- normalizacion de errores

## Que debe hacer

- reproducir el layout del mockup
- validar email y password con Zod
- consumir `POST /api/auth/login`
- hidratar sesion y snapshot
- manejar loading y errores de credenciales

## Que NO debe hacer

- no guardar refresh token en JS
- no hardcodear mensajes fuera de i18n
- no usar fetch directo
- no inventar flujos de recuperacion de contraseña ni Google sign-in si el backend no los expone
- si en el futuro se implementa Google sign-in, seguir `C:\Users\ezequ\source\repos\TracAutoV2\docs\planes\arquitectura-v3\14-cuentas-federadas-y-google-sign-in.md`

## Limites cerrados del slice

- el mockup incluye "¿Olvidaste tu contraseña?" y "Continuar con Google"
- en este slice esos flujos no existen todavia en `Access`
- la UI puede mostrar el lugar visual, pero debe marcarlo como no disponible y no simular navegacion real
- cuando se implemente Google sign-in, el flujo correcto no es login-or-register silencioso; debe respetar `authenticated`, `requires_profile_completion` y `requires_account_link`

## Criterios de aceptacion

- visualmente consistente con el mockup
- request y response alineados al backend
- errores y loading visibles
- cualquier CTA no implementada queda explicitamente marcada como pendiente

## Al completar este prompt

1. Marcar el estado como `✅ Completado` con la fecha
2. Verificar `npm run build` y `npm run lint` — 0 errores
3. Si se crearon tipos nuevos, verificar que estan alineados con los contratos del backend
4. Si se crearon componentes con UI, verificar que siguen los tokens del mockup
5. Si se agregaron claves i18n, verificar que existen en `es-AR/` y `en/`
