# 10 - Auditoria visual

## Estado: ✅ Completado (2026-04-03)

## Objetivo

Comparar las pantallas del slice-01 contra los mockups y asegurar coherencia visual, responsive y de UX.

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
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\mockups\login\index.html` (login mockup)
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\mockups\login\selector.html` (context selector mockup)
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\mockups\registro-b2c\index.html` (registro B2C mockup)
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\mockups\registro-empresa\index.html` (registro empresa mockup)
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\mockups\invitacion\index.html` (invitacion mockup)
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\mockups\GUIA-MOCKUPS.md` (design tokens)
- `C:\Users\ezequ\source\repos\TracAutoV2\docs\mockups\_shared\tokens.css` (CSS tokens)

## Patrones obligatorios

- tokens visuales consistentes
- i18n
- shells claros
- errores y estados base visibles

## Que debe hacer

- auditar login, registro B2C, registro empresa, selector e invitacion
- comparar tipografia, colores, superficies, bordes, sombras y spacing
- verificar desktop y mobile
- verificar loading, error y empty donde aplique
- distinguir entre desvio visual puro y desvio por contrato faltante del backend

## Que NO debe hacer

- no validar solo por "se parece"
- no ignorar responsive ni accesibilidad basica

## Criterios de aceptacion

- hay checklist visual por pantalla
- no quedan desviaciones graves frente a mockups
- el slice puede cerrarse visualmente
- cuando un mockup depende de datos/flows no expuestos, el informe lo deja asentado como limite contractual en lugar de inventar UI falsa

## Al completar este prompt

1. Marcar el estado como `✅ Completado` con la fecha
2. Verificar `npm run build` y `npm run lint` — 0 errores
3. Si se crearon tipos nuevos, verificar que estan alineados con los contratos del backend
4. Si se crearon componentes con UI, verificar que siguen los tokens del mockup
5. Si se agregaron claves i18n, verificar que existen en `es-AR/` y `en/`
