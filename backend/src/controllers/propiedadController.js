import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import prisma from '../prisma.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const getAll = async (req, res) => {
  const { estado, idVendedor } = req.query
  const where = {}
  if (estado) where.estado = estado
  if (idVendedor) where.idVendedor = Number(idVendedor)
  const propiedades = await prisma.propiedad.findMany({
    where,
    include: {
      zona: true,
      vendedor: true,
      imagenes: true
    },
    orderBy: { id: 'desc' }
  })
  res.json(propiedades)
}

export const getById = async (req, res) => {
  const { id } = req.params
  const propiedad = await prisma.propiedad.findUnique({
    where: { id: Number(id) },
    include: {
      zona: true,
      vendedor: true,
      imagenes: { orderBy: { esPortada: 'desc' } },
      venta: { include: { Comprador: true } }
    }
  })
  if (!propiedad) return res.status(404).json({ error: 'Propiedad no encontrada' })
  res.json(propiedad)
}

export const create = async (req, res) => {
  const {
    idVendedor, direccion, idZona, descripcion,
    habitaciones, cantidadBanos, metrosCuadrados, precio, estado
  } = req.body

  const data = {
    idVendedor: Number(idVendedor),
    direccion,
    idZona: Number(idZona),
    descripcion,
    habitaciones: Number(habitaciones),
    cantidadBanos: Number(cantidadBanos),
    metrosCuadrados: Number(metrosCuadrados),
    precio: Number(precio)
  }
  if (estado) data.estado = estado

  const propiedad = await prisma.propiedad.create({ data })

  if (req.files && req.files.length > 0) {
    const imagenes = req.files.map((file, index) => ({
      url: `/uploads/${file.filename}`,
      esPortada: index === 0,
      idPropiedad: propiedad.id
    }))
    await prisma.imagen.createMany({ data: imagenes })
  }

  const result = await prisma.propiedad.findUnique({
    where: { id: propiedad.id },
    include: { zona: true, vendedor: true, imagenes: true }
  })

  res.status(201).json(result)
}

export const update = async (req, res) => {
  const { id } = req.params
  const {
    direccion, idZona, descripcion,
    habitaciones, cantidadBanos, metrosCuadrados, precio, estado
  } = req.body

  const data = {}
  if (direccion !== undefined) data.direccion = direccion
  if (idZona !== undefined) data.idZona = Number(idZona)
  if (descripcion !== undefined) data.descripcion = descripcion
  if (habitaciones !== undefined) data.habitaciones = Number(habitaciones)
  if (cantidadBanos !== undefined) data.cantidadBanos = Number(cantidadBanos)
  if (metrosCuadrados !== undefined) data.metrosCuadrados = Number(metrosCuadrados)
  if (precio !== undefined) data.precio = Number(precio)
  if (estado !== undefined) data.estado = estado

  const propiedad = await prisma.propiedad.update({
    where: { id: Number(id) },
    data,
    include: { zona: true, vendedor: true, imagenes: true }
  })

  res.json(propiedad)
}

export const updateEstado = async (req, res) => {
  const { id } = req.params
  const { estado } = req.body

  if (!['DISPONIBLE', 'VENDIDA', 'ARCHIVADA'].includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido. Valores: DISPONIBLE, VENDIDA, ARCHIVADA' })
  }

  const propiedad = await prisma.propiedad.update({
    where: { id: Number(id) },
    data: { estado },
    include: { zona: true, imagenes: true }
  })

  res.json(propiedad)
}

export const remove = async (req, res) => {
  const { id } = req.params
  const propiedad = await prisma.propiedad.findUnique({
    where: { id: Number(id) },
    include: { imagenes: true, venta: true }
  })

  if (!propiedad) return res.status(404).json({ error: 'Propiedad no encontrada' })

  if (propiedad.estado !== 'ARCHIVADA' && propiedad.estado !== 'DISPONIBLE') {
    return res.status(400).json({ error: 'Solo se pueden eliminar propiedades archivadas o disponibles sin venta' })
  }

  if (propiedad.venta) {
    return res.status(400).json({ error: 'No se puede eliminar una propiedad que ya fue vendida' })
  }

  for (const img of propiedad.imagenes) {
    const filePath = path.join(__dirname, '../../public/uploads', path.basename(img.url))
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  }

  await prisma.imagen.deleteMany({ where: { idPropiedad: Number(id) } })
  await prisma.propiedad.delete({ where: { id: Number(id) } })

  res.json({ mensaje: 'Propiedad eliminada' })
}
