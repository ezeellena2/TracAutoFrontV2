# 05 - Registro B2C

## Estado: ✅ Completado (2026-04-03)

## Objetivo

Implementar el registro persona fisica de 5 pasos alineado con `docs/mockups/registro-b2c/index.html`.

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
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\mockups\registro-b2c\index.html` (mockup - OBLIGATORIO)
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\implementacion\slice-01-auth-identidad\08-registro-b2c.md` (backend registro flow, request/response)

## Patrones obligatorios

- React Hook Form + Zod
- formularios por pasos
- axios centralizado
- i18n

## Que debe hacer

- modelar los 5 pasos del mockup
- validar email, documento, password, nombre y apellido
- consumir `POST /api/auth/registro`
- hidratar sesion al exito

## Que NO debe hacer

- no cambiar el flujo de 5 pasos
- no inventar campos fuera del contrato backend
- no meter logica de auth en componentes base

## Criterios de aceptacion

- flujo de 5 pasos operativo
- validaciones consistentes
- UI cercana al mockup

## Al completar este prompt

1. Marcar el estado como `✅ Completado` con la fecha
2. Verificar `npm run build` y `npm run lint` — 0 errores
3. Si se crearon tipos nuevos, verificar que estan alineados con los contratos del backend
4. Si se crearon componentes con UI, verificar que siguen los tokens del mockup
5. Si se agregaron claves i18n, verificar que existen en `es-AR/` y `en/`
