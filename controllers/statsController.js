import pool from '../models/db.js'
import { logger } from '../middlewares/logMiddleware.js';

export const getBooksStats = async (req, res) => {
    logger.info('Searching books stats');
    try{
        const stats = await pool.query(`SELECT AVG(total_books) AS average_books_per_club
                                        FROM(
                                            SELECT COUNT(B.ID) AS total_books
                                            FROM clubs c
                                            LEFT JOIN books b ON c.id = b.club_id
                                            GROUP BY c.id)
                                            `);
        res.status(200).json(stats.rows);
    }catch(error){
        logger.error(error);
        res.status(500).json({error: error.message});
    }
}

export const getReviewsStats = async (req, res) => {
    logger.info('Searching reviews stats');
    try{
        const stats = await pool.query(`SELECT b.id, b.title, AVG(r.rating) AS average_rating
                                        FROM books b
                                        LEFT JOIN reviews r ON b.id = r.book_id
                                        GROUP BY b.id, b.title
                                        `);
        res.status(200).json(stats.rows);
    }catch(error){
        logger.error(error);
        res.status(500).json({error: error.message});
    }
}