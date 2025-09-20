import express from 'express'
const router = express.Router()
import { postLogin, postSignup, postLogout, postRefreshToken } from '../controllers/user-controller'

router.post('/signup', postSignup)

router.post('/login', postLogin)

router.post('/logout', postLogout)

router.post('/refresh-token', postRefreshToken)

export const userRoutes = router