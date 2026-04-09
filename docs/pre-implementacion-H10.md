# Pre-implementacion H-10: Error Boundaries en frontend

## Archivos normativos leidos

| Archivo | Lineas |
|---------|--------|
| `docs/auditoria/H-10-sin-error-boundaries-frontend.md` (TracAutoV2) | 93 |
| `TracAutoFrontV2/CLAUDE.md` | ~280 |
| `TracAutoV2/CLAUDE.md` | ~200 |
| `src/app/routing/AppRouter.tsx` | 87 |
| `src/app/App.tsx` | 10 |
| `src/shared/ui/Alert.tsx` | 27 |
| `src/shared/ui/Button.tsx` | 43 |
| `src/shared/errors/parse-api-error.ts` | 320 (explorado via agente) |
| `src/shared/i18n/locales/es-AR/common.json` | 590 |
| `src/shared/i18n/locales/en/common.json` | 565 |
| `src/app/shells/AppShell.tsx` | explorado via agente |
| `src/app/shells/AuthShell.tsx` | explorado via agente |

## Skills consultados

| Skill | Motivo |
|-------|--------|
| `clean-code` | Pendiente — aplicar principios de codigo limpio al componente |

## Backend dueno

- No aplica directamente — este cambio es puramente frontend (capa `shared/errors/`)
- Las zonas protegidas por ErrorBoundary corresponden a: Access (auth) y Shell/Modulos (app)

## Restricciones arquitectonicas que aplican

- `shared/` no importa de `features/`, `stores/`, ni `services/`
- Todo texto visible debe pasar por i18n
- Componentes < 20 lineas de JSX; si crece, extraer
- No usar `React.memo`, `useMemo`, `useCallback` (React 19 Compiler)
- Accesibilidad: contraste 4.5:1, touch targets 44px, focus rings visibles
- No usar librerias externas (react-error-boundary) — implementar manualmente
- Error boundaries por feature/seccion, no uno global (regla explicita en CLAUDE.md)
- Usar Lucide icons (no emojis)
- Respetar tema dark/light via CSS variables existentes

## Huecos documentales

- Ninguno relevante para este cambio. El hallazgo H-10 esta bien documentado y la tarea es autocontenida.
