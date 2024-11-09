import express from 'express'
import { register, login, olhar } from '../controllers/userController.js'

const userRoutes = express.Router();

userRoutes.post('/register', register);
userRoutes.post('/login', login);
userRoutes.get('/perfis', olhar); //só pra verificar o database local

export default userRoutes;