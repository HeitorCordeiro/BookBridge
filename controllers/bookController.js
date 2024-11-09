import Book from '../models/books.js'
import Club from '../models/club.js'

export const addBook = async (req, res) => {
    const { title , clubId } = req.body;
    try{
        const club = await Club.findByPk(clubId);
        if(!club) return res.status(404).json({error: 'Club not found'});
        const existingBook = await Book.findOne({ where: { title , clubId } });
        if (existingBook) return res.status(400).json({ error: ' Book already exist' });       
        const book = await Book.create({title, clubId});
        res.status(201).json(book);
    }catch(error){
        res.status(400).json({error: error.message});
    }
}

export const getBooks = async (req, res) => {
    try{
        const books = await Book.findAll();
        res.status(200).json(books);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

export const updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, clubId } = req.body;
    console.log(`ID do Livro recebido: ${id}`);
    try{
        const book = await Book.findByPk(id);
        const club = await Club.findByPk(clubId);
        
        if(!book) return res.status(404).json({error: 'Book not found'});
        if(!club) return res.status(404).json({error: 'Club not found'});
        const existingBook = await Book.findOne({ where: { title , clubId } });
        if (existingBook) return res.status(400).json({ error: ' Book already exist' });       
        
        book.title = title || book.title;
        book.clubId = clubId || book.clubId;

        await book.save();
        res.status(200).json(book);
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}

export const deleteBook = async (req, res) => {
    const { id } = req.params;
    try{
        const book = await Book.findByPk(id);
        if(!book) return res.status(404).json({error: 'Book not found'});
        
        await book.destroy();
        res.status(200).json();
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}