import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import clienteRoutes from './routes/clienteRoutes.js'
import zonaRoutes from './routes/zonaRoutes.js'
import propiedadRoutes from './routes/propiedadRoutes.js'
import ventaRoutes from './routes/ventaRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')))

app.use('/api/clientes', clienteRoutes)
app.use('/api/zonas', zonaRoutes)
app.use('/api/propiedades', propiedadRoutes)
app.use('/api/ventas', ventaRoutes)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})
