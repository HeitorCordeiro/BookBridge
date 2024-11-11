import express from 'express'
import { getBooksStats, getReviewsStats } from '../controllers/statsController.js'

const statsRoutes = express.Router();

statsRoutes.get('/books', getBooksStats);
statsRoutes.get('/review', getReviewsStats);

export default statsRoutes;