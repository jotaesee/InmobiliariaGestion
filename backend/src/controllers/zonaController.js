import prisma from '../prisma.js'

export const getAll = async (req, res) => {
  const zonas = await prisma.zona.findMany({
    include: { _count: { select: { propiedades: true } } }
  })
  res.json(zonas)
}

export const getById = async (req, res) => {
  const { id } = req.params
  const zona = await prisma.zona.findUnique({
    where: { id: Number(id) },
    include: {
      propiedades: {
        include: { imagenes: true, vendedor: true }
      }
    }
  })
  if (!zona) return res.status(404).json({ error: 'Zona no encontrada' })
  res.json(zona)
}

export const create = async (req, res) => {
  const { nombre } = req.body
  const existente = await prisma.zona.findFirst({ where: { nombre } })
  if (existente) return res.status(400).json({ error: 'Ya existe una zona con ese nombre' })
  const zona = await prisma.zona.create({ data: { nombre } })
  res.status(201).json(zona)
}

export const update = async (req, res) => {
  const { id } = req.params
  const { nombre } = req.body
  const zona = await prisma.zona.update({
    where: { id: Number(id) },
    data: { nombre }
  })
  res.json(zona)
}

export const remove = async (req, res) => {
  const { id } = req.params
  const zona = await prisma.zona.findUnique({
    where: { id: Number(id) },
    include: { _count: { select: { propiedades: true } } }
  })
  if (!zona) return res.status(404).json({ error: 'Zona no encontrada' })
  if (zona._count.propiedades > 0)
    return res.status(400).json({ error: 'No se puede eliminar: la zona tiene propiedades asociadas' })
  await prisma.zona.delete({ where: { id: Number(id) } })
  res.json({ mensaje: 'Zona eliminada' })
}
