import { expect, test } from '@playwright/test'
import {
  completeEmailVerification,
  createB2BIdentity,
  createB2CIdentity,
  loginWithPassword,
  logout,
  registerB2B,
  registerB2C,
  waitForUserAudit,
} from './support/auth-helpers'
import { closeDbPool } from './support/db'

test.afterAll(async () => {
  await closeDbPool()
})

test('B2C: puede registrarse, verificar email y volver a iniciar sesion', async ({ page }) => {
  const seed = `${Date.now()}-b2c`
  const identity = createB2CIdentity(seed)

  await registerB2C(page, identity)
  const verificationArtifact = await completeEmailVerification(page, identity.email)

  await expect(page).toHaveURL(/\/app$/)
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  await expect(page.getByText('Contexto personal')).toBeVisible()

  expect(verificationArtifact.eventId).toBeTruthy()
  expect(verificationArtifact.verificationCode).toMatch(/^\d{6}$/)
  if (verificationArtifact.notificationTemplate) {
    expect(verificationArtifact.notificationTemplate).toBe('registro_email_verificacion')
  }
  if (verificationArtifact.notificationChannel) {
    expect(verificationArtifact.notificationChannel).toBe('email')
  }
  if (verificationArtifact.notificationState) {
    expect(verificationArtifact.notificationState).toBe('enviada')
  }

  const postVerificationAudit = await waitForUserAudit(identity.email)
  expect(postVerificationAudit.emailVerificado).toBeTruthy()
  expect(postVerificationAudit.usuarioActivo).toBeTruthy()
  expect(postVerificationAudit.pendingConsumido).toBeTruthy()
  expect(postVerificationAudit.usuarioIdReservado).not.toBeNull()
  expect(postVerificationAudit.personaIdCanonica).not.toBeNull()
  expect(postVerificationAudit.organizacionIdCanonica).not.toBeNull()
  expect(postVerificationAudit.personalAccessCount).toBeGreaterThanOrEqual(1)
  expect(postVerificationAudit.companyAccessCount).toBe(0)
  expect(postVerificationAudit.latestRefreshRevocado).toBeFalsy()
  expect(postVerificationAudit.latestRefreshSessionId).not.toBeNull()
  expect(postVerificationAudit.ultimaOrganizacionActivaId).not.toBeNull()

  await logout(page)
  await loginWithPassword(page, identity.email, identity.password)

  await expect(page).toHaveURL(/\/app$/)
  await expect(page.getByText('Contexto personal')).toBeVisible()

  const postLoginAudit = await waitForUserAudit(identity.email)
  expect(postLoginAudit.ultimoLoginUtc).not.toBeNull()
  expect(postLoginAudit.latestRefreshRevocado).toBeFalsy()
  expect(postLoginAudit.latestRefreshSessionId).not.toBeNull()
})

test('B2B: puede registrarse, verificar email, cambiar de contexto y volver a iniciar sesion', async ({ page }) => {
  const seed = `${Date.now()}-b2b`
  const identity = createB2BIdentity(seed)

  await registerB2B(page, identity)
  const verificationArtifact = await completeEmailVerification(page, identity.email)

  await expect(page).toHaveURL(/\/app$/)
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  await expect(page.getByText(`Contexto empresa: ${identity.empresaNombre}`)).toBeVisible()

  expect(verificationArtifact.eventId).toBeTruthy()
  expect(verificationArtifact.verificationCode).toMatch(/^\d{6}$/)
  if (verificationArtifact.notificationTemplate) {
    expect(verificationArtifact.notificationTemplate).toBe('registro_email_verificacion')
  }
  if (verificationArtifact.notificationChannel) {
    expect(verificationArtifact.notificationChannel).toBe('email')
  }
  if (verificationArtifact.notificationState) {
    expect(verificationArtifact.notificationState).toBe('enviada')
  }

  const postVerificationAudit = await waitForUserAudit(identity.email)
  expect(postVerificationAudit.emailVerificado).toBeTruthy()
  expect(postVerificationAudit.usuarioActivo).toBeTruthy()
  expect(postVerificationAudit.pendingConsumido).toBeTruthy()
  expect(postVerificationAudit.personalAccessCount).toBeGreaterThanOrEqual(1)
  expect(postVerificationAudit.companyAccessCount).toBeGreaterThanOrEqual(1)
  expect(postVerificationAudit.activeAccessCount).toBeGreaterThanOrEqual(2)
  expect(postVerificationAudit.latestRefreshRevocado).toBeFalsy()
  expect(postVerificationAudit.latestRefreshSessionId).not.toBeNull()

  await page.getByRole('link', { name: 'Cambiar organizacion' }).click()
  await expect(page).toHaveURL(/\/app\/selector$/)
  await expect(page.getByText('Tu cuenta')).toBeVisible()
  await expect(page.getByText('Organizaciones')).toBeVisible()

  await page.getByRole('button', { name: /Mi cuenta personal/i }).click()
  await expect(page).toHaveURL(/\/app$/)
  await expect(page.getByText('Contexto personal')).toBeVisible()

  await page.getByRole('link', { name: 'Cambiar organizacion' }).click()
  await page.getByRole('button', { name: new RegExp(identity.empresaNombre, 'i') }).click()
  await expect(page).toHaveURL(/\/app$/)
  await expect(page.getByText(`Contexto empresa: ${identity.empresaNombre}`)).toBeVisible()

  await logout(page)
  await loginWithPassword(page, identity.email, identity.password)

  await expect(page).toHaveURL(/\/app$/)
  await expect(page.getByText(`Contexto empresa: ${identity.empresaNombre}`)).toBeVisible()

  const postLoginAudit = await waitForUserAudit(identity.email)
  expect(postLoginAudit.ultimoLoginUtc).not.toBeNull()
  expect(postLoginAudit.latestRefreshRevocado).toBeFalsy()
  expect(postLoginAudit.latestRefreshSessionId).not.toBeNull()
})
