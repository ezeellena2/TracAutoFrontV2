# TracAutoFrontV2 - Reglas para agentes IA

> Este archivo es la fuente de verdad para cualquier agente IA que trabaje en este repositorio.
> Su contenido se replica en AGENTS.md.

## Documentacion autoritativa

### Repositorio normativo

- `C:\Users\ezequ\source\repos\TracAutoV2` es el repo autoritativo para arquitectura, contratos y mockups.
- `TracAutoFrontV2` es solo la implementacion frontend React.

### Web vigente en TracAutoV2

- `docs/planes/web/base-y-alcance-web.md`
- `docs/planes/web/estructura-base-y-capas-web.md`
- `docs/planes/web/sesion-contexto-y-contratos-web.md`
- `docs/planes/web/navegacion-y-superficies-web.md`
- `docs/planes/web/calidad-seguridad-y-operacion-web.md`
- `docs/planes/web/reglas-para-ia-web.md`

### Arquitectura y auth a respetar

- `docs/planes/arquitectura-v3/02-identidad-acceso-y-contexto-activo.md`
- `docs/planes/arquitectura-v3/05-modulos-vistas-y-superficies.md`
- `docs/planes/arquitectura-v3/08-infraestructura-contenedores-y-despliegue.md`
- `docs/planes/arquitectura-v3/12-patrones-de-implementacion-web-y-servicios.md`
- `docs/planes/arquitectura-v3/14-cuentas-federadas-y-google-sign-in.md`
- `docs/planes/web/README.md`
- `CLAUDE.md` del backend en `TracAutoV2`

### Mockups obligatorios

- `docs/mockups/GUIA-MOCKUPS.md`
- `docs/mockups/login/index.html`
- `docs/mockups/login/selector.html`
- `docs/mockups/registro-b2c/index.html`
- `docs/mockups/registro-empresa/index.html`
- `docs/mockups/invitacion/index.html`

### Endpoints backend del slice-01

- `POST /api/auth/registro`
- `POST /api/auth/registro-empresa`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/cambiar-contexto`
- `POST /api/auth/aceptar-invitacion`

Si una tarea toca `Google Sign-In`, no asumir endpoints ni contratos por fuera de:

- `C:\Users\ezequ\source\repos\TracAutoV2\docs\planes\arquitectura-v3\14-cuentas-federadas-y-google-sign-in.md`

Backend base URL por defecto en desarrollo:

- `https://localhost:7201`

## Stack y versiones instaladas

Versiones tomadas de `package.json`:

- React `19.2.4`
- React DOM `19.2.4`
- TypeScript `5.9.3`
- Vite `8.0.1`
- TailwindCSS `4.2.2`
- TanStack React Query `5.96.1`
- Zustand `5.0.12`
- React Router DOM `7.14.0`
- i18next `26.0.3`
- react-i18next `17.0.2`
- React Hook Form `7.72.0`
- Zod `4.3.6`
- Axios `1.14.0`
- Lucide React `1.7.0`

## Estructura de carpetas

```text
src/
  app/              # Bootstrap, providers, routing, shells, layout
  config/           # Variables de entorno y config de cliente
  features/         # access, context, profile, shell
  services/         # http, contracts, session, adapters
  stores/           # session, context, shell, preferences
  modules/          # modulos de negocio; vacio al inicio
  shared/           # ui, forms, i18n, errors, hooks, types, utils
```

## Reglas no negociables

