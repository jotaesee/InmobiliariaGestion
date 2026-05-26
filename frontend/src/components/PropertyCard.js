import { useNavigate } from 'react-router-dom'

const estadoStyles = {
  DISPONIBLE: 'bg-secondary-container/90 text-on-secondary-container',
  VENDIDA: 'bg-error-container text-on-error-container',
  ARCHIVADA: 'bg-tertiary-fixed text-on-tertiary-fixed',
}

export default function PropertyCard({ propiedad }) {
  const navigate = useNavigate()
  const portada = propiedad.imagenes?.find(img => img.esPortada) || propiedad.imagenes?.[0]
  const estadoLabel = { DISPONIBLE: 'DISPONIBLE', VENDIDA: 'VENDIDA', ARCHIVADA: 'ARCHIVADA' }

  return (
    <div
      className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-outline-variant flex flex-col cursor-pointer"
      onClick={() => navigate(`/propiedades/${propiedad.id}`)}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div className="relative h-64 overflow-hidden">
        {portada ? (
          <img
            src={`http://localhost:4000${portada.url}`}
            alt={propiedad.direccion}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-surface-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface-variant text-5xl">house</span>
          </div>
        )}
        <div className="absolute top-md right-md">
          <span className={`px-md py-xs font-label-caps text-label-caps rounded-full backdrop-blur-md ${estadoStyles[propiedad.estado] || 'bg-surface/80 text-on-surface'}`}>
            {estadoLabel[propiedad.estado] || propiedad.estado}
          </span>
        </div>
      </div>
      <div className="p-md flex flex-col gap-sm flex-grow">
        <p className="font-display-price text-display-price text-primary">
          ${propiedad.precio?.toLocaleString('es-UY')}
        </p>
        <div>
          <p className="font-headline-sm text-headline-sm text-on-surface">{propiedad.direccion}</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-xs">
            <span className="material-symbols-outlined text-sm">location_on</span>
            {propiedad.zona?.nombre}
          </p>
        </div>
        <div className="mt-auto pt-md border-t border-outline-variant flex items-center gap-md">
          <div className="flex items-center gap-xs text-on-surface-variant">
            <span className="material-symbols-outlined">bed</span>
            <span className="font-label-md text-label-md">{propiedad.habitaciones} Hab.</span>
          </div>
          <div className="flex items-center gap-xs text-on-surface-variant">
            <span className="material-symbols-outlined">bathtub</span>
            <span className="font-label-md text-label-md">{propiedad.cantidadBanos} Baños</span>
          </div>
          <div className="flex items-center gap-xs text-on-surface-variant">
            <span className="material-symbols-outlined">square_foot</span>
            <span className="font-label-md text-label-md">{propiedad.metrosCuadrados} m²</span>
          </div>
        </div>
      </div>
    </div>
  )
}
