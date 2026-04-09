import fs from 'node:fs'
import path from 'node:path'
import { Pool, type PoolConfig } from 'pg'

const poolConfig = resolvePoolConfig()

const pool = new Pool({
  ...poolConfig,
})

function resolvePoolConfig(): PoolConfig {
  const explicitConnectionString = process.env.E2E_DB_CONNECTION_STRING?.trim() ?? null
  const rawConnectionString = explicitConnectionString ?? resolveAccessDbConnectionString()

  if (rawConnectionString.includes('://')) {
    return { connectionString: rawConnectionString }
  }

  const entries = rawConnectionString
    .split(';')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => {
      const separatorIndex = segment.indexOf('=')
      const key = separatorIndex >= 0 ? segment.slice(0, separatorIndex).trim().toLowerCase() : segment.trim().toLowerCase()
      const value = separatorIndex >= 0 ? segment.slice(separatorIndex + 1).trim() : ''
      return [key, value] as const
    })

  const configMap = new Map(entries)

  return {
    host: configMap.get('host'),
    port: parseOptionalInt(configMap.get('port')),
    database: configMap.get('database'),
    user: configMap.get('username') ?? configMap.get('user id') ?? configMap.get('user'),
    password: configMap.get('password'),
  }
}

function resolveAccessDbConnectionString(): string {
  const candidateConfigPaths = [
    path.resolve(process.cwd(), '../TracAutoV2/src/Access/Access.Api/appsettings.Development.json'),
    path.resolve(process.cwd(), '../TracAutoV2/src/Access/Access.Api/appsettings.json'),
  ]

  for (const candidatePath of candidateConfigPaths) {
    if (!fs.existsSync(candidatePath)) {
      continue
    }

    const rawJson = fs.readFileSync(candidatePath, 'utf-8')
    const parsed = JSON.parse(rawJson) as {
      ConnectionStrings?: {
        AccessDb?: string
      }
    }

    const accessDbConnectionString = parsed.ConnectionStrings?.AccessDb?.trim()
    if (accessDbConnectionString) {
      return accessDbConnectionString
    }
  }

  throw new Error(
    'No se pudo resolver la connection string para E2E. Configura E2E_DB_CONNECTION_STRING o defini AccessDb en Access.Api/appsettings.Development.json.',
  )
}

function parseOptionalInt(value: string | undefined): number | undefined {
  if (!value) {
    return undefined
  }

  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? undefined : parsed
}

export interface VerificationArtifact {
  eventId: string
  verificationCode: string
  outboxProcessedAt: string | null
  outboxAttempts: number
  notificationId: string | null
  notificationState: string | null
  notificationTemplate: string | null
  notificationChannel: string | null
  notificationDeliveredAt: string | null
}

export interface UserAudit {
  usuarioId: string | null
  personaId: string | null
  email: string
  emailVerificado: boolean
  usuarioActivo: boolean
  ultimaOrganizacionActivaId: string | null
  ultimoLoginUtc: string | null
  pendingConsumido: boolean | null
  usuarioIdReservado: string | null
  personaIdCanonica: string | null
  organizacionIdCanonica: string | null
  personalAccessCount: number
  companyAccessCount: number
  activeAccessCount: number
  latestRefreshRevocado: boolean | null
  latestRefreshExpiraEnUtc: string | null
  latestRefreshSessionId: string | null
}

