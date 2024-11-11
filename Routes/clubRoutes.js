import express from 'express'
import { createClub, getClubs, updateClub, deleteClub} from '../controllers/clubController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'


const clubRoutes = express.Router();

clubRoutes.post('/create', authenticateToken, createClub);
clubRoutes.get('/clubs', getClubs);
clubRoutes.put('/modificar/:id', authenticateToken, updateClub);
clubRoutes.delete('/delete/:id', authenticateToken, deleteClub);

export default clubRoutes;