- Web es superficie cliente, no backend.
- Web no inventa identidad, contexto, visibilidad ni permisos.
- Web no consulta directo `Traccar`.
- Web no consulta directo `Telemetria` para descubrir recursos visibles.
- No copiar DTOs, rutas ni logica del frontend v1.
- `B2B` y `B2C` se derivan de `esMicroOrg` de la org activa; no existe `tipo_contexto`.
- Todo texto visible debe pasar por i18n.
- HTTP vive centralizado en `services/`; una pantalla nunca llama `fetch` o `axios` directo.
- Estado global minimo en stores: sesion, contexto, shell, preferencias.
- Estado de feature y pantalla en React Query y estado local.
- Formularios con React Hook Form + Zod.
- Validacion de cliente con Zod; la validacion real del backend sigue en `Access`.
- No crear stores gigantes que simulen un backend.
- No duplicar navegacion por usuario `B2B` o `B2C`.
- No persistir secretos durables en `localStorage` o `sessionStorage`.
- Access token en memoria. Refresh token web en cookie HttpOnly manejada por backend.
- Si se implementa login federado, la pagina no inicializa el SDK en linea; usa adapter compartido + hook de feature.
- Si `Access` devuelve `requires_profile_completion` o `requires_account_link`, la UI ramifica por ese outcome; no lo deduce desde `detail`.

### React 19 y performance

- React 19 tiene Compiler: NO usar `React.memo`, `useMemo` ni `useCallback` manualmente — el compilador los aplica automaticamente.
- Usar `use()` en vez de `useContext()` (React 19).
- Usar `useTransition` para updates no urgentes (search, filtering).
- Lazy state initialization: `useState(() => expensiveComputation())`.
- Named functions en useEffect: `useEffect(function syncTitle() { ... }, [deps])`.
- Functional setState: `setCount(prev => prev + 1)` en vez de `setCount(count + 1)`.
- Condicionales con ternario, no con `&&` (evita renderizar `0` o valores falsy).

### Accesibilidad (obligatorio)

- Contraste minimo 4.5:1 entre texto y fondo.
- Touch targets minimo 44x44px.
- Focus rings visibles (2-4px) en todo elemento interactivo.
- Spacing scale consistente: multiplos de 4px (4, 8, 12, 16, 24, 32, 48).
- Toda animacion respeta `prefers-reduced-motion`.
- Labels visibles en formularios — no solo placeholder.
- `aria-label` en botones que solo tienen icono.

### Composicion de componentes

- Variantes explicitas en vez de props booleanos: `<PrimaryButton>` en vez de `<Button primary={true}>`.
- Componentes compuestos (compound components) con contexto para UI compleja.
- Componentes chicos (< 20 lineas de JSX). Si crece, extraer.
- Funciones con 0-2 argumentos. Si necesita mas, usar objeto de config.
- Error boundaries por feature/seccion, no uno global.

### Diseño y animacion

- Seguir los mockups HTML como referencia visual exacta (dark-first, cyan + amber).
- Animaciones con duracion 150-300ms. Usar CSS transitions o framer-motion.
- No desviarse de la estetica definida en los mockups por "simplificar".

## Patrones de implementacion

### 1. Features y custom hooks

Cada feature (login, registro, invitacion) se implementa como un custom hook que encapsula:
- la llamada al servicio HTTP
- la actualizacion del store
- el manejo de errores
- el estado de loading

```
features/
  access/
    hooks/
      useLogin.ts              ← custom hook
      useRegistro.ts
      useRegistroEmpresa.ts
    pages/
      LoginPage.tsx            ← componente de pagina (UI)
      RegistroPage.tsx
    schemas/
      login-schema.ts          ← schema Zod del formulario
      registro-schema.ts
```

Ejemplo de hook:

```typescript
// features/access/hooks/useLogin.ts
export function useLogin() {
  const login = useSessionStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      login(response.data)
      navigate('/app')
    },
  })
}
```

Reglas:
- el hook usa `useMutation` de React Query para manejar loading/error/success automaticamente
- el hook actualiza el store de Zustand en `onSuccess`
- la pagina solo llama al hook y renderiza UI
- la pagina NUNCA importa `authService` ni `useSessionStore` directo — usa el hook

### 2. Formularios con React Hook Form + Zod

Cada formulario tiene 3 piezas: schema Zod, hook de mutation, componente de pagina.

