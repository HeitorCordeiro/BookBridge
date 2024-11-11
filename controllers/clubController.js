import pool from '../models/db.js'
import { logger } from '../middlewares/logMiddleware.js';

export const createClub = async (req, res) => {
    const { name, description } = req.body;
    logger.info('try create club: ${name}');
    try{
        const existingClub = await pool.query('SELECT * FROM clubs WHERE name = $1', [name]);
        if (existingClub.rows.length > 0) {
            logger.warn('Name already taken');
            return res.status(400).json({ error: 'Name already taken'});
        }
        const club = await pool.query('INSERT INTO clubs (name, description) VALUES ($1, $2) RETURNING id', [name, description]);
        res.status(200).json({id: club.rows[0].id});
    }catch(error){
        logger.error(error);
        res.status(400).json({error: error.message});
    }
}

export const getClubs = async(req, res) => {
    logger.info('Searching clubs');
    try{
        const clubs = await pool.query('SELECT * FROM clubs');
        res.status(200).json(clubs);
    }catch(error){
        logger.error(error);
        res.status(500).json({error: error.message});
    }
}

export const updateClub = async (req, res) =>{
    const{ id } = req.params;
    const{ name, description } = req.body;
    logger.info('try update club: ${id}');
    try{
        const club = await pool.query('SELECT * FROM clubs WHERE id = $1', [id]);
        const existingClub = await pool.query('SELECT * FROM clubs WHERE name = $1', [name]);
        
        if(club.rows.length === 0) {
            logger.warn('Club not found');
            return res.status(404).json({error: 'Club not found'});
        }
        if (existingClub.rows.length > 0 && existingClub.rows[0].id !== parseInt(id, 10)) {
            logger.warn('Name already taken');
            return res.status(400).json({ error: 'Name already taken'});
        }
        
        club = await pool.query('UPDATE clubs SET name = $1, description = $2 WHERE id = $3 RETURNING *', [name, description, id]);
        res.status(200).json(club.rows[0]);
    }catch(error){
        logger.error(error);
        res.status(400).json({error: error.message});
    }
}

export const deleteClub = async (req, res) => {
    const { id } = req.params;
    logger.info('Try delete club: ${id}');
    try{
        const club = await pool.query('SELECT * FROM clubs WHERE id = $1', [id]);
        if(club.rows.length === 0) {
            logger.warn('Club not found');
            return res.status(404).json({error: 'Club not found'});
        } 
            
        await pool.query('DELETE FROM clubs WHERE id = $1', [id]);
        res.status(200).json();
    }catch(error){
        logger.error(error);
        res.status(400).json({error: error.message});
    }
}



export const subscribeClub = async (req, res) => {
  const { user_id, club_id } = req.body;
  logger.info('Try subscribe: ${user_id}');
  try {
    const club = await pool.query('SELECT * FROM clubs WHERE id = $1', [club_id]);
    if (club.rows.length === 0){
        logger.warn('Club not found');
        return res.status(404).json({ error: 'Club not found' });
    } 

    const user = await pool.query('SELECT * FROM users WHERE id = $1', [user_id]);
    if (user.rows.length === 0) {
        logger.warn('User not found');
        return res.status(404).json({ error: 'User not found' });
    }

    const existingMembership = await pool.query('SELECT * FROM members WHERE user_id = $1 AND club_id = $2', [user_id, club_id]);
    if (existingMembership.rows.length > 0) {
        logger.warn('User is already subscribed');
        return res.status(400).json({ error: 'User is already subscribed' });
    }

    const subscribe = await pool.query('INSERT INTO members (user_id, club_id) VALUES ($1, $2) RETURNING *', [user_id, club_id]);
    res.status(200).json(subscribe.rows[0]);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
};
