import type { Meta, StoryObj } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { expect, within } from 'storybook/test'
import { CampoMarcaYModelo } from './CampoMarcaYModelo'
import { flotaKeys } from '../../query-keys'
import {
  valoresInicialesCrearVehiculo,
  type CrearVehiculoFormulario,
} from '../../schemas/crear-vehiculo'

/**
 * Marca + Modelo del alta de vehículo — **el estado que importa acá es el catálogo VACÍO**.
 *
 * Existe por un defecto real: `marca` es requerida por el schema y su texto se escribía únicamente
 * dentro del `onCambio` del select del catálogo. Con cero opciones ese `onCambio` **no puede
 * dispararse nunca**, así que el formulario no validaba y el alta quedaba trabada — sin ningún
 * mensaje que dijera por qué. `modelo` sí degradaba a texto libre; `marca` no. La asimetría vivía en
 * el mismo archivo y no había un solo test que la cubriera.
 *
 * Estas stories son esa cobertura. La primera es la que se pone roja si alguien vuelve a sacarle el
 * fallback a la marca.
 */

/** Cliente con la cache SEMBRADA: nada sale a la red, y el estado del catálogo es explícito. */
function clienteCon(marcas: { id: string; nombre: string }[]) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  })
  client.setQueryData(flotaKeys.catalogoMarcas(undefined), { items: marcas })
  return client
}

function Contenedor({ marcas }: { marcas: { id: string; nombre: string }[] }) {
  const form = useForm<CrearVehiculoFormulario>({
    defaultValues: valoresInicialesCrearVehiculo,
  })

  return (
    <QueryClientProvider client={clienteCon(marcas)}>
      <div className="w-[36rem]">
        <CampoMarcaYModelo form={form} mensajeDe={(error) => error?.message} />
      </div>
    </QueryClientProvider>
  )
}

const meta = {
  title: 'Flota/Onboarding/CampoMarcaYModelo',
  component: Contenedor,
  args: { marcas: [] },
} satisfies Meta<typeof Contenedor>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 🔴 **El caso que estaba roto.** Sin marcas en el catálogo, la marca tiene que poder escribirse a
 * mano: un vehículo real que el catálogo todavía no tiene DEBE poder cargarse. El schema ya lo
 * permite —no exige `marcaId` ni `modeloId`—, así que lo único que faltaba era la salida en la UI.
 */
export const CatalogoVacio: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Los dos campos tienen que ser ESCRIBIBLES: si alguno vuelve a ser un select vacío, no hay
    // textbox con ese nombre y esto se pone rojo.
    const marca = await canvas.findByRole('textbox', { name: /marca|make/i })
    const modelo = await canvas.findByRole('textbox', { name: /modelo|model/i })

    await expect(marca).toBeEnabled()
    await expect(modelo).toBeEnabled()
  },
}

/**
 * Con marcas cargadas vuelve el select: el texto libre es la salida cuando el catálogo no cubre el
 * vehículo, **no** el camino por defecto. Elegir del catálogo es lo que ancla `modeloId`, que es lo
 * que el Canónico usa para decidir.
 */
export const ConMarcasEnCatalogo: Story = {
  args: {
    marcas: [
      { id: '1a341845-6ee4-4079-a817-489b31f3119b', nombre: 'Ford' },
      { id: '8ab62f6d-61c8-46f2-a8c9-485f07f94b9c', nombre: 'Renault' },
      { id: '0d1c3cfe-8247-421b-be25-2fa2499ef280', nombre: 'Toyota' },
    ],
  },
}
