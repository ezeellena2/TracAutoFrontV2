# TracAutoFrontV2

Frontend React/Vite de autenticacion y shell web para TracAuto v2.

## Desarrollo

1. Copia `.env.example` a `.env.local` si queres sobreescribir los valores de desarrollo.
2. Instala dependencias con `npm install`.
3. Levanta el frontend con `npm run dev`.

Variables de entorno de desarrollo:

```env
VITE_ACCESS_API_BASE_URL=https://localhost:7201
VITE_DEFAULT_LOCALE=es-AR
VITE_GOOGLE_CLIENT_ID=644236758922-hbf6kbllem8ljmtamrhbjp1pp8r8m4ap.apps.googleusercontent.com
```

Notas:

- Si `VITE_GOOGLE_CLIENT_ID` no esta definido, el frontend usa el client ID de desarrollo alineado con `Access.Api`.
- El backend `Access.Api` debe estar disponible en `https://localhost:7201` salvo que sobreescribas `VITE_ACCESS_API_BASE_URL`.
