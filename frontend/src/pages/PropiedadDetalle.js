import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getPropiedad, deletePropiedad } from '../api/propiedades'

const estadoLabel = { DISPONIBLE: 'Disponible', VENDIDA: 'Vendida', ARCHIVADA: 'Archivada' }
const estadoColors = {
  DISPONIBLE: 'bg-secondary text-white',
  VENDIDA: 'bg-error text-white',
  ARCHIVADA: 'bg-tertiary-fixed text-on-tertiary-fixed',
}

export default function PropiedadDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [prop, setProp] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPropiedad(id).then(data => {
      setProp(data)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [id])

  const handleDelete = () => {
    if (!window.confirm('¿Está seguro de que desea eliminar permanentemente este registro? Esta acción no se puede deshacer.')) return
    deletePropiedad(id).then(() => {
      navigate('/')
    }).catch(err => {
      alert('Error al eliminar: ' + (err.response?.data?.error || err.message))
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center py-xl">
        <span className="material-symbols-outlined text-secondary animate-spin text-4xl">refresh</span>
      </div>
    )
  }

  if (!prop) {
    return (
      <div className="text-center py-xl">
        <p className="font-headline-md text-on-surface-variant">Propiedad no encontrada</p>
        <Link to="/" className="text-secondary font-label-md mt-md inline-block">Volver al catálogo</Link>
      </div>
    )
  }

  const imagenes = prop.imagenes || []
  const mainImg = imagenes.find(i => i.esPortada) || imagenes[0]
  const restImgs = imagenes.filter(i => i !== mainImg)

  return (
    <>
      {/* Breadcrumbs & Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-md gap-md">
        <div>
          <nav className="flex items-center text-xs text-on-surface-variant mb-xs gap-xs">
            <Link to="/" className="hover:text-secondary transition-colors">Propiedades</Link>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="font-semibold text-primary">{prop.direccion}</span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-primary">{prop.direccion}</h1>
          <p className="text-body-md text-on-surface-variant flex items-center gap-xs">
            <span className="material-symbols-outlined text-md">location_on</span>
            {prop.zona?.nombre}
          </p>
        </div>
        <div className="flex gap-sm">
          <button
            onClick={() => navigate(`/propiedades/${prop.id}/editar`)}
            className="flex items-center gap-sm px-md py-sm bg-primary text-on-primary rounded-lg font-label-md hover:opacity-90 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-md">edit</span>
            Editar Propiedad
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-sm px-md py-sm border border-error text-error rounded-lg font-label-md hover:bg-error-container/10 transition-all"
          >
            <span className="material-symbols-outlined text-md">delete</span>
            Eliminar Registro
          </button>
        </div>
      </div>

      {/* Photo Gallery Bento Grid */}
      {imagenes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-gutter h-[400px] md:h-[600px] mb-lg rounded-xl overflow-hidden shadow-md">
          <div className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden">
            <img
              src={`http://localhost:4000${mainImg.url}`}
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            <span className="absolute bottom-md left-md bg-white/90 px-md py-sm rounded-full text-label-md font-bold text-primary flex items-center gap-sm">
              <span className="material-symbols-outlined text-md">photo_camera</span>
              Ver {imagenes.length} fotos
            </span>
          </div>
          {restImgs.slice(0, 4).map((img, i) => (
            <div key={img.id} className="hidden md:block relative group cursor-pointer overflow-hidden">
              <img
                src={`http://localhost:4000${img.url}`}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[300px] bg-surface-variant rounded-xl flex items-center justify-center mb-lg">
          <span className="material-symbols-outlined text-on-surface-variant text-6xl">house</span>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-xl">
          {/* Quick Specs */}
          <section className="grid grid-cols-3 md:grid-cols-3 gap-md p-md bg-white border border-outline-variant rounded-xl shadow-sm">
            <div className="flex flex-col items-center justify-center p-sm border-r border-outline-variant last:border-r-0">
              <span className="material-symbols-outlined text-secondary mb-xs">bed</span>
              <span className="text-headline-sm font-headline-sm text-primary">{prop.habitaciones}</span>
              <span className="text-label-md font-label-md text-on-surface-variant">Habitaciones</span>
            </div>
            <div className="flex flex-col items-center justify-center p-sm border-r border-outline-variant last:border-r-0">
              <span className="material-symbols-outlined text-secondary mb-xs">bathtub</span>
              <span className="text-headline-sm font-headline-sm text-primary">{prop.cantidadBanos}</span>
              <span className="text-label-md font-label-md text-on-surface-variant">Baños</span>
            </div>
            <div className="flex flex-col items-center justify-center p-sm">
              <span className="material-symbols-outlined text-secondary mb-xs">square_foot</span>
              <span className="text-headline-sm font-headline-sm text-primary">{prop.metrosCuadrados}</span>
              <span className="text-label-md font-label-md text-on-surface-variant">m²</span>
            </div>
          </section>

          {/* Description */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-md">Descripción Detallada</h2>
            <div className="text-body-md text-on-surface-variant space-y-md leading-relaxed">
              <p>{prop.descripcion}</p>
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar */}
        <aside className="lg:col-span-4 space-y-md">
          {/* Pricing Card */}
          <div className="bg-white border border-outline-variant p-md rounded-xl shadow-sm">
            <div className="mb-md">
              <span className="text-label-md font-label-caps text-on-surface-variant">PRECIO DE LISTA</span>
              <div className="flex items-baseline gap-xs">
                <span className="text-display-price font-display-price text-primary">
                  ${prop.precio?.toLocaleString('es-UY')}
                </span>
                <span className="text-label-md font-label-md text-on-surface-variant">USD</span>
              </div>
            </div>
            <hr className="my-md border-outline-variant" />
            <div className="flex flex-col gap-sm">
              <div className="flex items-center gap-sm">
                <span className={`w-3 h-3 rounded-full ${prop.estado === 'DISPONIBLE' ? 'bg-secondary' : prop.estado === 'VENDIDA' ? 'bg-error' : 'bg-tertiary-fixed'}`}></span>
                <span className="text-label-md font-semibold text-on-surface">
                  Estado: {estadoLabel[prop.estado] || prop.estado}
                </span>
              </div>
            </div>
          </div>

          {/* Seller Info Card */}
          <div className="bg-surface-container-low border border-outline-variant p-md rounded-xl">
            <h3 className="text-label-md font-label-caps text-on-surface-variant mb-md">CONTACTO DEL ASESOR</h3>
            <div className="space-y-sm mb-md">
              <p className="font-headline-sm text-headline-sm text-primary">{prop.vendedor?.nombre}</p>
            </div>
            <div className="space-y-sm">
              <a
                href={`tel:${prop.vendedor?.telefono}`}
                className="w-full flex items-center justify-center gap-sm py-sm bg-white border border-outline text-primary rounded-lg font-label-md hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-md">phone</span>
                {prop.vendedor?.telefono}
              </a>
              <a
                href={`mailto:${prop.vendedor?.email}`}
                className="w-full flex items-center justify-center gap-sm py-sm bg-white border border-outline text-primary rounded-lg font-label-md hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-md">mail</span>
                {prop.vendedor?.email}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
