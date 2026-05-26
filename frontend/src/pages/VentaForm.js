import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createVenta, getClientes, getPropiedades } from '../api/propiedades'

export default function VentaForm() {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [propiedades, setPropiedades] = useState([])
  const [form, setForm] = useState({ idComprador: '', idPropiedad: '', montoTotal: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getClientes().then(setClientes).catch(() => {})
    getPropiedades({ estado: 'DISPONIBLE' }).then(setPropiedades).catch(() => {})
  }, [])

  const handlePropiedadChange = (id) => {
    const prop = propiedades.find(p => String(p.id) === id)
    setForm({
      idComprador: form.idComprador,
      idPropiedad: id,
      montoTotal: prop ? String(prop.precio) : ''
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createVenta({
        idComprador: Number(form.idComprador),
        idPropiedad: Number(form.idPropiedad),
        montoTotal: Number(form.montoTotal)
      })
      navigate('/ventas')
    } catch (err) {
      alert('Error al registrar la venta: ' + (err.response?.data?.error || err.message))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-[640px] mx-auto">
      <div className="mb-xl">
        <div className="flex items-center gap-xs text-on-surface-variant mb-2">
          <span className="text-label-md font-label-md">Ventas</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-label-md font-label-md text-primary">Registrar Venta</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Registrar Nueva Venta</h1>
        <p className="text-body-md font-body-md text-on-surface-variant">
          Seleccione el comprador y la propiedad para concretar la venta.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-xl p-md custom-shadow-l1 border border-outline-variant/30 space-y-md">
        <div className="flex flex-col gap-xs">
          <label className="text-label-md font-label-md text-on-surface-variant">Comprador</label>
          <div className="relative">
            <select
              value={form.idComprador}
              onChange={e => setForm(prev => ({ ...prev, idComprador: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-bright font-body-md appearance-none"
              required
            >
              <option value="" disabled>Seleccionar comprador</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nombre} (DNI: {c.id})</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
          </div>
        </div>

        <div className="flex flex-col gap-xs">
          <label className="text-label-md font-label-md text-on-surface-variant">Propiedad</label>
          <div className="relative">
            <select
              value={form.idPropiedad}
              onChange={e => handlePropiedadChange(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-bright font-body-md appearance-none"
              required
            >
              <option value="" disabled>Seleccionar propiedad disponible</option>
              {propiedades.map(p => (
                <option key={p.id} value={p.id}>
                  {p.direccion} - {p.zona?.nombre} - ${p.precio?.toLocaleString('es-UY')}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
          </div>
        </div>

        <div className="flex flex-col gap-xs">
          <label className="text-label-md font-label-md text-on-surface-variant">Monto Total ($)</label>
          <input
            type="number"
            value={form.montoTotal}
            onChange={e => setForm(prev => ({ ...prev, montoTotal: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-bright font-display-price text-display-price"
            placeholder="0.00"
            required
          />
          <p className="text-label-md text-on-surface-variant mt-xs">
            * Monto precargado automáticamente según el precio de la propiedad seleccionada.
          </p>
        </div>

        <div className="flex items-center justify-between pt-md border-t border-outline-variant">
          <button
            type="button"
            onClick={() => navigate('/ventas')}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-secondary text-secondary font-headline-sm text-headline-sm hover:bg-secondary-container/20 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-white font-headline-sm text-headline-sm hover:opacity-90 shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            {submitting ? 'Registrando...' : 'Confirmar Venta'}
          </button>
        </div>
      </form>
    </div>
  )
}
