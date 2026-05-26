import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getPropiedades } from '../api/propiedades'
import PropertyFilters from '../components/PropertyFilters'
import PropertyCard from '../components/PropertyCard'

export default function Catalogo() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [propiedades, setPropiedades] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    estado: searchParams.get('estado') || 'DISPONIBLE',
    precioMin: '',
    precioMax: '',
    idVendedor: searchParams.get('idVendedor') || ''
  })

  const vendedorId = filters.idVendedor

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    const params = {}
    if (newFilters.estado) params.estado = newFilters.estado
    if (newFilters.idVendedor) params.idVendedor = newFilters.idVendedor
    setSearchParams(params, { replace: true })
  }

  const clearVendedorFilter = () => {
    handleFilterChange({ ...filters, idVendedor: '' })
  }

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.estado) params.estado = filters.estado
      if (filters.idVendedor) params.idVendedor = filters.idVendedor
      const data = await getPropiedades(params)
      let filtered = data
      if (filters.precioMin) filtered = filtered.filter(p => p.precio >= Number(filters.precioMin))
      if (filters.precioMax) filtered = filtered.filter(p => p.precio <= Number(filters.precioMax))
      setPropiedades(filtered)
    } catch (err) {
      console.error('Error fetching propiedades:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetch() }, [fetch])

  return (
    <>
      {vendedorId && (
        <div className="bg-secondary/10 border border-secondary/30 rounded-lg px-md py-sm mb-md flex items-center gap-sm text-body-sm">
          <span className="material-symbols-outlined text-secondary text-sm">filter_alt</span>
          <span className="text-on-surface">Filtrando por vendedor ID: {vendedorId}</span>
          <button onClick={clearVendedorFilter} className="ml-auto text-on-surface-variant hover:text-error transition-colors">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-xl">
        <PropertyFilters {...filters} onChange={handleFilterChange} />
        <button
          onClick={() => navigate('/propiedades/nueva')}
          className="bg-primary hover:bg-primary-container text-on-primary font-label-md px-xl py-md rounded-lg transition-all flex items-center justify-center gap-sm self-end md:self-auto"
        >
          <span className="material-symbols-outlined">add</span>
          Añadir Propiedad
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-xl">
          <span className="material-symbols-outlined text-secondary animate-spin text-4xl">refresh</span>
        </div>
      ) : propiedades.length === 0 ? (
        <div className="text-center py-xl text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl mb-md">real_estate_agent</span>
          <p className="font-headline-sm">No hay propiedades {filters.estado === 'DISPONIBLE' ? 'disponibles' : filters.estado === 'VENDIDA' ? 'vendidas' : filters.estado === 'ARCHIVADA' ? 'archivadas' : ''}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
          {propiedades.map(p => (
            <PropertyCard key={p.id} propiedad={p} />
          ))}
        </div>
      )}
    </>
  )
}