```typescript
// features/access/schemas/login-schema.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'auth.errors.emailRequired').email('auth.errors.emailInvalid'),
  password: z.string().min(1, 'auth.errors.passwordRequired'),
})

export type LoginFormData = z.infer<typeof loginSchema>
```

```typescript
// features/access/pages/LoginPage.tsx
const form = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
})

const loginMutation = useLogin()

const onSubmit = (data: LoginFormData) => {
  loginMutation.mutate(data)
}
```

Reglas:
- los mensajes de error de Zod son claves i18n (ej: `auth.errors.emailRequired`), no strings sueltos
- un schema por formulario, en carpeta `schemas/`
- el schema valida formato del lado cliente; la validacion real la hace el backend
- React Hook Form maneja dirty/touched/errors automaticamente

### 3. Errores del backend a la UI

El backend devuelve errores en formato ProblemDetails:

```json
// Error de validacion (400)
{
  "type": "https://tracauto.com/errors/validation",
  "title": "Solicitud invalida",
  "status": 400,
  "code": "validation.failed",
  "message_key": "errors.validation.failed",
  "trace_id": "00-abc123...",
  "validation_errors": {
    "Email": [
      {
        "code": "validation.email.required",
        "message_key": "validation.email.required",
        "message": "El email es obligatorio.",
        "args": {}
      }
    ]
  },
  "errors": {
    "Email": ["El email es obligatorio."]
  }
}

// Error de negocio (409)
{
  "type": "https://tracauto.com/errors/conflict",
  "title": "Conflicto",
  "status": 409,
  "detail": "Ya existe una cuenta con este email.",
  "code": "auth.email_duplicado",
  "message_key": "errors.auth.email_duplicado",
  "args": {},
  "trace_id": "00-abc123..."
}
```

El frontend los maneja asi:

```typescript
// shared/errors/parse-api-error.ts
export function parseApiError(error: unknown): ApiError {
  // extrae code, messageKey, args, traceId, validationErrors y fieldErrors legacy
}
```

En el componente o hook de feature:

```typescript
if (mutation.error) {
  const apiError = parseApiError(mutation.error)
  const generalError = resolveApiErrorMessage(apiError, t)
  const fieldErrors = resolveApiFieldErrors(apiError, t)

  Object.entries(fieldErrors).forEach(([field, message]) => {
    form.setError(field as never, { message })
  })
}
```

Reglas:
- `parseApiError` en `shared/errors/` — unico lugar que parsea errores de axios
- `resolveApiFieldErrors()` es la fuente primaria para mapear errores del backend al formulario
- `resolveApiErrorMessage()` es la fuente primaria para el mensaje general
- la UI resuelve copy desde `message_key` y, si falta, desde `errors.${code}`
- `detail` y `title` son solo fallback de ultimo recurso; no son contrato UX
- `validation_errors` es el formato vigente; `errors` se mantiene como compatibilidad legacy
- errores de negocio (409, 401, 403) se muestran como alerta general arriba del form
- errores de red (sin response) se muestran como error no recuperable
- nunca mostrar mensajes tecnicos del backend directo al usuario sin mapear

### 4. Routing y guards

3 shells separados:

```
AppRouter
  ├── BootstrapShell      → ruta "/" — verifica si hay sesion recuperable
  ├── AuthShell            → rutas "/auth/*" — login, registro, invitacion (publicas)
  └── AppShell             → rutas "/app/*" — shell autenticado (protegidas)
```

Guard de proteccion:

```typescript
// app/routing/ProtectedRoute.tsx
export function ProtectedRoute({ children }: PropsWithChildren) {
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  return <>{children}</>
}
```

Guard de redireccion (si ya esta autenticado, no mostrar login):

```typescript
// app/routing/PublicOnlyRoute.tsx
export function PublicOnlyRoute({ children }: PropsWithChildren) {
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/app" replace />
  }

  return <>{children}</>
}
```

