import { Controller, useWatch, type FieldError, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Campo } from '@/shared/ui/Campo'
import { Input } from '@/shared/ui/Input'
import { CampoSelectCatalogo } from './CampoSelectCatalogo'
import { useCatalogoMarcas } from '../../hooks/useCatalogoMarcas'
import { useCatalogoModelos } from '../../hooks/useCatalogoModelos'
import type { CrearVehiculoFormulario } from '../../schemas/crear-vehiculo'

/**
 * Marca + Modelo del paso 1 — la CASCADA del catálogo canónico.
 *
 * Van juntos porque están acoplados: los modelos son DE una marca, así que cambiar la marca invalida
 * el modelo elegido. Separarlos obligaría a coordinar ese reseteo desde afuera.
 *
 * ── Lo que este componente resuelve, y es la parte no obvia ────────────────────────────────────
 *
 * Se mandan DOS COSAS por campo: el **id** del catálogo (`modeloId`, el ancla intermedia) y el
 * **texto** (`marca`/`modelo`). No es redundancia: el Canónico guarda el id para decidir y el texto
 * para mostrar, y el texto es lo único que sobrevive cuando el catálogo no cubre el vehículo.
 *
 * **Los DOS degradan a texto libre a propósito.** Si el catálogo no cubre el vehículo —marca sin
 * cargar, o marca elegida sin modelos— se muestra un input de texto en vez de un select vacío que
 * trabaría el alta. Un vehículo real que el catálogo todavía no tiene DEBE poder cargarse: la
 * identidad por texto libre es un estado válido del modelo canónico, no un error, y el propio schema
 * lo dice al no exigir `marcaId`/`modeloId`. Lo que NO se hace es inventar opciones: si el catálogo
 * está vacío, se dice.
 *
 * ⚠️ **La marca NO tenía este fallback y eso bloqueaba el alta entera** (corregido el 2026-08-22).
 * `marca` es requerida en el schema y su texto se escribía únicamente dentro del `onCambio` del
 * select — que con cero opciones **no puede dispararse nunca**. Con el catálogo vacío el formulario
 * no validaba y el wizard no se podía completar, sin ningún mensaje que explicara por qué. La
 * asimetría estaba en este mismo archivo: `modelo` degradaba y `marca` no.
 *
 * Flota llega hasta acá y no sigue: los pasos 3 (año) y 4 (versión/trim) de la cascada NO se piden.
 * Nadie en una flota conoce el trim exacto de sus unidades, y exigirlo sería pedir un dato que el
 * usuario no tiene. Ver `04-catalogo-vehiculos.md` §"El ancla intermedia".
 */
export function CampoMarcaYModelo({
  form,
  mensajeDe,
}: {
  form: UseFormReturn<CrearVehiculoFormulario>
  mensajeDe: (error: FieldError | undefined) => string | undefined
}) {
  const { t } = useTranslation(['flota', 'common'])
  const marcas = useCatalogoMarcas()

  // `useWatch` y no `watch()`: devuelve el VALOR, no una función — que es lo que el compilador de
  // React no puede memorizar sin arriesgar UI vieja (regla del repo).
  const marcaId = useWatch({ control: form.control, name: 'marcaId' })
  const modelos = useCatalogoModelos(marcaId)

  const opcionesMarca = marcas.data?.items ?? []
  // Mismo criterio que abajo para modelo: sin opciones, la única salida honesta es el texto libre.
  const hayMarcasEnCatalogo = opcionesMarca.length > 0

  const opcionesModelo = modelos.data?.items ?? []
  // Sin marca elegida no hay a quién pedirle modelos; con marca pero sin modelos en el catálogo, la
  // única salida honesta es el texto libre. Los dos casos caen al input, con ayudas distintas.
  const hayModelosEnCatalogo = marcaId.length > 0 && opcionesModelo.length > 0

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {hayMarcasEnCatalogo ? (
        <Controller
          control={form.control}
          name="marcaId"
          render={({ field, fieldState }) => (
            <CampoSelectCatalogo
              etiqueta={t('flota:onboarding.campos.marca')}
              opciones={opcionesMarca.map((marca) => ({
                valor: marca.id,
                etiqueta: marca.nombre,
              }))}
              valor={field.value}
              onCambio={(valor) => {
                field.onChange(valor)
                // El TEXTO se guarda aparte: es lo que viaja al backend y lo que queda si mañana el
                // catálogo cambia. Se resuelve del listado que ya está en mano, sin pedir nada.
                const elegida = opcionesMarca.find((marca) => marca.id === valor)
                form.setValue('marca', elegida?.nombre ?? '', { shouldValidate: true })
                // Cambiar de marca invalida el modelo: los modelos son DE una marca. Dejarlo sería
                // mandar "Ford Corolla" sin que nada lo frene.
                form.setValue('modelo', '')
                form.setValue('modeloId', '')
              }}
              cargando={marcas.isPending}
              fallo={marcas.isError}
              error={mensajeDe(fieldState.error) ?? mensajeDe(form.formState.errors.marca)}
              placeholder={t('flota:onboarding.campos.marcaPlaceholder')}
              avisoVacio={t('flota:onboarding.catalogo.marcasVacias')}
            />
          )}
        />
      ) : (
        <Campo
          etiqueta={t('flota:onboarding.campos.marca')}
          requerido
          ayuda={t('flota:onboarding.catalogo.marcaTextoLibre')}
          error={mensajeDe(form.formState.errors.marca)}
        >
          {(control) => (
            <Input
              {...control}
              {...form.register('marca')}
              maxLength={50}
              invalido={form.formState.errors.marca !== undefined}
            />
          )}
        </Campo>
      )}

      {hayModelosEnCatalogo ? (
        <Controller
          control={form.control}
          name="modeloId"
          render={({ field, fieldState }) => (
            <CampoSelectCatalogo
              etiqueta={t('flota:onboarding.campos.modelo')}
              opciones={opcionesModelo.map((modelo) => ({
                valor: modelo.id,
                etiqueta: modelo.nombre,
              }))}
              valor={field.value}
              onCambio={(valor) => {
                field.onChange(valor)
                const elegido = opcionesModelo.find((modelo) => modelo.id === valor)
                form.setValue('modelo', elegido?.nombre ?? '', { shouldValidate: true })
              }}
              cargando={modelos.isPending}
              fallo={modelos.isError}
              error={mensajeDe(fieldState.error) ?? mensajeDe(form.formState.errors.modelo)}
              placeholder={t('flota:onboarding.campos.modeloPlaceholder')}
              avisoVacio={t('flota:onboarding.catalogo.modelosVacios')}
            />
          )}
        />
      ) : (
        <Campo
          etiqueta={t('flota:onboarding.campos.modelo')}
          requerido
          ayuda={
            marcaId.length > 0
              ? t('flota:onboarding.catalogo.modeloTextoLibre')
              : t('flota:onboarding.catalogo.modeloSinMarca')
          }
          error={mensajeDe(form.formState.errors.modelo)}
        >
          {(control) => (
            <Input
              {...control}
              {...form.register('modelo')}
              maxLength={50}
              invalido={form.formState.errors.modelo !== undefined}
            />
          )}
        </Campo>
      )}
    </div>
  )
}
