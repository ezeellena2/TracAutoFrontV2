# Prompt para continuar implementacion del frontend — Prompts 05 a 10

> Copia todo este contenido en un nuevo chat para continuar.

---

## Contexto

Estamos construyendo el frontend de TracAuto v2 (TracAutoFrontV2). Los primeros 4 prompts del slice-01 ya estan completados:

- **01** ✅ Estructura base (carpetas, TailwindCSS tokens, i18n, axios client)
- **02** ✅ Stores y tipos (SessionSnapshot types, Zustand session store, bridge conexion)
- **03** ✅ Routing y shells (LandingPage, AuthShell, AppShell, ProtectedRoute, PublicOnlyRoute)
- **04** ✅ Login (LoginPage con React Hook Form + Zod + useLogin hook + parseApiError + UI components)

Quedan los prompts 05 a 10.

## Repositorios

- **TracAutoFrontV2/** (`C:\Users\ezequ\source\repos\TracAutoFrontV2`) — frontend React (donde trabajas)
- **TracAutoV2/** (`C:\Users\ezequ\source\repos\TracAutoV2`) — backend .NET con docs, mockups, arquitectura

## Documentacion OBLIGATORIA antes de cada prompt

Para CADA prompt que implementes, debes leer:

### Siempre (todos los prompts)
1. `C:\Users\ezequ\source\repos\TracAutoFrontV2\CLAUDE.md` — reglas, patrones, antipatrones, checklist, skills
2. `C:\Users\ezequ\source\repos\TracAutoV2\CLAUDE.md` — reglas backend, endpoints, JWT, Session Snapshot
3. `C:\Users\ezequ\source\repos\TracAutoV2\docs\planes\arquitectura-v3\12-patrones-de-implementacion-web-y-servicios.md` — patrones cross-cutting

### Los 6 docs web normativos
4. `C:\Users\ezequ\source\repos\TracAutoV2\docs\planes\web\base-y-alcance-web.md`
5. `C:\Users\ezequ\source\repos\TracAutoV2\docs\planes\web\estructura-base-y-capas-web.md`
6. `C:\Users\ezequ\source\repos\TracAutoV2\docs\planes\web\sesion-contexto-y-contratos-web.md`
7. `C:\Users\ezequ\source\repos\TracAutoV2\docs\planes\web\navegacion-y-superficies-web.md`
8. `C:\Users\ezequ\source\repos\TracAutoV2\docs\planes\web\calidad-seguridad-y-operacion-web.md`
9. `C:\Users\ezequ\source\repos\TracAutoV2\docs\planes\web\reglas-para-ia-web.md`

### El prompt especifico
10. El archivo del prompt en `TracAutoFrontV2/docs/implementacion/slice-01-auth/` — tiene docs adicionales especificos (mockups, endpoints backend)

## Lo que ya existe en el codigo

### Estructura
```
src/
  app/
    App.tsx                          ← raiz, monta AppProviders + AppRouter
    providers/AppProviders.tsx       ← React Query + setup session bridge
    routing/
      AppRouter.tsx                  ← LandingPage, AuthShell, AppShell
      ProtectedRoute.tsx             ← guard con recovery de sesion
      PublicOnlyRoute.tsx            ← guard anti-login si ya autenticado
    shells/
      AuthShell.tsx                  ← layout publico: logo + Outlet
      AppShell.tsx                   ← layout protegido: header + Outlet
  config/env.ts                      ← baseUrl, locale
  features/
    access/
      hooks/useLogin.ts              ← useMutation + store + navigate
      schemas/login-schema.ts        ← Zod schema con claves i18n
      pages/
        LoginPage.tsx                ← formulario real con RHF + Zod + errores
        RegistroPage.tsx             ← placeholder
        RegistroEmpresaPage.tsx      ← placeholder
        AceptarInvitacionPage.tsx    ← placeholder
    landing/pages/LandingPage.tsx    ← pagina publica de marketing
    shell/pages/DashboardPage.tsx    ← placeholder autenticado
  services/
    http/http-client.ts              ← axios con interceptors JWT + refresh
    auth/auth-service.ts             ← 7 funciones HTTP (login, registro, etc.)
    session/
      http-session-bridge.ts         ← bridge desacoplado
      setup-session-bridge.ts        ← conexion bridge → Zustand
    contracts/auth.ts                ← tipos TS de requests/responses
  stores/session-store.ts            ← Zustand: accessToken, snapshot, login/logout/updateContext
  shared/
    errors/parse-api-error.ts        ← parsea ProblemDetails → ApiError + helpers de resolucion
    ui/Input.tsx, Button.tsx, Alert.tsx, TracAutoMark.tsx
    i18n/index.ts + locales (es-AR, en)
```

### Patrones establecidos (CLAUDE.md del front tiene 10 secciones)

1. **Features y custom hooks**: hook por feature (useLogin), pagina solo consume hook
2. **Formularios**: Schema Zod (mensajes i18n) + React Hook Form + zodResolver
3. **Errores backend → UI**: parseApiError(), resolveApiFieldErrors(), resolveApiErrorMessage(), `message_key`/`code` como fuente primaria
4. **Routing**: ProtectedRoute (con recovery), PublicOnlyRoute, 3 zonas (landing, auth, app)
5. **Stores**: selectores especificos, solo hooks escriben
6. **Servicios HTTP**: authService con funciones puras
7. **i18n**: namespace por area, claves jerarquicas
8. **UI compartida**: Input, Button, Alert en shared/ui/
9. **Antipatrones**: 19 items documentados
10. **Checklist**: funcionalidad + calidad + accesibilidad + build

### React 19 — cosas importantes
- NO usar memo/useMemo/useCallback manual (el Compiler los aplica)
- NO usar setState directo en useEffect (el linter de React 19 lo rechaza)
- Usar `useMutation` de React Query para async en componentes
- Usar ternario en vez de `&&` para conditional rendering

### Endpoints backend (Access.Api en https://localhost:7201)

| Endpoint | Body | Response |
|---|---|---|
| `POST /api/auth/registro` | `{ email, password, tipoDocumento, numeroDocumento, nombre, apellido }` | `{ accessToken, refreshToken, sessionSnapshot }` |
| `POST /api/auth/registro-empresa` | `{ nombre, apellido, email, telefono?, tipoDocumento, numeroDocumento, password, empresa: { nombre, cuit, rubro? }, modulos: [...] }` | idem |
| `POST /api/auth/login` | `{ email, password }` | idem |
| `POST /api/auth/refresh` | `{}` (cookie) | idem |
| `POST /api/auth/logout` | `{}` | 204 |
| `POST /api/auth/cambiar-contexto` | `{ organizacionId }` (JWT required) | idem |
| `POST /api/auth/aceptar-invitacion` | `{ token, email, password, tipoDocumento?, numeroDocumento?, nombre?, apellido?, esRegistroNuevo }` | idem |

### Contrato de errores vigente

- `code`, `message_key`, `args` y `trace_id` son el contrato estable
- `validation_errors` es la fuente primaria para errores por campo
- `errors` y `detail` existen como fallback/compatibilidad, no como contrato UX
- el frontend traduce desde `message_key` o `errors.${code}`, nunca desde `detail` como primera opcion

## Prompts pendientes

Implementalos en orden. Cada prompt tiene su archivo en `docs/implementacion/slice-01-auth/` — leelo primero.

### 05 — Registro B2C
- Mockup: `TracAutoV2/docs/mockups/registro-b2c/index.html` (multi-step, 5 pasos)
- Backend: `POST /api/auth/registro`
- Crear: `schemas/registro-schema.ts`, `hooks/useRegistro.ts`, reemplazar `RegistroPage.tsx`
- Patron: mismo que login (schema Zod + hook + page)

### 06 — Registro Empresa
- Mockup: `TracAutoV2/docs/mockups/registro-empresa/index.html` (multi-step, 5 pasos)
- Backend: `POST /api/auth/registro-empresa`
- Crear: `schemas/registro-empresa-schema.ts`, `hooks/useRegistroEmpresa.ts`, reemplazar `RegistroEmpresaPage.tsx`
- Extra: validacion de CUIT argentino en Zod, seleccion de modulos

### 07 — Selector de Contexto
- Mockup: `TracAutoV2/docs/mockups/login/selector.html`
- Backend: `POST /api/auth/cambiar-contexto`
- Este componente se muestra cuando el usuario tiene multiples organizaciones
- Derivar B2B/B2C de `esMicroOrg` — no inventar tipo_contexto
- Crear: `features/context/hooks/useContextSwitch.ts`, `features/context/pages/ContextSelectorPage.tsx`
- Integrar con AppShell o post-login flow

### 08 — Refresh y Logout
- Backend: `POST /api/auth/refresh` (cookie), `POST /api/auth/logout`
- El refresh ya esta semi-implementado en el bridge y en ProtectedRoute
- Crear boton de logout en AppShell que llama authService.logout() + store.logout() + navigate
- Verificar que el interceptor de 401 funciona end-to-end

### 09 — Aceptar Invitacion
- Mockup: `TracAutoV2/docs/mockups/invitacion/index.html`
- Backend: `POST /api/auth/aceptar-invitacion`
- Dos casos: usuario existente (login + vincular) y usuario nuevo (registro + vincular)
- Campo `esRegistroNuevo` condiciona que campos mostrar
- Crear: `schemas/aceptar-invitacion-schema.ts`, `hooks/useAceptarInvitacion.ts`, reemplazar `AceptarInvitacionPage.tsx`

### 10 — Auditoria Visual
- Abrir cada mockup HTML y comparar con la pantalla implementada
- Verificar: colores, tipografia, espaciado, border radius, estados hover/focus
- Verificar accesibilidad: contraste, touch targets, focus rings, labels, aria-labels
- Verificar i18n: todo texto en es-AR y en
- Verificar build y lint limpios
- Listar diferencias y corregir

## Al completar cada prompt

1. Marcar estado como `✅ Completado` con fecha en el archivo del prompt
2. Verificar `npm run build` y `npm run lint` — 0 errores
3. Verificar i18n en es-AR y en
4. Verificar que la UI sigue los tokens del mockup

## Reglas

- Leer TODA la documentacion referenciada antes de implementar
- Seguir los patrones del CLAUDE.md del front (10 secciones)
- No copiar del frontend v1
- No inventar endpoints — solo los 7 listados arriba
- No inventar campos en Session Snapshot
- Todo texto con i18n
- React 19 strict: no memo manual, no setState en effect, ternario no &&
- Accesibilidad: labels visibles, focus rings, touch targets 44px, contraste 4.5:1
- Explicar cada decision brevemente
- Si algo no esta claro en la documentacion, preguntar antes de inventar
