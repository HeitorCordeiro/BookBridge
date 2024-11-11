import {  logger } from '../middlewares/logMiddleware.js';
import pool from '../models/db.js'

export const addBook = async (req, res) => {
    const { title , club_id } = req.body;
    logger.info('try add: ${title}');
    try{
        const club = await pool.query('SELECT * FROM clubs WHERE id = $1', [club_id])
        if(club.rows.length === 0) {
            logger.warn('Club not found');                        
            return res.status(404).json({error: 'Club not found'});
        }
        const existingBook = await pool.query('SELECT * FROM books WHERE title = $1 AND club_id = $2', [title, club_id]);
        if (existingBook.rows.length > 0) {
            logger.warn('Book already exist'); 
            return res.status(400).json({ error: ' Book already exist' });       
        }
        const book = await pool.query('INSERT INTO books (title, club_id) VALUES ($1, $2) RETURNING id', [title, club_id]);
        res.status(201).json(book.rows[0]);
    }catch(error){
        logger.error(error);
        res.status(400).json({error: error.message});
    }
}

export const getBooks = async (req, res) => {
    logger.info('Searching books');
    try{
        const books = await pool.query('SELECT * FROM books');
        res.status(200).json(books.rows);
    }catch(error){
        logger.error(error);
        res.status(500).json({error: error.message});
    }
}

export const updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, club_id } = req.body;
    logger.info('try update book: ${id}');
    try{
        const book = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
        const club = await pool.query('SELECT * FROM clubs WHERE id = $1', [club_id]);
        const existingBook = await pool.query('SELECT * FROM books WHERE title = $1 and club_id = $2', [title, club_id]);
        
        if(book.rows.length === 0){
            logger.warn('Book not found');
            return res.status(404).json({error: 'Book not found'});
        } 
            
        if(club.rows.length === 0) {
            logger.warn('Club not found');
            return res.status(404).json({error: 'Club not found'});
        }
        if (existingBook.rows.length > 0 && existingBook.rows[0].id !== parseInt(id, 10)){
            logger.warn('Book already exist');
            return res.status(400).json({ error: ' Book already exist' });       
        } 
            
        
        const update = await pool.query('UPDATE books SET title = $1, club_id = $2 WHERE id = $3 RETURNING *', [title, club_id, id]);
        res.status(200).json(update.rows[0]);
    }catch(error){
        logger.error(error);
        res.status(400).json({ error: error.message });
    }
}

export const deleteBook = async (req, res) => {
    const { id } = req.params;
    logger.info('Try delete book: ${id}');
    try{
        const book = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
        if(book.rows.length === 0) {
            logger.warn('Book not found');
            return res.status(404).json({error: 'Book not found'});
        }
        
        await pool.query('DELETE FROM books WHERE id = $1', [id]);
        res.status(200).json();
    }catch(error){
        logger.error(error);
        res.status(400).json({ error: error.message });
    }
}