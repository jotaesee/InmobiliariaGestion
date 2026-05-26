import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getVentas } from '../api/propiedades'

const dateFormat = { year: 'numeric', month: 'short', day: 'numeric' }

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-ES', dateFormat).replace('.', '')
}

export default function VentasLista() {
  const navigate = useNavigate()
  const [ventas, setVentas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getVentas().then(data => {
      setVentas(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-xl">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-primary">Historial de Ventas</h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-xs">
            Registro inmutable de transacciones cerradas.
          </p>
        </div>
        <button
          onClick={() => navigate('/ventas/nueva')}
          className="bg-primary hover:bg-primary-container text-on-primary font-label-md px-xl py-md rounded-lg transition-all flex items-center justify-center gap-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Registrar Nueva Venta
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-xl">
          <span className="material-symbols-outlined text-secondary animate-spin text-4xl">refresh</span>
        </div>
      ) : ventas.length === 0 ? (
        <div className="text-center py-xl text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl mb-md">receipt</span>
          <p className="font-headline-sm">No hay ventas registradas</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-md p-md bg-surface-container-low border-b border-outline-variant text-label-caps font-label-caps text-on-surface-variant hidden md:grid">
            <div className="col-span-2">Fecha</div>
            <div className="col-span-3">Comprador / ID</div>
            <div className="col-span-4">Propiedad</div>
            <div className="col-span-3 text-right">Precio de Cierre</div>
          </div>
          <div className="flex flex-col divide-y divide-outline-variant">
            {ventas.map(venta => (
              <div
                key={venta.id}
                onClick={() => navigate(`/propiedades/${venta.idPropiedad}`)}
                className="grid grid-cols-1 md:grid-cols-12 gap-sm md:gap-md p-md hover:bg-surface-bright transition-colors items-center cursor-pointer"
              >
                <div className="col-span-1 md:col-span-2 text-body-sm font-body-sm text-on-surface">
                  <span className="md:hidden text-label-caps font-label-caps text-on-surface-variant block mb-xs">Fecha:</span>
                  {formatDate(venta.fecha)}
                </div>
                <div className="col-span-1 md:col-span-3">
                  <span className="md:hidden text-label-caps font-label-caps text-on-surface-variant block mb-xs">Comprador:</span>
                  <div className="text-body-md font-body-md font-medium text-primary">{venta.Comprador?.nombre}</div>
                  <div className="text-label-md font-label-md text-on-surface-variant">ID: {venta.Comprador?.id}</div>
                </div>
                <div className="col-span-1 md:col-span-4">
                  <span className="md:hidden text-label-caps font-label-caps text-on-surface-variant block mb-xs">Propiedad:</span>
                  <div className="text-body-md font-body-md text-on-surface">{venta.propiedad?.direccion}</div>
                  <div className="text-label-md font-label-md text-on-surface-variant flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {venta.propiedad?.zona?.nombre}
                  </div>
                </div>
                <div className="col-span-1 md:col-span-3 text-left md:text-right">
                  <span className="md:hidden text-label-caps font-label-caps text-on-surface-variant block mb-xs">Precio:</span>
                  <div className="text-headline-sm font-headline-sm text-secondary">
                    ${Number(venta.montoTotal).toLocaleString('es-UY')}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-surface-container-low p-md flex justify-between items-center border-t border-outline-variant">
            <span className="text-body-sm font-body-sm text-on-surface-variant">
              Mostrando {ventas.length} {ventas.length === 1 ? 'venta' : 'ventas'}
            </span>
          </div>
        </div>
      )}
    </>
  )
}
