---
description: Checklist obligatorio antes de implementar cualquier cambio en TracAutoFrontV2
---

# Pre-implementation check — TracAutoFrontV2

Este workflow es OBLIGATORIO antes de implementar cualquier cambio. No empezar a codear sin completarlo.

## Pasos

1. Identificar tipo de tarea (componente React, formulario, refactoring, etc.)

2. Leer `CLAUDE.md` de `TracAutoFrontV2` y verificar reglas no negociables

3. Leer los documentos normativos web obligatorios en `TracAutoV2`:
   - `docs/planes/web/README.md`
   - `docs/planes/web/base-y-alcance-web.md`
   - `docs/planes/web/estructura-base-y-capas-web.md`
   - `docs/planes/web/sesion-contexto-y-contratos-web.md`
   - `docs/planes/web/navegacion-y-superficies-web.md`
   - `docs/planes/web/calidad-seguridad-y-operacion-web.md`
   - `docs/planes/web/reglas-para-ia-web.md`

4. Leer los documentos de arquitectura obligatorios:
   - `docs/planes/arquitectura-v3/02-identidad-acceso-y-contexto-activo.md`
   - `docs/planes/arquitectura-v3/12-patrones-de-implementacion-web-y-servicios.md`

5. Si la tarea toca UI, abrir el mockup HTML correspondiente en `docs/mockups/`

6. Consultar skills relevantes segun la tabla en CLAUDE.md seccion "Skills disponibles y mapeo por tipo de tarea"

7. Crear artefacto `pre-implementacion.md` con:
   - Archivos normativos leidos (nombre + cantidad de lineas)
   - Skills consultados (nombre + motivo)
   - Backend duenio de cada pantalla involucrada
   - Restricciones arquitectonicas que aplican
   - Huecos documentales encontrados

8. Solicitar aprobacion del usuario antes de empezar a implementar

## Reglas

- NO empezar implementacion sin el artefacto de pre-implementacion aprobado
- Si falta un contrato backend, dejar el hueco visible y no inventarlo
- No copiar patrones del frontend v1 (TracAutoFront)
- No usar `apiClient`, `publicApiClient`, `useErrorHandler`, `ApiErrorBanner` — esos son del v1
