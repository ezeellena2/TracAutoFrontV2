# 07 - Selector de contexto

## Estado: ✅ Completado (2026-04-03)

## Objetivo

Implementar el selector de organizaciones post-login alineado con `docs/mockups/login/selector.html`.

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
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\mockups\login\selector.html` (mockup - OBLIGATORIO)
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\implementacion\slice-01-auth-identidad\11-context-switch.md` (backend flow)
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\planes\arquitectura-v3\02-identidad-acceso-y-contexto-activo.md` (org activa, B2B/B2C contexts)

## Patrones obligatorios

- Zustand para contexto actual
- axios centralizado
- i18n

## Que debe hacer

- mostrar org activa y organizaciones disponibles desde snapshot
- derivar personal/empresa desde `esMicroOrg`
- cambiar contexto via `POST /api/auth/cambiar-contexto`
- rehidratar snapshot, shell y navegacion al exito

## Que NO debe hacer

- no usar `tipo_contexto`
- no hardcodear organizaciones
- no reconstruir permisos por cuenta propia

## Criterios de aceptacion

- selector visualmente consistente
- cambio de contexto operativo
- shell reconciliado despues del cambio

## Al completar este prompt

1. Marcar el estado como `✅ Completado` con la fecha
2. Verificar `npm run build` y `npm run lint` — 0 errores
3. Si se crearon tipos nuevos, verificar que estan alineados con los contratos del backend
4. Si se crearon componentes con UI, verificar que siguen los tokens del mockup
5. Si se agregaron claves i18n, verificar que existen en `es-AR/` y `en/`
