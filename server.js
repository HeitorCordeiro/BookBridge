import express  from 'express'
import userRoutes from './Routes/userRoutes.js'
import clubRoutes from './Routes/clubRoutes.js'
import bookRoutes from './Routes/bookRoutes.js'
import reviewRoutes from './Routes/reviewRoutes.js'
import statsRoutes from './Routes/statsRoutes.js'
import { requestLogger, errorLogger, logger } from './middlewares/logMiddleware.js';

const server = express();
server.use(express.json());
server.use(requestLogger);

server.use('/user', userRoutes);
server.use('/club', clubRoutes);
server.use('/book', bookRoutes);
server.use('/review', reviewRoutes);
server.use('/stats', statsRoutes);

server.use(errorLogger);

server.listen(4027, () => {
    logger.info('Server Initialized')
}); 