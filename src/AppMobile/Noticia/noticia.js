import express from 'express'
import * as noticiaController from './noticiaController.js'

const router = express.Router()

router.get('/', noticiaController.pesquisarNoticiaController)
router.get('/:id', noticiaController.visualizarNoticiaController)

export default router
