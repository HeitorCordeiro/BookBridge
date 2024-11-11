import pool from '../models/dbs.js'

export const createReview = async (req, res) => {
    const { bookId, userId, comment, rating } = req.body;
    try{
        const club = await pool.query( 'SELECT clubId FROM books WHERE id = $1', [bookId] ); 
        if (club.rows.length === 0) return res.status(400).json({ error: 'Book not found' });

        const clubId = club.rows[0].clubId; 

        const member = await pool.query( 'SELECT * FROM memberships WHERE userId = $1 AND clubId = $2', [userId, clubId] ); 
        if (member.rows.length === 0)  return res.status(403).json({ error: 'User is not a member of the club' });

        const existingReview = await pool.query( 'SELECT * FROM reviews WHERE bookId = $1 AND userId = $2 AND clubID = $3', [bookId, userId, clubId] ); 
        if (existingReview.rows.length > 0) return res.status(403).json({ error: 'User has already reviewed this book' });

        const review = await pool.query( 'INSERT INTO reviews (bookId, userId, comment, rating) VALUES ($1, $2, $3, $4) RETURNING *', [bookId, userId, comment, rating] ); 
        res.status(201).json(review.rows[0]);
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}

export const getReviews = async (req, res) => { 
    try { 
        const review = await pool.query('SELECT * FROM reviews'); 
        res.status(200).json(review.rows); 
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    }
}

export const updateReview = async (req, res) => { 
    const { id } = req.params; 
    const { rating, comment } = req.body; 
    try { 
        const existingReview = await pool.query( 'SELECT * FROM reviews WHERE id = $1', [id] ); 
        if (existingReview.rows.length === 0)  return res.status(404).json({ error: 'Review not found' });  

        const review = await pool.query( 'UPDATE reviews SET rating = $1, comment = $2 WHERE id = $3 RETURNING *', [rating, comment, id] ); 
        res.status(200).json(review.rows[0]);
    } catch (error) { 
        res.status(400).json({ error: error.message }); 
    } 
}

export const deleteReview = async (req, res) => { 
    const { id } = req.params; 
    try { 
        const existingReview = await pool.query( 'SELECT * FROM reviews WHERE id = $1', [id] ); 
        if (existingReview.rows.length === 0)  return res.status(404).json({ error: 'Review not found' });

        const review = await pool.query('DELETE FROM reviews WHERE id = $1 RETURNING *', [id]);  
        res.status(200).json(); 
    } catch (error) { 
        res.status(400).json({ error: error.message }); 
    } 
}