import Book from '../models/books.js'
import Club from '../models/club.js'
import pool from '../models/db.js'

export const addBook = async (req, res) => {
    const { title , clubId } = req.body;
    try{
        const club = await pool.query('SELECT * FROM clubs WHERE id = $1', [clubId])
        if(club.rows.length === 0) return res.status(404).json({error: 'Club not found'});
        
        const existingBook = await pool.query('SELECT * FROM books WHERE title = $1 AND clubID = $2', [title, clubId]);
        if (existingBook.rows.length > 0) return res.status(400).json({ error: ' Book already exist' });       
        
        const book = await pool.query('INSERT TO books (title, clubId) VALUES ($1, $2) RETURNING id' [title, clubId]);
        res.status(201).json(book.rows[0]);
    }catch(error){
        res.status(400).json({error: error.message});
    }
}

export const getBooks = async (req, res) => {
    try{
        const books = await pool.query('SELECT * FROM books');
        res.status(200).json(books.rows);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

export const updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, clubId } = req.body;
    try{
        const book = await pool.query('SELECT * FROM books WHERE id = $1' [id]);
        const club = await pool.query('SELECT * FROM clubs WHERE id = $1', [clubId]);
        const existingBook = await pool.query('SELECT * FROM books WHERE title = $1 and clubId = $2', [title, clubId]);
        
        if(book.rows.length === 0) return res.status(404).json({error: 'Book not found'});
        if(club.rows.length === 0) return res.status(404).json({error: 'Club not found'});
        if (existingBook.rows.length > 0 && existingBook.rows[0].id !== parseInt(id, 10)) return res.status(400).json({ error: ' Book already exist' });       
        
        book = await pool.query('UPDATE books SET title = &1, clubId = $2 WHERE id = $3 RETURNING *', [title, clubId, id]);
        res.status(200).json(book.rows[0]);
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}

export const deleteBook = async (req, res) => {
    const { id } = req.params;
    try{
        const book = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
        if(book.rows.length === 0) return res.status(404).json({error: 'Book not found'});
        
        await pool.query('DELETE FROM books WHERE id = $1', [id]);
        res.status(200).json();
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}