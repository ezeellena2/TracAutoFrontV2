# 06 - Registro empresa

## Estado: ✅ Completado (2026-04-03)

## Objetivo

Implementar el registro de empresa y duenio alineado con `docs/mockups/registro-empresa/index.html`.

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
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\mockups\registro-empresa\index.html` (mockup - OBLIGATORIO)
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\implementacion\slice-01-auth-identidad\12-registro-empresa.md` (backend flow, request/response)

## Patrones obligatorios

- React Hook Form + Zod
- flujo multi-step
- axios centralizado
- i18n

## Que debe hacer

- modelar 5 pasos coherentes con mockup
- validar datos de contacto, password, empresa y seleccion de modulos
- consumir el endpoint del backend sin inventar payloads
- mostrar resumen final con datos reales del response

## Que NO debe hacer

- no inventar modulos fuera de los mockups o del backend
- no duplicar logica del registro B2C sin adaptar contratos

## Criterios de aceptacion

- flujo multi-step consistente
- request y response correctos
- UI consistente con el mockup

## Al completar este prompt

1. Marcar el estado como `✅ Completado` con la fecha
2. Verificar `npm run build` y `npm run lint` — 0 errores
3. Si se crearon tipos nuevos, verificar que estan alineados con los contratos del backend
4. Si se crearon componentes con UI, verificar que siguen los tokens del mockup
5. Si se agregaron claves i18n, verificar que existen en `es-AR/` y `en/`
