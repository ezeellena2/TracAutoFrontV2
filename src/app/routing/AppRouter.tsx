import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthShell } from '@/app/shells/AuthShell'
import { AppShell } from '@/app/shells/AppShell'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicOnlyRoute } from './PublicOnlyRoute'

// Pages — landing (publica)
import { LandingPage } from '@/features/landing/pages/LandingPage'

// Pages — auth (publicas)
import { LoginPage } from '@/features/access/pages/LoginPage'
import { RegistroPage } from '@/features/access/pages/RegistroPage'
import { RegistroEmpresaPage } from '@/features/access/pages/RegistroEmpresaPage'
import { AceptarInvitacionPage } from '@/features/access/pages/AceptarInvitacionPage'

// Pages — app (protegidas)
import { DashboardPage } from '@/features/shell/pages/DashboardPage'
import { ContextSelectorPage } from '@/features/context/pages/ContextSelectorPage'

/**
 * Router principal con 4 zonas:
 *
 * /              → LandingPage (publica, marketing)
 * /auth/*        → AuthShell (login, registro) — solo si NO autenticado
 * /app/*         → AppShell (protegido) — verifica sesion al entrar
 * /*             → fallback a landing
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing: pagina publica de producto */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth: pantallas publicas de acceso */}
        <Route
          path="/auth"
          element={
            <PublicOnlyRoute>
              <AuthShell />
            </PublicOnlyRoute>
          }
        >
          <Route path="login" element={<LoginPage />} />
          <Route path="registro" element={<RegistroPage />} />
          <Route path="registro-empresa" element={<RegistroEmpresaPage />} />
          <Route path="aceptar-invitacion" element={<AceptarInvitacionPage />} />
          <Route index element={<Navigate to="login" replace />} />
        </Route>

        {/* App: pantallas protegidas */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="selector" element={<ContextSelectorPage />} />
          {/* Rutas de modulos se agregan aca en slices posteriores */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
