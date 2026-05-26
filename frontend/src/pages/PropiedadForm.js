import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createPropiedad, updatePropiedad, getPropiedad,
  getClientes, getZonas, createZona
} from '../api/propiedades'

export default function PropiedadForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const fileInputRef = useRef(null)
  const [clientes, setClientes] = useState([])
  const [zonas, setZonas] = useState([])
  const [previews, setPreviews] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  const [form, setForm] = useState({
    direccion: '',
    idVendedor: '',
    idZona: '',
    descripcion: '',
    precio: '',
    estado: 'DISPONIBLE',
    habitaciones: 3,
    cantidadBanos: 2,
    metrosCuadrados: ''
  })

  useEffect(() => {
    getClientes().then(setClientes).catch(() => {})
    getZonas().then(setZonas).catch(() => {})
    if (isEdit) {
      getPropiedad(id).then(data => {
        setForm({
          direccion: data.direccion,
          idVendedor: String(data.idVendedor),
          idZona: String(data.idZona),
          descripcion: data.descripcion,
          precio: String(data.precio),
          estado: data.estado,
          habitaciones: data.habitaciones,
          cantidadBanos: data.cantidadBanos,
          metrosCuadrados: String(data.metrosCuadrados)
        })
        setLoading(false)
      }).catch(() => setLoading(false))
    }
  }, [id, isEdit])

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleFiles = (files) => {
    const fileArray = Array.from(files)
    setPreviews(prev => [...prev, ...fileArray.map(f => ({ file: f, url: URL.createObjectURL(f) }))])
  }

  const removePreview = (index) => {
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index].url)
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (isEdit) {
        await updatePropiedad(id, {
          direccion: form.direccion,
          idZona: Number(form.idZona),
          descripcion: form.descripcion,
          precio: Number(form.precio),
          habitaciones: Number(form.habitaciones),
          cantidadBanos: Number(form.cantidadBanos),
          metrosCuadrados: Number(form.metrosCuadrados),
          estado: form.estado
        })
        navigate(`/propiedades/${id}`)
      } else {
        const fd = new FormData()
        fd.append('direccion', form.direccion)
        fd.append('idVendedor', form.idVendedor)
        fd.append('idZona', form.idZona)
        fd.append('descripcion', form.descripcion)
        fd.append('precio', form.precio)
        fd.append('estado', form.estado)
        fd.append('habitaciones', form.habitaciones)
        fd.append('cantidadBanos', form.cantidadBanos)
        fd.append('metrosCuadrados', form.metrosCuadrados)
        previews.forEach(p => fd.append('imagenes', p.file))
        const nueva = await createPropiedad(fd)
        navigate(`/propiedades/${nueva.id}`)
      }
    } catch (err) {
      console.error('Error:', err)
      alert('Error al guardar la propiedad')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateZona = async () => {
    const nombre = prompt('Nombre de la nueva zona:')
    if (!nombre) return
    try {
      const zona = await createZona(nombre)
      setZonas(prev => [...prev, zona])
      setForm(prev => ({ ...prev, idZona: String(zona.id) }))
    } catch (err) {
      alert('Error al crear la zona')
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
    <>
      <div className="max-w-[960px] mx-auto">
        <div className="mb-xl">
          <div className="flex items-center gap-xs text-on-surface-variant mb-2">
            <span className="text-label-md font-label-md">Propiedades</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-label-md font-label-md text-primary">
              {isEdit ? 'Editar Propiedad' : 'Nueva Propiedad'}
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            {isEdit ? 'Editar Propiedad' : 'Nueva Propiedad'}
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant">
            {isEdit
              ? 'Actualice los datos de la propiedad.'
              : 'Complete los detalles para registrar una nueva propiedad en el sistema.'}
          </p>
        </div>

        <form id="propertyForm" className="grid grid-cols-1 lg:grid-cols-12 gap-gutter" onSubmit={handleSubmit}>
          <div className="lg:col-span-8 space-y-gutter">
            <div className="bg-surface-container-lowest rounded-xl p-md custom-shadow-l1 border border-outline-variant/30">
              <div className="flex items-center gap-sm mb-md">
                <span className="material-symbols-outlined text-secondary">info</span>
                <h2 className="font-headline-sm text-headline-sm">Información Básica</h2>
              </div>
              <div className="space-y-md">
                <div className="flex flex-col gap-xs">
                  <label className="text-label-md font-label-md text-on-surface-variant">Dirección</label>
                  <input
                    type="text"
                    value={form.direccion}
                    onChange={e => handleChange('direccion', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-bright font-body-md"
                    placeholder="Ej. Av. Italia 1234"
                    required
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-md font-label-md text-on-surface-variant">Vendedor</label>
                  <div className="relative">
                    <select
                      value={form.idVendedor}
                      onChange={e => handleChange('idVendedor', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-bright font-body-md appearance-none"
                      required
                      disabled={isEdit}
                    >
                      <option value="" disabled>Seleccionar vendedor</option>
                      {clientes.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre} (DNI: {c.id})</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
                  </div>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-md font-label-md text-on-surface-variant">Zona</label>
                  <div className="relative">
                    <select
                      value={form.idZona}
                      onChange={e => {
                        if (e.target.value === '__new__') { handleCreateZona(); return }
                        handleChange('idZona', e.target.value)
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-bright font-body-md appearance-none"
                      required
                    >
                      <option value="" disabled>Seleccionar zona</option>
                      {zonas.map(z => (
                        <option key={z.id} value={z.id}>{z.nombre}</option>
                      ))}
                      <option value="__new__" className="text-secondary font-bold">+ Añadir Nueva Zona</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
                  </div>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-md font-label-md text-on-surface-variant">Descripción</label>
                  <textarea
                    value={form.descripcion}
                    onChange={e => handleChange('descripcion', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-bright font-body-md resize-none"
                    placeholder="Describa las características, comodidades y puntos destacados de la propiedad..."
                    rows="6"
                    required
                  />
                </div>
              </div>
            </div>

            {!isEdit && (
              <div className="bg-surface-container-lowest rounded-xl p-md custom-shadow-l1 border border-outline-variant/30">
                <div className="flex items-center justify-between mb-md">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-secondary">image</span>
                    <h2 className="font-headline-sm text-headline-sm">Galería de Imágenes</h2>
                  </div>
                  <span className="text-label-md font-label-md text-on-surface-variant">Máx. 10 imágenes (JPEG, PNG)</span>
                </div>
                <div
                  className="border-2 border-dashed border-outline-variant rounded-xl p-xl flex flex-col items-center justify-center bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                >
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-sm group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_upload</span>
                  </div>
                  <p className="font-headline-sm text-headline-sm text-primary mb-1">Arrastre y suelte imágenes aquí</p>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">o haga clic para buscar archivos</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    multiple
                    className="hidden"
                    onChange={e => { handleFiles(e.target.files); e.target.value = '' }}
                  />
                </div>
                {previews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-sm mt-md">
                    {previews.map((p, i) => (
                      <div key={i} className="aspect-square rounded-lg overflow-hidden relative group">
                        <img src={p.url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <button
                            type="button"
                            onClick={() => removePreview(i)}
                            className="material-symbols-outlined text-white p-2 hover:text-error"
                          >
                            delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-gutter">
            <div className="bg-surface-container-lowest rounded-xl p-md custom-shadow-l1 border border-outline-variant/30">
              <div className="space-y-md">
                <div className="flex flex-col gap-xs">
                  <label className="text-label-md font-label-md text-on-surface-variant">Precio ($)</label>
                  <input
                    type="number"
                    value={form.precio}
                    onChange={e => handleChange('precio', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-bright font-display-price text-display-price"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-md font-label-md text-on-surface-variant">Estado</label>
                  <select
                    value={form.estado}
                    onChange={e => handleChange('estado', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-bright font-body-md"
                  >
                    <option value="DISPONIBLE">Disponible</option>
                    <option value="ARCHIVADA">Archivada</option>
                  </select>
                </div>
                <hr className="border-outline-variant" />
                <div className="grid grid-cols-2 gap-md">
                  <div className="flex flex-col gap-xs">
                    <label className="text-label-md font-label-md text-on-surface-variant">Habitaciones</label>
                    <div className="flex items-center border border-outline rounded-lg overflow-hidden bg-surface-bright">
                      <button
                        type="button"
                        onClick={() => handleChange('habitaciones', Math.max(0, form.habitaciones - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-surface-variant border-r border-outline-variant"
                      >-</button>
                      <input
                        type="text"
                        readOnly
                        value={form.habitaciones}
                        className="w-full text-center border-none bg-transparent py-2 focus:ring-0"
                      />
                      <button
                        type="button"
                        onClick={() => handleChange('habitaciones', form.habitaciones + 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-surface-variant border-l border-outline-variant"
                      >+</button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="text-label-md font-label-md text-on-surface-variant">Baños</label>
                    <div className="flex items-center border border-outline rounded-lg overflow-hidden bg-surface-bright">
                      <button
                        type="button"
                        onClick={() => handleChange('cantidadBanos', Math.max(0, form.cantidadBanos - 0.5))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-surface-variant border-r border-outline-variant"
                      >-</button>
                      <input
                        type="text"
                        readOnly
                        value={form.cantidadBanos}
                        className="w-full text-center border-none bg-transparent py-2 focus:ring-0"
                      />
                      <button
                        type="button"
                        onClick={() => handleChange('cantidadBanos', form.cantidadBanos + 0.5)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-surface-variant border-l border-outline-variant"
                      >+</button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-md font-label-md text-on-surface-variant">Metros Cuadrados</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={form.metrosCuadrados}
                      onChange={e => handleChange('metrosCuadrados', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-bright font-body-md"
                      placeholder="Ej. 120"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-label-md">m²</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant px-margin-desktop py-md z-50 w-full">
        <div className="max-w-[960px] mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-secondary text-secondary font-headline-sm text-headline-sm hover:bg-secondary-container/20 transition-all"
          >
            Cancelar
          </button>
          <div className="flex items-center gap-md">
            <button
              type="submit"
              form="propertyForm"
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-white font-headline-sm text-headline-sm hover:opacity-90 shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              {submitting
                ? 'Guardando...'
                : isEdit ? 'Actualizar Propiedad' : 'Publicar Propiedad'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
