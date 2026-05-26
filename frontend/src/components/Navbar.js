import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Catálogo', path: '/', icon: 'domain' },
  { label: 'Clientes', path: '/clientes', icon: 'people' },
  { label: 'Ventas', path: '/ventas', icon: 'receipt' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant shadow-sm h-16 flex items-center">
      <div className="w-full mx-auto px-margin-desktop grid grid-cols-3 items-center">
        <Link to="/" className="text-headline-sm font-bold text-primary">EstateManager Pro</Link>
        <nav className="hidden md:flex items-center justify-center gap-md">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-label-md text-label-md transition-colors ${
                pathname === link.path
                  ? 'text-secondary border-b-2 border-secondary pb-1'
                  : 'text-on-surface-variant hover:text-secondary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-md">
          <button className="material-symbols-outlined text-primary p-2 hover:bg-surface-container rounded-full">
            notifications
          </button>
          <button className="material-symbols-outlined text-primary p-2 hover:bg-surface-container rounded-full">
            help
          </button>
        </div>
      </div>
    </header>
  )
}
