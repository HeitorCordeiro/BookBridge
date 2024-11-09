import express from 'express'
import { createClub, getClubs, updateClub, deleteClub} from '../controllers/clubController.js'

const clubRoutes = express.Router();

clubRoutes.post('/create', createClub);
clubRoutes.get('/clubs', getClubs);
clubRoutes.put('/modificar/:id', updateClub);
clubRoutes.delete('/delete/:id', deleteClub);

export default clubRoutes;