import express from 'express'
import { addBook, updateBook, deleteBook , getBooks} from '../controllers/bookController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'

const bookRoutes = express.Router();

bookRoutes.post('/create', authenticateToken, addBook);
bookRoutes.get('/books', authenticateToken, getBooks);
bookRoutes.put('/modificar/:id', authenticateToken, updateBook);
bookRoutes.delete('/delete/:id', authenticateToken, deleteBook);

export default bookRoutes;