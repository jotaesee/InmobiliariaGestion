import { Link, useLocation } from 'react-router-dom'

const items = [
  { label: 'Catálogo', icon: 'domain', path: '/' },
  { label: 'Clientes', icon: 'people', path: '/clientes' },
  { label: 'Añadir', icon: 'add_circle', path: '/propiedades/nueva' },
  { label: 'Ventas', icon: 'receipt', path: '/ventas' },
]

export default function MobileNav() {
  const { pathname } = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant flex justify-around items-center h-16 z-50">
      {items.map(item => {
        const isActive = pathname === item.path
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-xs ${
              isActive ? 'text-secondary' : 'text-on-surface-variant'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="text-label-md font-label-md">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
