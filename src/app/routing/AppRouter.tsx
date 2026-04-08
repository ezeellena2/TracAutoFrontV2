import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
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
import { RegistroEmailVerificationPage } from '@/features/access/pages/RegistroEmailVerificationPage'
import { AceptarInvitacionPage } from '@/features/access/pages/AceptarInvitacionPage'
import { GoogleCompletionPage } from '@/features/access/pages/GoogleCompletionPage'
import { SolicitarRecuperacionPage } from '@/features/access/pages/SolicitarRecuperacionPage'
import { RestablecerPasswordPage } from '@/features/access/pages/RestablecerPasswordPage'

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
          <Route path="recuperar-password" element={<SolicitarRecuperacionPage />} />
          <Route path="restablecer-password" element={<RestablecerPasswordPage />} />
          <Route path="registro" element={<RegistroPage />} />
          <Route path="registro-empresa" element={<RegistroEmpresaPage />} />
          <Route path="verificar-email-registro" element={<RegistroEmailVerificationPage />} />
          <Route path="aceptar-invitacion" element={<AceptarInvitacionPage />} />
          <Route path="google/completar-registro" element={<GoogleCompletionPage />} />
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

        <Route path="/reset-password" element={<LegacyResetPasswordRedirect />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

function LegacyResetPasswordRedirect() {
  const location = useLocation()

  return <Navigate to={`/auth/restablecer-password${location.search}`} replace />
}
