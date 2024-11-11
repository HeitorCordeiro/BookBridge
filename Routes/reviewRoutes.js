import express from 'express';
import { createReview, getReviews, updateReview, deleteReview } from '../controllers/reviewController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js'

const reviewRoutes = express.Router();

reviewRoutes.post('/create', authenticateToken, createReview);
reviewRoutes.get('/reviews', getReviews);
reviewRoutes.put('/modificar/:id', authenticateToken, updateReview); 
reviewRoutes.delete('/delete/:id', authenticateToken, deleteReview); 

export default reviewRoutes;
