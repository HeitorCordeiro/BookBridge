import express  from 'express'
import userRoutes from './Routes/userRoutes.js'
import clubRoutes from './Routes/clubRoutes.js'

const server = express();
server.use(express.json());

server.use('/user', userRoutes);
server.use('/club', clubRoutes)


server.listen(4000); 