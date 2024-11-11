import express from 'express'
import { register, login } from '../controllers/userController.js'

const userRoutes = express.Router();

userRoutes.post('/register', register);
userRoutes.post('/login', login);

export default userRoutes;