import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getClientes } from '../api/propiedades'

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function ClientesLista() {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getClientes().then(data => {
      setClientes(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = clientes.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    String(c.id).includes(search)
  )

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-primary mb-xs">Directorio de Clientes</h2>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Gestione la información y portafolio de sus clientes.
          </p>
        </div>
        <div className="flex items-center gap-md w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant rounded-lg text-body-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
              placeholder="Buscar cliente por nombre o ID..."
            />
          </div>
          <button
            onClick={() => navigate('/clientes/nuevo')}
            className="flex items-center gap-sm bg-primary text-on-primary font-label-md px-xl py-md rounded-lg hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Añadir Cliente
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-xl">
          <span className="material-symbols-outlined text-secondary animate-spin text-4xl">refresh</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-xl text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl mb-md">people</span>
          <p className="font-headline-sm">No se encontraron clientes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {filtered.map(cliente => (
            <div
              key={cliente.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm hover:shadow-md transition-shadow flex flex-col relative group"
            >
              <button
                onClick={() => navigate(`/clientes/${cliente.id}/editar`)}
                className="absolute top-md right-md text-outline hover:text-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                title="Editar"
              >
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
              <div className="flex items-center gap-md mb-md">
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-headline-sm text-headline-sm">
                  {getInitials(cliente.nombre)}
                </div>
                <div>
                  <h3 className="text-headline-sm font-headline-sm text-on-surface leading-tight">{cliente.nombre}</h3>
                  <span className="text-label-md font-label-md text-on-surface-variant">ID: {cliente.id}</span>
                </div>
              </div>
              <div className="flex flex-col gap-sm mb-md flex-1 border-t border-outline-variant pt-md">
                <div className="flex items-center gap-sm text-body-sm font-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-outline">mail</span>
                  <a href={`mailto:${cliente.email}`} className="hover:text-secondary transition-colors truncate">
                    {cliente.email}
                  </a>
                </div>
                <div className="flex items-center gap-sm text-body-sm font-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-outline">phone</span>
                  <a href={`tel:${cliente.telefono}`} className="hover:text-secondary transition-colors">
                    {cliente.telefono}
                  </a>
                </div>
              </div>
              <div className="mt-auto">
                <button
                  onClick={() => navigate(`/?idVendedor=${cliente.id}`)}
                  className="w-full flex items-center justify-center gap-xs py-2 border-[1.5px] border-secondary text-secondary rounded-lg font-label-md text-label-md hover:bg-secondary-container hover:text-on-secondary-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">real_estate_agent</span>
                  Ver Propiedades ({cliente._count?.propiedades ?? 0})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
