# 08 - Refresh y logout

## Estado: ✅ Completado (2026-04-03)

## Objetivo

Completar la estrategia de refresh automatico, reconciliacion segura de sesion y logout.

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
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\implementacion\slice-01-auth-identidad\10-refresh-logout.md` (backend flow, token rotation, cookie vs body)

## Patrones obligatorios

- axios centralizado
- access token en memoria
- refresh token en cookie HttpOnly
- limpieza completa de stores y caches

## Que debe hacer

- completar interceptor 401 -> refresh
- reintentar request una sola vez
- limpiar sesion si refresh falla
- exponer logout que llame al backend y limpie stores/query cache

## Que NO debe hacer

- no guardar refresh token en JS
- no dejar al cliente en estado parcialmente autenticado

## Criterios de aceptacion

- refresh seguro y auditable
- logout limpia sesion y caches
- no hay loops infinitos de 401

## Al completar este prompt

1. Marcar el estado como `✅ Completado` con la fecha
2. Verificar `npm run build` y `npm run lint` — 0 errores
3. Si se crearon tipos nuevos, verificar que estan alineados con los contratos del backend
4. Si se crearon componentes con UI, verificar que siguen los tokens del mockup
5. Si se agregaron claves i18n, verificar que existen en `es-AR/` y `en/`
