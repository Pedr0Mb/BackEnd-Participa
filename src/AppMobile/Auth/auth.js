import express from 'express'
import * as authController from './authController.js'

const router = express.Router()

router.post('/', authController.loginEmailController)
router.post('/google', authController.loginWithGoogleController)

export default router