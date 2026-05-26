import prisma from '../prisma.js'

export const getAll = async (req, res) => {
  const clientes = await prisma.cliente.findMany({
    include: {
      _count: { select: { propiedades: true, compras: true } }
    }
  })
  res.json(clientes)
}

export const getById = async (req, res) => {
  const { id } = req.params
  const cliente = await prisma.cliente.findUnique({
    where: { id: Number(id) },
    include: {
      propiedades: {
        include: { zona: true, imagenes: true }
      },
      compras: {
        include: {
          propiedad: { include: { zona: true, imagenes: true } }
        }
      }
    }
  })
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' })
  res.json(cliente)
}

export const create = async (req, res) => {
  const { id, nombre, telefono, email } = req.body
  const existente = await prisma.cliente.findUnique({ where: { id: Number(id) } })
  if (existente) return res.status(400).json({ error: 'Ya existe un cliente con ese DNI' })
  const cliente = await prisma.cliente.create({
    data: { id: Number(id), nombre, telefono, email }
  })
  res.status(201).json(cliente)
}

export const update = async (req, res) => {
  const { id } = req.params
  const { nombre, telefono, email } = req.body
  const cliente = await prisma.cliente.update({
    where: { id: Number(id) },
    data: { nombre, telefono, email }
  })
  res.json(cliente)
}

export const remove = async (req, res) => {
  const { id } = req.params
  const cliente = await prisma.cliente.findUnique({
    where: { id: Number(id) },
    include: { _count: { select: { propiedades: true } } }
  })
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' })
  if (cliente._count.propiedades > 0)
    return res.status(400).json({ error: 'No se puede eliminar: el cliente tiene propiedades asociadas' })
  await prisma.cliente.delete({ where: { id: Number(id) } })
  res.json({ mensaje: 'Cliente eliminado' })
}
