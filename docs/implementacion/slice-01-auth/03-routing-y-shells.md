# 03 - Routing y shells

## Estado: ✅ Completado (2026-04-03)

## Objetivo

Construir el arbol de navegacion base con shell de bootstrap, shell auth publico y shell autenticado protegido.

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
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\planes\web\navegacion-y-superficies-web.md` (shells definition)
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\mockups\login\selector.html` (context selector mockup)

## Patrones obligatorios

- React Router
- shells explicitos
- redirect seguro segun sesion y contexto
- i18n en todas las superficies

## Que debe hacer

- crear shell de bootstrap
- crear shell publico para auth
- crear shell autenticado comun
- redirigir a auth si no hay sesion valida
- redirigir a shell autenticado si ya existe sesion valida
- reconciliar rutas profundas con contexto activo

## Que NO debe hacer

- no duplicar arboles por `B2B` y `B2C`
- no decidir permisos por URL
- no crear un gateway local de navegacion funcional

## Criterios de aceptacion

- existen 3 shells claros
- la proteccion de rutas es visible y auditable
- la app no entra al shell solo por cache local

## Al completar este prompt

1. Marcar el estado como `✅ Completado` con la fecha
2. Verificar `npm run build` y `npm run lint` — 0 errores
3. Si se crearon tipos nuevos, verificar que estan alineados con los contratos del backend
4. Si se crearon componentes con UI, verificar que siguen los tokens del mockup
5. Si se agregaron claves i18n, verificar que existen en `es-AR/` y `en/`
