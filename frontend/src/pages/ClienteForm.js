import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCliente, createCliente, updateCliente } from '../api/propiedades'

export default function ClienteForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState({ id: '', nombre: '', telefono: '', email: '' })
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isEdit) {
      getCliente(id).then(data => {
        setForm({ id: data.id, nombre: data.nombre, telefono: data.telefono, email: data.email })
        setLoading(false)
      }).catch(() => setLoading(false))
    }
  }, [id, isEdit])

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (isEdit) {
        await updateCliente(id, { nombre: form.nombre, telefono: form.telefono, email: form.email })
      } else {
        await createCliente({
          id: Number(form.id),
          nombre: form.nombre,
          telefono: form.telefono,
          email: form.email
        })
      }
      navigate('/clientes')
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-xl">
        <span className="material-symbols-outlined text-secondary animate-spin text-4xl">refresh</span>
      </div>
    )
  }

  return (
    <div className="max-w-[640px] mx-auto">
      <div className="mb-xl">
        <div className="flex items-center gap-xs text-on-surface-variant mb-2">
          <span className="text-label-md font-label-md">Clientes</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-label-md font-label-md text-primary">
            {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">
          {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h1>
        <p className="text-body-md font-body-md text-on-surface-variant">
          {isEdit ? 'Actualice los datos del cliente.' : 'Registre un nuevo cliente en el sistema.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-xl p-md custom-shadow-l1 border border-outline-variant/30 space-y-md">
        <div className="flex flex-col gap-xs">
          <label className="text-label-md font-label-md text-on-surface-variant">ID (DNI)</label>
          <input
            type="number"
            value={form.id}
            onChange={e => handleChange('id', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-bright font-body-md"
            placeholder="12345678"
            disabled={isEdit}
            required
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="text-label-md font-label-md text-on-surface-variant">Nombre Completo</label>
          <input
            type="text"
            value={form.nombre}
            onChange={e => handleChange('nombre', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-bright font-body-md"
            placeholder="Juan Perez"
            required
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="text-label-md font-label-md text-on-surface-variant">Teléfono</label>
          <input
            type="text"
            value={form.telefono}
            onChange={e => handleChange('telefono', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-bright font-body-md"
            placeholder="099 123 456"
            required
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="text-label-md font-label-md text-on-surface-variant">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => handleChange('email', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-bright font-body-md"
            placeholder="juan@email.com"
            required
          />
        </div>
        <div className="flex items-center justify-between pt-md border-t border-outline-variant">
          <button
            type="button"
            onClick={() => navigate('/clientes')}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-secondary text-secondary font-headline-sm text-headline-sm hover:bg-secondary-container/20 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-white font-headline-sm text-headline-sm hover:opacity-90 shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            {submitting ? 'Guardando...' : isEdit ? 'Actualizar Cliente' : 'Crear Cliente'}
          </button>
        </div>
      </form>
    </div>
  )
}