Reglas:
- las rutas protegidas SIEMPRE pasan por `ProtectedRoute`
- si un usuario autenticado intenta ir a `/auth/login`, se redirige a `/app`
- el bootstrap verifica si hay cookie de refresh y puede rehidratar la sesion
- no hay guards por "tipo de usuario" — solo autenticado o no

### 5. Stores Zustand

Solo 2 stores globales para el slice-01:

**SessionStore** (ya creado):
- `accessToken`, `snapshot`, `isAuthenticated`, `esContextoPersonal`
- `login()`, `updateContext()`, `logout()`

**Regla de lectura desde componentes:**

```typescript
// Correcto: selector especifico (solo re-renderiza si cambia ese valor)
const nombre = useSessionStore((s) => s.snapshot?.nombre)
const isAuth = useSessionStore((s) => s.isAuthenticated)

// Incorrecto: leer todo el store (re-renderiza con cualquier cambio)
const session = useSessionStore()
```

Reglas:
- los componentes leen del store con selectores especificos
- solo los hooks de features escriben en el store (nunca un componente de UI directo)
- si un dato solo lo necesita una pantalla, no va en el store global — va en React Query o estado local

### 6. Servicios HTTP

Estructura:

```
services/
  http/
    http-client.ts          ← axios instance con interceptors (ya creado)
  auth/
    auth-service.ts         ← funciones que llaman endpoints de Access (ya creado)
  session/
    http-session-bridge.ts  ← bridge token store → http client (ya creado)
    setup-session-bridge.ts ← conexion bridge → Zustand (ya creado)
  contracts/
    auth.ts                 ← tipos TypeScript de requests/responses (ya creado)
```

Regla: cuando se agreguen modulos (flota, taller, etc.), cada uno agrega su service:

```
services/
  flota/
    flota-service.ts        ← funciones HTTP del modulo Flota
  contracts/
    auth.ts
    flota.ts                ← tipos de Flota
```

Un servicio es un objeto con funciones puras que hacen HTTP. No tiene estado, no actualiza stores.

### 7. i18n — organizacion de claves

```
shared/i18n/locales/
  es-AR/
    common.json             ← textos genericos (botones, labels, errores comunes)
    auth.json               ← textos de auth (login, registro, errores de auth)
```

Convenciones:
- namespace por area funcional: `common`, `auth`, `flota`, etc.
- claves jerarquicas: `auth.login.title`, `auth.errors.emailRequired`, `auth.registro.step1.title`
- errores de Zod usan claves i18n que se resuelven en el componente con `t()`
- cada feature puede tener su propio namespace

### 8. Componentes de UI compartidos

```
shared/
  ui/
    Button.tsx              ← boton con variantes (primary, secondary, danger)
    Input.tsx               ← input controlado con label + error
    Alert.tsx               ← alerta para mensajes de error/exito
    LoadingSpinner.tsx      ← spinner de carga
    FormField.tsx           ← wrapper input + label + error + React Hook Form
```

Reglas:
- los componentes de `shared/ui/` no importan de `features/` ni de `stores/`
- son puros: reciben props, renderizan UI
- usan los tokens de diseño del CSS (colores, tipografia, radius del mockup)

### 9. Antipatrones

Se consideran antipatrones:

- importar `authService` o `useSessionStore` directo desde un componente de pagina (usar el custom hook)
- hacer `fetch` o `axios.post` desde un componente de pagina
- crear un store para datos que solo usa una pantalla
- poner logica de negocio en componentes de UI
- hardcodear texto visible sin i18n
- crear rutas separadas para "B2B" y "B2C"
- guardar el access token en localStorage
- mostrar mensajes de error del backend sin parsear
- crear un formulario sin schema Zod
- leer todo el store sin selector (`useSessionStore()` sin arrow function)
- usar `React.memo`, `useMemo` o `useCallback` manualmente (React 19 Compiler lo hace)
- usar `useContext()` en vez de `use()` (React 19)
- usar `&&` para conditional rendering (usar ternario)
- crear componentes con props booleanos tipo `<Button primary={true}>` (usar variantes explicitas)
- formularios con placeholder como unico label (siempre label visible)
- elementos interactivos sin focus ring visible
- ignorar `prefers-reduced-motion` en animaciones
- componentes de mas de 20 lineas de JSX sin extraer
- barrel imports (`index.ts` que re-exporta todo) en carpetas grandes

