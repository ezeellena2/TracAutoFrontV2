import {
  ArrowDown,
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUp,
  Ban,
  Bell,
  Blocks,
  Boxes,
  Building2,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  CircleCheck,
  ClipboardList,
  Clock,
  Cog,
  Contact,
  Copy,
  Cpu,
  CreditCard,
  Crosshair,
  Download,
  Droplets,
  Ellipsis,
  EllipsisVertical,
  ExternalLink,
  Eye,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Fingerprint,
  Funnel,
  FunnelX,
  Gavel,
  GripVertical,
  HardHat,
  IdCard,
  Inbox,
  Info,
  KeyRound,
  Landmark,
  Layers,
  Lightbulb,
  Link,
  LoaderCircle,
  Lock,
  LogOut,
  LayoutDashboard,
  Mailbox,
  Map,
  MapPin,
  MapPinOff,
  MapPinned,
  Maximize2,
  Megaphone,
  MessageSquareOff,
  Minimize2,
  Package,
  PackageCheck,
  PackageOpen,
  Palette,
  Pause,
  Pencil,
  Plane,
  Play,
  Plug,
  Plus,
  RadioTower,
  RefreshCw,
  RotateCcw,
  Route,
  Search,
  SearchX,
  Send,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Smartphone,
  Store,
  Timer,
  Trash2,
  TriangleAlert,
  Truck,
  Unlink,
  Upload,
  UserMinus,
  UserRound,
  Users,
  UsersRound,
  Warehouse,
  WifiOff,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react'

/**
 * Catálogo curado de íconos **por CONCEPTO de dominio**.
 *
 * Fuente normativa: `../TracAutoV2/docsv2/02-arquitectura/frontend/12-estandar-de-iconos.md` §4–§7.
 * **Esto es un PORT de esas cuatro tablas, no un diseño**: el glifo de cada concepto ya está
 * decidido ahí, con su porqué y su estado. Agregar una entrada acá no es una decisión local: pasa
 * por el procedimiento de §9 de ese documento.
 *
 * ── POR QUÉ ESTE ARCHIVO ES EL ÚNICO QUE IMPORTA LUCIDE (R-IC-2) ──────────────────────────────
 * El nombre de la librería es un detalle de implementación que cambia solo: `AlertTriangle` pasó a
 * `TriangleAlert` **dentro** de lucide, sin que ORBI hiciera nada. El concepto de dominio no
 * cambia. Indexado por concepto, migrar de librería es reescribir la columna de la derecha;
 * indexado por nombre, es reescribir 126 archivos.
 *
 * ── POR QUÉ UN MAPA CURADO Y NO `nombre: string` SOBRE LAS ~1500 ──────────────────────────────
 * Con un índice dinámico el bundler no puede hacer tree-shaking y entra la librería entera; y
 * `nombre` deja de ser verificable, que es el problema de hoy con otra sintaxis. Con este mapa,
 * `NombreDeIcono` sale de `keyof typeof ICONOS` y **el compilador rechaza un concepto que no
 * está**.
 *
 * ── LO QUE NO ESTÁ ACÁ, Y ES A PROPÓSITO ──────────────────────────────────────────────────────
 * - **`activo` / `inactivo` y `en_linea` / `desconectado` / `sin_dato` no tienen ícono.** Son
 *   `Badge` con `punto`, y su porqué está en el docblock de `Badge.tsx`: daltonismo, y que una
 *   captura en blanco y negro siga siendo legible. Darles un glifo sería empeorarlos.
 * - **El vacío `sin-datos` usa el ícono de la ENTIDAD que falta**, no un glifo genérico de vacío.
 *   Por eso no hay clave `sin-datos`: se pasa `vehiculo`, `conductores`, `dispositivo`…
 * - **`activo urbano` (Municipal) no es una fila**: el ícono sale por TIPO, de la tabla de catálogo
 *   `tipos_activo_municipal` en la base, como cualquier catálogo de negocio (ley 3 de `orbi-core`).
 * - **`OctagonX` no entra**: §6 lo elimina y unifica el error del toast con `TriangleAlert`. Hoy
 *   `base/sonner.tsx` todavía lo usa; migrarlo es parte de la deuda declarada, no de este archivo.
 */
export const ICONOS = {
  // ══ ENTIDADES (§4) ══════════════════════════════════════════════════════════════════════════
  vehiculo: Car,
  /** El subtipo pesado. Comparte glifo con el módulo Flota a propósito (§4 + §7). */
  'vehiculo-pesado': Truck,
  conductor: UserRound,
  /** El plural es el MISMO glifo en versión múltiple, nunca un glifo distinto. */
  conductores: UsersRound,
  /** Glifo cuadrado = usuario de SISTEMA. El redondeado es persona del dominio. */
  usuario: Users,
  /** Un rastreador NO es un teléfono: si `Smartphone` se gasta acá, Movilidad se queda sin glifo. */
  dispositivo: Cpu,
  telefono: Smartphone,
  senal: RadioTower,
  /** Pin CON marco = zona delimitada. `zona municipal` es este mismo concepto (§4, por reuso). */
  geozona: MapPinned,
  /** Pin pelado = un punto. */
  ubicacion: MapPin,
  /** `recorrido` de Municipal es este mismo concepto: no se abre fila nueva (§4). */
  recorrido: Route,
  mapa: Map,
  organizacion: Building2,
  sucursal: Store,
  reclamo: Megaphone,
  /** La MISMA fila para Taller y Municipal: una OT es una OT (R-IC-1). */
  'orden-trabajo': ClipboardList,
  /** Agrupación funcional (alumbrado, recolección), no un lugar. Área ≠ zona. */
  'area-servicio': Layers,
  /** Unidad despachable de campo, no una lista de personas. */
  cuadrilla: HardHat,
  paquete: Package,
  /** Persona con ficha comercial: se distingue de `conductor` a propósito. */
  cliente: Contact,
  problema: TriangleAlert,
  regla: SlidersHorizontal,
  integracion: Plug,
  documento: FileText,
  planilla: FileSpreadsheet,
  rol: KeyRound,
  modulo: Blocks,
  facturacion: CreditCard,
  notificacion: Bell,
  identificador: Fingerprint,
  /**
   * ⚠️ La columna "Ícono" de esta fila en §4 dice `ShieldCheck` y su columna "Estado" dice
   * *"`ShieldCheck` queda para seguridad; licencia pasa a `IdCard`"*. **La fila se contradice.**
   * Se porta `IdCard`, que es el veredicto: dejar `ShieldCheck` haría que dos conceptos
   * compartieran glifo en el MISMO menú de acciones, que es el defecto que la fila reporta.
   * Drift reportado en F-04a. PENDIENTE de ratificación por `DA-FE-04`.
   */
  licencia: IdCard,
  seguridad: ShieldCheck,
  apariencia: Palette,

  // ══ ACCIONES (§5) ═══════════════════════════════════════════════════════════════════════════
  // Regla de §5.1: una acción SOBRE una entidad usa el ícono de la ENTIDAD; el verbo lo pone el
  // texto. Por eso no hay `asignar`: se usa `vehiculo`, `dispositivo`, `conductor`.
  crear: Plus,
  editar: Pencil,
  eliminar: Trash2,
  'ver-detalle': Eye,
  'quitar-persona': UserMinus,
  vincular: Link,
  desvincular: Unlink,
  exportar: Download,
  importar: Upload,
  /** `Filter` NO existe en lucide 1.7: es alias de `Funnel` (R-IC-3). */
  filtrar: Funnel,
  /** ACCIÓN de limpiar filtros. El ESTADO "sin resultados" es `sin-resultados` (`SearchX`). */
  'limpiar-filtros': FunnelX,
  buscar: Search,
  /** Volver a pedir lo mismo. Distinto de `revertir`, que deshace un estado. */
  reintentar: RefreshCw,
  revertir: RotateCcw,
  'mas-acciones': EllipsisVertical,
  'mas-acciones-horizontal': Ellipsis,
  copiar: Copy,
  enviar: Send,
  pausar: Pause,
  reanudar: Play,
  cerrar: X,
  volver: ArrowLeft,
  'ir-a': ArrowRight,
  'abrir-afuera': ExternalLink,
  colapsar: ChevronLeft,
  expandir: ChevronRight,
  'ordenar-ascendente': ArrowUp,
  'ordenar-descendente': ArrowDown,
  /** Ordenable, sin orden aplicado. También es el glifo universal de combobox. */
  ordenable: ChevronsUpDown,
  'cambiar-contexto': ArrowLeftRight,
  'cerrar-sesion': LogOut,
  arrastrar: GripVertical,
  'centrar-mapa': Crosshair,
  'pantalla-completa': Maximize2,
  'salir-pantalla-completa': Minimize2,

  // ══ ESTADOS (§6) ════════════════════════════════════════════════════════════════════════════
  // R-IC-5: el ícono NUNCA fija su color. Por eso `error` y `advertencia` comparten glifo y se
  // distinguen por el token de color del contenedor: mismo dibujo, cero componentes nuevos.
  error: TriangleAlert,
  advertencia: TriangleAlert,
  /** El del toast. Las 5 pantallas de acceso usan `CircleCheckBig`, que es OTRO dibujo, y migran. */
  exito: CircleCheck,
  /** Tilde pelado = "este ítem está tildado". `exito` = "la operación terminó bien". */
  'paso-completado': Check,
  informacion: Info,
  sugerencia: Lightbulb,
  cargando: LoaderCircle,
  bloqueado: Lock,
  /** Mismo concepto que `bloqueado` ("no podés tocar esto"), mismo glifo: correcto. */
  'campo-no-editable': Lock,
  'sin-resultados': SearchX,
  'bandeja-vacia': Inbox,
  /** "La fuente no respondió". Distinto de `desconectado`, que es un `Badge` sin ícono. */
  'sin-conexion': WifiOff,
  'sin-ubicacion': MapPinOff,
  'sin-mensajes': MessageSquareOff,
  'en-stock': PackageCheck,
  'fuera-de-stock': PackageOpen,
  pendiente: Clock,
  /** Reservado para DURACIÓN, para que no se lo coma `pendiente`. */
  duracion: Timer,
  'documento-vencido': ShieldAlert,
  prohibido: Ban,

  // ══ NAVEGACIÓN · un ícono por MÓDULO (§7) ═══════════════════════════════════════════════════
  // R-IC-9: el ícono de un módulo ≠ el de su entidad principal. Por eso Flota es `Truck` y no
  // `Car` — hoy `registro.ts` usa `Car` y viola la regla.
  'modulo-flota': Truck,
  'modulo-concesionaria': Store,
  'modulo-marketplace': ShoppingCart,
  'modulo-taller': Wrench,
  'modulo-carwash': Droplets,
  /** Reparto de mercadería propia, no telemetría: por eso NO comparte `Truck` con Flota. */
  'modulo-logistica': Warehouse,
  /** El 📮 del mockup mapea a `inbox`, que ya es `bandeja-vacia`. */
  'modulo-paqueteria': Mailbox,
  'modulo-turismo': Plane,
  /** El módulo es trámites; `ClipboardList` queda para la orden de trabajo. */
  'modulo-gestoria': FileCheck,
  'modulo-municipal': Landmark,
  'modulo-compras': Gavel,
  /** Mismo ⚙️ que Configuración en el mockup; se separan acá. */
  'modulo-operaciones': Boxes,
  'modulo-configuracion': Cog,
  /** No es un módulo, pero vive en el mismo sidebar. */
  dashboard: LayoutDashboard,
} as const satisfies Record<string, LucideIcon>

/** Todo concepto que el catálogo conoce. Un valor fuera de esta unión no compila. */
export type NombreDeIcono = keyof typeof ICONOS

/**
 * El componente de un concepto, con la puerta cerrada en runtime.
 *
 * En código escrito a mano el compilador ya rechaza un concepto inexistente. Esta función existe
 * para el caso que el compilador NO ve: una clave que llega de un dato —el `tipo` de una fila, el
 * `code` de un error, un `vocabulario-*.ts`—. Ahí el default silencioso sería lo peor posible:
 * un ícono que no significa nada, mostrado con total confianza y sin que nadie se entere.
 */
export function iconoDe(nombre: NombreDeIcono): LucideIcon {
  const componente = ICONOS[nombre]

  if (componente === undefined) {
    throw new Error(
      `No hay ícono para el concepto "${nombre}". El catálogo se pide por concepto y no tiene ` +
        'default: un glifo equivocado enseña que dos cosas distintas son la misma. Los conceptos ' +
        'están en 12-estandar-de-iconos.md §4-§7; para agregar uno, §9.',
    )
  }

  return componente
}
