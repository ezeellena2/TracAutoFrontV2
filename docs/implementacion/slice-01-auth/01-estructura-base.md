# 01 - Estructura base

## Estado: ✅ Completado

## Objetivo

Crear la base tecnica del frontend del slice-01: estructura de carpetas, tokens visuales, i18n, cliente axios y bootstrap minimo.

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
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\mockups\GUIA-MOCKUPS.md` (design tokens)

## Patrones obligatorios

- Zustand para estado transversal chico
- React Query para estado de servidor
- React Hook Form + Zod para formularios
- axios centralizado
- i18n obligatorio
- shells protegidos, aunque el detalle final llegue en el prompt 03

## Que debe hacer

- crear la estructura `app/`, `config/`, `services/`, `stores/`, `features/`, `modules/`, `shared/`
- configurar TailwindCSS v4 con tokens del mockup
- dejar `Inter` y `JetBrains Mono` como tipografias base
- configurar i18next con `es-AR` por defecto
- crear cliente axios base contra `https://localhost:7201`
- dejar interceptors listos para JWT en memoria y refresh futuro
- dejar un bootstrap visual minimo que pruebe la base del sistema

## Que NO debe hacer

- no implementar la pantalla final de login
- no crear stores gigantes
- no persistir access token en storage durable
- no inventar contratos distintos al backend del slice-01
- no copiar codigo del frontend v1

## Criterios de aceptacion

- `npm run build` pasa
- `npm run lint` pasa
- `npm run dev` levanta
- existe estructura base del proyecto
- existen i18n y axios centralizados
- la UI base ya usa los tokens dark-first del mockup

## Al completar este prompt

1. Marcar el estado como `✅ Completado` con la fecha
2. Verificar `npm run build` y `npm run lint` — 0 errores
3. Si se crearon tipos nuevos, verificar que estan alineados con los contratos del backend
4. Si se crearon componentes con UI, verificar que siguen los tokens del mockup
5. Si se agregaron claves i18n, verificar que existen en `es-AR/` y `en/`
