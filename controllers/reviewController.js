import pool from '../models/db.js'

export const createReview = async (req, res) => {
    const { book_id, user_id, comment, rating } = req.body;
    try{
        const club = await pool.query( 'SELECT club_id FROM books WHERE id = $1', [book_id] ); 
        if (club.rows.length === 0) return res.status(400).json({ error: 'Book not found' });

        const club_id = club.rows[0].club_id;
        const member = await pool.query( 'SELECT * FROM members WHERE user_id = $1 AND club_id = $2', [user_id, club_id] ); 
        if (member.rows.length === 0)  return res.status(403).json({ error: 'User is not a member of the club' });

        const existingReview = await pool.query( 'SELECT * FROM reviews WHERE book_id = $1 AND user_id = $2', [book_id, user_id] ); 
        if (existingReview.rows.length > 0) return res.status(403).json({ error: 'User has already reviewed this book' });

        const review = await pool.query( 'INSERT INTO reviews (book_id, user_id, comment, rating) VALUES ($1, $2, $3, $4) RETURNING *', [book_id, user_id, comment, rating] ); 
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