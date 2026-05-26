import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { PrismaClient } = require('./generated/prisma/index.js')

import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
})
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

export default prisma
