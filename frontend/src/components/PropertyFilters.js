export default function PropertyFilters({ estado, precioMin, precioMax, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...{ estado, precioMin, precioMax }, [key]: value })
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-xl">
      <div className="flex items-center gap-md">
        <div className="relative">
          <label className="block text-label-md font-label-md text-on-surface-variant mb-xs">Estado</label>
          <select
            value={estado}
            onChange={e => handleChange('estado', e.target.value)}
            className="appearance-none bg-surface border border-outline rounded-lg px-md py-sm pr-lg font-body-md text-body-md focus:border-secondary focus:ring-0 outline-none min-w-[160px]"
          >
            <option value="DISPONIBLE">Disponible</option>
            <option value="VENDIDA">Vendida</option>
            <option value="ARCHIVADA">Archivada</option>
            <option value="">Todas</option>
          </select>
          <span className="material-symbols-outlined absolute right-base bottom-[10px] pointer-events-none text-on-surface-variant">
            expand_more
          </span>
        </div>
        <div className="relative">
          <label className="block text-label-md font-label-md text-on-surface-variant mb-xs">Rango de Precio</label>
          <div className="flex items-center gap-base">
            <input
              type="number"
              placeholder="Min"
              value={precioMin}
              onChange={e => handleChange('precioMin', e.target.value)}
              className="bg-surface border border-outline rounded-lg px-sm py-sm font-body-md text-body-md w-24 focus:border-secondary focus:ring-0 outline-none"
            />
            <span className="text-on-surface-variant">—</span>
            <input
              type="number"
              placeholder="Max"
              value={precioMax}
              onChange={e => handleChange('precioMax', e.target.value)}
              className="bg-surface border border-outline rounded-lg px-sm py-sm font-body-md text-body-md w-24 focus:border-secondary focus:ring-0 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
