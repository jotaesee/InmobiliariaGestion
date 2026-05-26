import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:4000/api'
})

export const getPropiedades = (params) => api.get('/propiedades', { params }).then(r => r.data)
export const getPropiedad = (id) => api.get(`/propiedades/${id}`).then(r => r.data)
export const createPropiedad = (formData) => api.post('/propiedades', formData).then(r => r.data)
export const updatePropiedad = (id, data) => api.put(`/propiedades/${id}`, data).then(r => r.data)
export const updateEstadoPropiedad = (id, estado) => api.patch(`/propiedades/${id}/estado`, { estado }).then(r => r.data)
export const deletePropiedad = (id) => api.delete(`/propiedades/${id}`).then(r => r.data)

export const getClientes = () => api.get('/clientes').then(r => r.data)
export const getCliente = (id) => api.get(`/clientes/${id}`).then(r => r.data)
export const createCliente = (data) => api.post('/clientes', data).then(r => r.data)
export const updateCliente = (id, data) => api.put(`/clientes/${id}`, data).then(r => r.data)
export const deleteCliente = (id) => api.delete(`/clientes/${id}`).then(r => r.data)

export const getZonas = () => api.get('/zonas').then(r => r.data)
export const createZona = (nombre) => api.post('/zonas', { nombre }).then(r => r.data)

export const getVentas = () => api.get('/ventas').then(r => r.data)
export const getVenta = (id) => api.get(`/ventas/${id}`).then(r => r.data)
export const createVenta = (data) => api.post('/ventas', data).then(r => r.data)
export const deleteVenta = (id) => api.delete(`/ventas/${id}`).then(r => r.data)
