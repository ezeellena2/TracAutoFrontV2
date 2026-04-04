# Pre-implementacion — Slice 01 Prompts 05-10

## 1. Archivos normativos leidos

| Archivo | Lineas |
|---------|--------|
| TracAutoFrontV2/CLAUDE.md | ~250 |
| TracAutoV2/CLAUDE.md | ~167 |
| TracAutoV2/docs/planes/arquitectura-v3/12-patrones-de-implementacion-web-y-servicios.md | ~743 |
| TracAutoV2/docs/planes/web/base-y-alcance-web.md | 177 |
| TracAutoV2/docs/planes/web/estructura-base-y-capas-web.md | 246 |
| TracAutoV2/docs/planes/web/sesion-contexto-y-contratos-web.md | 201 |
| TracAutoV2/docs/planes/web/navegacion-y-superficies-web.md | 229 |
| TracAutoV2/docs/planes/web/calidad-seguridad-y-operacion-web.md | 133 |
| TracAutoV2/docs/planes/web/reglas-para-ia-web.md | 73 |
| TracAutoV2/docs/mockups/registro-b2c/index.html | 230 |
| TracAutoV2/docs/mockups/registro-b2c/styles.css | 177 |
| TracAutoV2/docs/mockups/registro-empresa/index.html | 341 |
| TracAutoV2/docs/mockups/login/selector.html | 167 |
| TracAutoV2/docs/mockups/invitacion/index.html | 107 |
| TracAutoV2/docs/implementacion/slice-01-auth-identidad/08-registro-b2c.md | 161 |
| TracAutoV2/docs/implementacion/slice-01-auth-identidad/11-context-switch.md | 118 |
| TracAutoV2/docs/implementacion/slice-01-auth-identidad/12-registro-empresa.md | 141 |
| TracAutoV2/docs/implementacion/slice-01-auth-identidad/14-invitacion-organizacion.md | 136 |
| TracAutoV2/docs/mockups/_shared/tokens.css | ~150 |

## 2. Skills consultados

No se consultaron skills externos. Se siguieron los patrones del CLAUDE.md seccion 1-10.

## 3. Backend duenio por pantalla

| Pantalla | Backend duenio |
|----------|---------------|
| Registro B2C | Access (POST /api/auth/registro) |
| Registro Empresa | Access (POST /api/auth/registro-empresa) |
| Selector de Contexto | Access (POST /api/auth/cambiar-contexto) |
| Refresh/Logout | Access (POST /api/auth/refresh, POST /api/auth/logout) |
| Aceptar Invitacion | Access (POST /api/auth/aceptar-invitacion) |

## 4. Restricciones arquitectonicas aplicadas

- Web no inventa identidad, contexto ni visibilidad
- B2B/B2C se derivan de esMicroOrg, no existe tipo_contexto
- Access token en memoria, refresh token en cookie HttpOnly
- HTTP centralizado en services/, pantallas nunca llaman axios directo
- Estado global minimo: solo sesion y contexto
- Formularios con React Hook Form + Zod, mensajes i18n
- React 19 strict: no memo manual (salvo useMemo para derivar estado), ternario en JSX
- Accesibilidad: labels visibles, focus rings 2px, touch targets 44px

## 5. Huecos documentales encontrados

- El mockup de invitacion muestra datos de la org (nombre, rol, modulos) pero el endpoint `POST /api/auth/aceptar-invitacion` no devuelve estos datos antes de aceptar. Se asumio que el frontend solo muestra el formulario sin preview de org hasta que el backend lo cierre.
- El mockup del selector de contexto muestra vista de modulos dentro de cada org, pero el backend solo expone `POST /api/auth/cambiar-contexto` sin seleccion de modulo. Se implemento solo el selector de org.