### 10. Checklist

Antes de aprobar un cambio:

#### Funcionalidad
- todo formulario tiene schema Zod con mensajes i18n?
- toda feature tiene custom hook con useMutation/useQuery?
- el hook actualiza el store, no el componente?
- los errores del backend se parsean con `parseApiError`?
- errores de validacion se mapean a campos del form?
- rutas protegidas pasan por `ProtectedRoute`?

#### Calidad de codigo
- no hay texto visible hardcodeado?
- selectores de store son especificos (no leer todo)?
- componentes < 20 lineas de JSX?
- no hay `React.memo`, `useMemo` ni `useCallback` manual?
- condicionales con ternario, no con `&&`?

#### Accesibilidad
- labels visibles en formularios (no solo placeholder)?
- focus rings visibles en elementos interactivos?
- touch targets minimo 44x44px?
- contraste texto/fondo >= 4.5:1?
- animaciones respetan `prefers-reduced-motion`?
- botones con solo icono tienen `aria-label`?

#### Build
- `npm run build` pasa?
- `npm run lint` pasa?
- la UI sigue los tokens del mockup?

## Antes de codear

1. Leer el prompt de implementacion correspondiente en `docs/implementacion/slice-01-auth-identidad/`.
2. Releer los docs normativos web del backend.
3. Abrir el mockup HTML si la tarea toca UI.
4. Si falta un contrato backend, dejar el hueco visible y no inventarlo.

## Despues de codear

Verificar siempre:

- `npm run build`
- `npm run lint`
- que no haya texto visible fuera de i18n
- que no haya `fetch` o `axios` ad hoc en pantallas
- que `esMicroOrg` sea la unica base para derivar contexto personal/empresa
- que la UI siga los tokens de `docs/mockups/`

## Evidencia obligatoria de lectura

Antes de implementar cualquier cambio, el agente DEBE crear un artefacto `pre-implementacion.md` con:

1. **Archivos normativos leidos** — nombre del archivo + cantidad de lineas (como evidencia de lectura real)
2. **Skills consultados** — nombre del skill + motivo de consulta
3. **Backend duenio** de cada pantalla involucrada en el cambio
4. **Restricciones arquitectonicas** que aplican al cambio especifico
5. **Huecos documentales** encontrados (contratos no cerrados, ambiguedades, etc.)

Si el agente no puede producir este artefacto, el cambio se rechaza.

## Skills disponibles y mapeo por tipo de tarea

Skills instalados en el entorno. El agente DEBE consultar los skills relevantes antes de implementar.

| Tipo de tarea | Skills obligatorios |
|---------------|--------------------|
| Crear componente React / formulario | `frontend-design`, `react-best-practices` |
| Accesibilidad y auditoria visual | `web-design-guidelines`, `frontend-design` |
| Refactoring | `solid`, `react-best-practices` |
| Review de codigo | `code-review`, `react-best-practices` |
| Arquitectura y contratos | `architecture-patterns`, `solid` |
| Planificacion de tareas | `writing-plans` o `implementation-planner` |
| Cierre y verificacion | `verification-before-completion` |

Skills equivalentes para nombres comunes:

| Nombre comun | Skill real instalado |
|-------------|---------------------|
| `react-best-practices` | `react-best-practices` |
| `solid` | `solid` |
| `verification-before-completion` | `verification-before-completion` |
| `architecture-patterns` | `architecture-patterns` |
| `frontend-design` | `frontend-design` |
