import prisma from '../prisma.js'

export const getAll = async (req, res) => {
  const ventas = await prisma.venta.findMany({
    include: {
      Comprador: true,
      propiedad: {
        include: { zona: true, vendedor: true, imagenes: true }
      }
    },
    orderBy: { fecha: 'desc' }
  })
  res.json(ventas)
}

export const getById = async (req, res) => {
  const { id } = req.params
  const venta = await prisma.venta.findUnique({
    where: { id: Number(id) },
    include: {
      Comprador: true,
      propiedad: {
        include: { zona: true, vendedor: true, imagenes: true }
      }
    }
  })
  if (!venta) return res.status(404).json({ error: 'Venta no encontrada' })
  res.json(venta)
}

export const create = async (req, res) => {
  const { idComprador, idPropiedad, montoTotal } = req.body

  const propiedad = await prisma.propiedad.findUnique({
    where: { id: Number(idPropiedad) }
  })

  if (!propiedad) return res.status(404).json({ error: 'Propiedad no encontrada' })
  if (propiedad.estado !== 'DISPONIBLE')
    return res.status(400).json({ error: 'La propiedad no está disponible' })

  const comprador = await prisma.cliente.findUnique({
    where: { id: Number(idComprador) }
  })
  if (!comprador) return res.status(404).json({ error: 'Comprador no encontrado' })

  const venta = await prisma.$transaction(async (tx) => {
    const nuevaVenta = await tx.venta.create({
      data: {
        idComprador: Number(idComprador),
        fecha: new Date(),
        montoTotal: Number(montoTotal),
        idPropiedad: Number(idPropiedad)
      }
    })

    await tx.propiedad.update({
      where: { id: Number(idPropiedad) },
      data: { estado: 'VENDIDA' }
    })

    return nuevaVenta
  })

  const result = await prisma.venta.findUnique({
    where: { id: venta.id },
    include: { Comprador: true, propiedad: { include: { zona: true, imagenes: true } } }
  })

  res.status(201).json(result)
}

export const remove = async (req, res) => {
  const { id } = req.params
  const venta = await prisma.venta.findUnique({
    where: { id: Number(id) }
  })
  if (!venta) return res.status(404).json({ error: 'Venta no encontrada' })

  await prisma.$transaction(async (tx) => {
    await tx.venta.delete({ where: { id: Number(id) } })
    await tx.propiedad.update({
      where: { id: venta.idPropiedad },
      data: { estado: 'DISPONIBLE' }
    })
  })

  res.json({ mensaje: 'Venta eliminada, propiedad vuelta a disponible' })
}
