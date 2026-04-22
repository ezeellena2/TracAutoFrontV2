# Pre-implementación — Setup inicial de Storybook + Chromatic

## Archivos normativos leídos
- `CLAUDE.md` (TracAutoFrontV2) — 498 líneas — reglas de React 19, variantes explícitas, accesibilidad, shared/ui
- `package.json` (TracAutoFrontV2) — 47 líneas — stack actual: Vite 8, React 19.2, Tailwind 4
- `src/index.css` (TracAutoFrontV2) — 295 líneas — tokens de marca ya copiados desde mockups
- `src/shared/ui/Button.tsx`, `Alert.tsx`, `Input.tsx` — componentes base ya existentes
- `src/shared/i18n/index.ts` — 53 líneas — bootstrap i18next

## Skills consultados
- Ninguno — el setup de Storybook + Chromatic no toca lógica de negocio ni contratos backend; es configuración de herramental de DevX.

## Backend dueño
- N/A. Storybook es herramienta de desarrollo frontend puro; no consume endpoints.

## Restricciones arquitectónicas que aplican
- Componentes de `shared/ui/` deben ser puros (no importar de `features/` ni `stores/`) — OK, las stories sólo documentan los componentes existentes.
- i18n obligatorio — el preview de Storybook importa `src/shared/i18n` para que componentes con `useTranslation()` rendericen.
- Tema `data-theme="dark" | "light"` — se expone como toggle en la toolbar vía `@storybook/addon-themes`.
- Accesibilidad contraste 4.5:1 — auditado automáticamente por `@storybook/addon-a11y`.

## Huecos documentales
- **Token de Chromatic**: el del screenshot quedó expuesto públicamente. Debe regenerarse antes de publicar por primera vez.
- **CI**: el CLAUDE.md no define si Chromatic debe correrse en GitHub Actions. Queda como decisión pendiente del equipo.
- **Scope de cobertura visual**: qué componentes son obligatorios en Storybook antes de merge. Por ahora se cubre `shared/ui/` completo como baseline.
