# 09 - Aceptar invitacion

## Estado: ✅ Completado (2026-04-03)

## Objetivo

Implementar la pantalla de aceptar invitacion alineada con `docs/mockups/invitacion/index.html`.

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
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\mockups\invitacion\index.html` (mockup - OBLIGATORIO)
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\implementacion\slice-01-auth-identidad\14-invitacion-organizacion.md` (backend flow, case A and B)

## Patrones obligatorios

- React Hook Form + Zod
- axios centralizado
- i18n

## Que debe hacer

- soportar caso usuario existente y caso usuario nuevo
- modelar tabs o variante equivalente del mockup
- validar credenciales o alta segun corresponda
- hidratar snapshot y navegar al shell correcto

## Que NO debe hacer

- no crear un flujo paralelo de auth
- no inventar campos que el backend no acepta

## Limites cerrados del slice

- el mockup muestra una preview rica de la organizacion: nombre, rol, modulos e invitador
- hoy `Access` no expone un endpoint publico de preview para esa informacion antes de aceptar
- por lo tanto la pantalla no debe inventar esos datos ni hardcodearlos
- hasta cerrar ese contrato, la UI se limita al formulario y al disclaimer

## Criterios de aceptacion

- ambos casos funcionan
- UI consistente con el mockup
- el usuario termina con sesion valida
- cualquier gap visual dependiente de datos no expuestos queda documentado y no se rellena con fake data

## Al completar este prompt

1. Marcar el estado como `✅ Completado` con la fecha
2. Verificar `npm run build` y `npm run lint` — 0 errores
3. Si se crearon tipos nuevos, verificar que estan alineados con los contratos del backend
4. Si se crearon componentes con UI, verificar que siguen los tokens del mockup
5. Si se agregaron claves i18n, verificar que existen en `es-AR/` y `en/`
