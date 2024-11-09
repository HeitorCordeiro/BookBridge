import express from 'express'
import { addBook, updateBook, deleteBook , getBooks} from '../controllers/bookController.js'

const bookRoutes = express.Router();

bookRoutes.post('/create', addBook);
bookRoutes.get('/books', getBooks);
bookRoutes.put('/modificar/:id', updateBook);
bookRoutes.delete('/delete/:id', deleteBook);

export default bookRoutes;