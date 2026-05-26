import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Catalogo from './pages/Catalogo'
import PropiedadForm from './pages/PropiedadForm'
import PropiedadDetalle from './pages/PropiedadDetalle'
import ClientesLista from './pages/ClientesLista'
import ClienteForm from './pages/ClienteForm'
import VentasLista from './pages/VentasLista'
import VentaForm from './pages/VentaForm'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Catalogo />} />
          <Route path="/propiedades/nueva" element={<PropiedadForm />} />
          <Route path="/propiedades/:id" element={<PropiedadDetalle />} />
          <Route path="/propiedades/:id/editar" element={<PropiedadForm />} />
          <Route path="/clientes" element={<ClientesLista />} />
          <Route path="/clientes/nuevo" element={<ClienteForm />} />
          <Route path="/clientes/:id/editar" element={<ClienteForm />} />
          <Route path="/ventas" element={<VentasLista />} />
          <Route path="/ventas/nueva" element={<VentaForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
