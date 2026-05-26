import { Router } from 'express'
import upload from '../config/multer.js'
import {
  getAll, getById, create, update, updateEstado, remove
} from '../controllers/propiedadController.js'

const router = Router()

router.get('/', getAll)
router.get('/:id', getById)
router.post('/', upload.array('imagenes'), create)
router.put('/:id', update)
router.patch('/:id/estado', updateEstado)
router.delete('/:id', remove)

export default router
