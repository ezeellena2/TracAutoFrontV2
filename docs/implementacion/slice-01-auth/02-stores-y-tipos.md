# 02 - Stores y tipos

## Estado: ✅ Completado (2026-04-03)

## Objetivo

Modelar los contratos del slice-01 y crear los stores globales minimos para sesion, contexto y shell.

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
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\planes\web\sesion-contexto-y-contratos-web.md` (Session Snapshot contract)
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\planes\arquitectura-v3\02-identidad-acceso-y-contexto-activo.md` (JWT claims, Session Snapshot format)

## Patrones obligatorios

- Zustand solo para sesion, contexto, shell y preferencias
- React Query para datos remotos
- i18n obligatorio
- axios centralizado

## Que debe hacer

- definir tipos de `Session Snapshot`
- modelar `OrganizacionActiva` y `OrganizacionesDisponibles`
- crear store de sesion con access token en memoria
- crear store de contexto derivado del snapshot
- crear helpers para limpiar sesion y reconciliar contexto
- derivar personal/empresa desde `esMicroOrg`

## Que NO debe hacer

- no inventar `tipo_contexto`
- no meter listas funcionales en stores globales
- no usar `localStorage` para access token
- no copiar DTOs del frontend viejo

## Criterios de aceptacion

- tipos alineados al backend
- stores chicos y auditables
- no hay secretos durables en storage
- el bridge de axios puede leer el access token del store

## Al completar este prompt

1. Marcar el estado como `✅ Completado` con la fecha
2. Verificar `npm run build` y `npm run lint` — 0 errores
3. Si se crearon tipos nuevos, verificar que estan alineados con los contratos del backend
4. Si se crearon componentes con UI, verificar que siguen los tokens del mockup
5. Si se agregaron claves i18n, verificar que existen en `es-AR/` y `en/`