export async function getVerificationArtifact(
  email: string,
): Promise<VerificationArtifact | null> {
  const result = await pool.query<VerificationArtifact>(
    `
      SELECT
        (iom.payload::jsonb ->> 'EventId') AS "eventId",
        iom.payload::jsonb ->> 'Codigo' AS "verificationCode",
        iom.procesado_en_utc::text AS "outboxProcessedAt",
        iom.intentos AS "outboxAttempts",
        n.id::text AS "notificationId",
        n.estado AS "notificationState",
        n.codigo_template AS "notificationTemplate",
        n.canal AS "notificationChannel",
        n.fecha_entrega_utc::text AS "notificationDeliveredAt"
      FROM access.integration_outbox_messages iom
      LEFT JOIN notificaciones.notificaciones n
        ON n.event_id = ((iom.payload::jsonb ->> 'EventId')::uuid)
      WHERE iom.tipo ILIKE '%RegistroEmailVerificacionSolicitadaEvent%'
        AND lower(iom.payload::jsonb ->> 'Email') = lower($1)
      ORDER BY iom.fecha_creacion DESC
      LIMIT 1
    `,
    [email],
  )

  return result.rows[0] ?? null
}

export async function getUserAudit(email: string): Promise<UserAudit | null> {
  const result = await pool.query<UserAudit>(
    `
      WITH latest_pending AS (
        SELECT DISTINCT ON (rep.email_normalizado)
          rep.email_normalizado,
          rep.consumido,
          rep.usuario_id_reservado,
          rep.persona_id_canonica,
          rep.organizacion_id_canonica
        FROM access.registros_email_pendientes rep
        WHERE lower(rep.email_normalizado) = lower($1)
        ORDER BY rep.email_normalizado, rep.fecha_creacion DESC
      ),
      latest_refresh AS (
        SELECT DISTINCT ON (rt.usuario_id)
          rt.usuario_id,
          rt.revocado,
          rt.expira_en_utc,
          rt.session_id
        FROM access.refresh_tokens rt
        JOIN access.usuarios u ON u.id = rt.usuario_id
        WHERE lower(u.email) = lower($1)
        ORDER BY rt.usuario_id, rt.fecha_creacion DESC
      ),
      access_counts AS (
        SELECT
          uo.usuario_id,
          COUNT(*) FILTER (WHERE uo.activo = true) AS active_access_count,
          COUNT(*) FILTER (
            WHERE uo.activo = true
              AND o.tipo_organizacion = 'persona_fisica'
          ) AS personal_access_count,
          COUNT(*) FILTER (
            WHERE uo.activo = true
              AND o.tipo_organizacion = 'empresa'
          ) AS company_access_count
        FROM plataforma_canonica.usuarios_organizacion uo
        JOIN plataforma_canonica.organizaciones o
          ON o.id = uo.organizacion_id
        GROUP BY uo.usuario_id
      )
      SELECT
        u.id::text AS "usuarioId",
        u.persona_id::text AS "personaId",
        u.email AS "email",
        u.email_verificado AS "emailVerificado",
        u.activo AS "usuarioActivo",
        u.ultima_organizacion_activa_id::text AS "ultimaOrganizacionActivaId",
        u.ultimo_login_utc::text AS "ultimoLoginUtc",
        lp.consumido AS "pendingConsumido",
        lp.usuario_id_reservado::text AS "usuarioIdReservado",
        lp.persona_id_canonica::text AS "personaIdCanonica",
        lp.organizacion_id_canonica::text AS "organizacionIdCanonica",
        COALESCE(ac.personal_access_count, 0)::int AS "personalAccessCount",
        COALESCE(ac.company_access_count, 0)::int AS "companyAccessCount",
        COALESCE(ac.active_access_count, 0)::int AS "activeAccessCount",
        lr.revocado AS "latestRefreshRevocado",
        lr.expira_en_utc::text AS "latestRefreshExpiraEnUtc",
        lr.session_id::text AS "latestRefreshSessionId"
      FROM access.usuarios u
      LEFT JOIN latest_pending lp
        ON lower(lp.email_normalizado) = lower(u.email)
      LEFT JOIN access_counts ac
        ON ac.usuario_id = u.id
      LEFT JOIN latest_refresh lr
        ON lr.usuario_id = u.id
      WHERE lower(u.email) = lower($1)
      LIMIT 1
    `,
    [email],
  )

  return result.rows[0] ?? null
}

export async function closeDbPool(): Promise<void> {
  await pool.end()
}
