import { expect, type Page } from '@playwright/test'
import type { UserAudit, VerificationArtifact } from './db'
import { getUserAudit, getVerificationArtifact } from './db'

export interface RegistrationIdentity {
  email: string
  password: string
  nombre: string
  apellido: string
  numeroDocumento: string
}

export interface CompanyRegistrationIdentity extends RegistrationIdentity {
  telefono: string
  empresaNombre: string
  empresaCuit: string
  empresaRubro: string
  moduloNombre: string
}

export function createB2CIdentity(seed: string): RegistrationIdentity {
  return {
    email: `pw-b2c-${seed}@example.com`,
    password: 'Playwright1A',
    nombre: 'Play',
    apellido: `B2C${seed.slice(-4)}`,
    numeroDocumento: buildNumericValue(seed, 8),
  }
}

export function createB2BIdentity(seed: string): CompanyRegistrationIdentity {
  return {
    email: `pw-b2b-${seed}@example.com`,
    password: 'Playwright1A',
    nombre: 'Play',
    apellido: `B2B${seed.slice(-4)}`,
    telefono: '1122334455',
    numeroDocumento: buildNumericValue(`1${seed}`, 8),
    empresaNombre: `Playwright Motors ${seed.slice(-4)}`,
    empresaCuit: buildNumericValue(`30${seed}`, 11),
    empresaRubro: 'transporte',
    moduloNombre: 'Flota',
  }
}

export async function completeEmailVerification(
  page: Page,
  email: string,
): Promise<VerificationArtifact> {
  const artifact = await waitForVerificationArtifact(email)

  await page.getByLabel('Codigo de verificacion').fill(artifact.verificationCode)
  await page.getByRole('button', { name: /Verificar/i }).click()

  return artifact
}

export async function registerB2C(page: Page, identity: RegistrationIdentity): Promise<void> {
  await page.goto('/auth/registro')

  await page.getByLabel('Email').fill(identity.email)
  await page.getByRole('button', { name: 'Continuar' }).click()

  await page.getByLabel('Numero de documento').fill(identity.numeroDocumento)
  await page.getByRole('button', { name: 'Continuar' }).click()

  await page.locator('input[name="password"]').fill(identity.password)
  await page.locator('input[name="confirmPassword"]').fill(identity.password)
  await page.getByRole('button', { name: 'Continuar' }).click()

  await page.getByLabel('Nombre').fill(identity.nombre)
  await page.getByLabel('Apellido').fill(identity.apellido)
  await page.getByRole('button', { name: /Enviar codigo de verificacion/i }).click()

  await expect(page).toHaveURL(/\/auth\/verificar-email-registro\?ticket=/)
}

export async function registerB2B(page: Page, identity: CompanyRegistrationIdentity): Promise<void> {
  await page.goto('/auth/registro-empresa')

  await page.getByLabel('Nombre').fill(identity.nombre)
  await page.getByLabel('Apellido').fill(identity.apellido)
  await page.getByLabel('Email').fill(identity.email)
  await page.getByLabel('Telefono').fill(identity.telefono)
  await page.getByLabel('Numero de documento').fill(identity.numeroDocumento)
  await page.getByRole('button', { name: 'Continuar' }).click()

  await page.locator('input[name="password"]').fill(identity.password)
  await page.locator('input[name="confirmPassword"]').fill(identity.password)
  await page.getByRole('button', { name: 'Continuar' }).click()

  await page.getByLabel('Nombre de la empresa').fill(identity.empresaNombre)
  await page.getByLabel('CUIT de la empresa').fill(identity.empresaCuit)
  await page.getByLabel('Rubro').selectOption(identity.empresaRubro)
  await page.getByRole('button', { name: 'Continuar' }).click()

  await page.getByRole('button', { name: new RegExp(identity.moduloNombre, 'i') }).click()
  await page.getByRole('button', { name: /Enviar codigo de verificacion/i }).click()

  await expect(page).toHaveURL(/\/auth\/verificar-email-registro\?ticket=/)
}

export async function loginWithPassword(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  await page.goto('/auth/login')
  await page.getByLabel('Email').fill(email)
  await page.locator('input[name="password"]').fill(password)
  await page.getByRole('button', { name: 'Iniciar sesion' }).click()
}

export async function logout(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Cerrar sesion' }).click()
  await expect(page).toHaveURL(/\/auth\/login$/)
}

export async function waitForVerificationArtifact(email: string): Promise<VerificationArtifact> {
  await expect
    .poll(async () => {
      const artifact = await getVerificationArtifact(email)
      if (!artifact) {
        return null
      }

      return artifact.verificationCode ? artifact : null
    }, {
      timeout: 45_000,
      intervals: [500, 1_000, 2_000],
      message: `Esperaba el artefacto de verificacion por email para ${email}`,
    })
    .not.toBeNull()

  const artifact = await getVerificationArtifact(email)
  if (!artifact) {
    throw new Error(`No se encontro el artefacto de verificacion para ${email}.`)
  }

  return artifact
}

export async function waitForUserAudit(email: string): Promise<UserAudit> {
  await expect
    .poll(async () => getUserAudit(email), {
      timeout: 20_000,
      intervals: [500, 1_000, 2_000],
      message: `Esperaba auditoria de usuario para ${email}`,
    })
    .not.toBeNull()

  const audit = await getUserAudit(email)
  if (!audit) {
    throw new Error(`No se encontro auditoria de usuario para ${email}.`)
  }

  return audit
}

function buildNumericValue(seed: string, length: number): string {
  const digits = seed.replace(/\D/g, '')
  const padded = `${digits}${Date.now()}`.slice(-length)
  return padded.padStart(length, '1')
}
