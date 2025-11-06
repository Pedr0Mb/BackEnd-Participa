import express from 'express'
import * as authController from './authController.js'

const router = express.Router()

router.post('/', authController.loginCpfController)

export default router
