import { setCache, getCache, clearCache } from '../cache.js'
import pool from '../models/db.js'
const cacheKey = 'clubList';

export const createClub = async (req, res) => {
    const { name, description } = req.body;
    try{
        const existingClub = await pool.query('SELECT * FROM clubs WHERE name = $1', [name]);
        if (existingClub.rows.length > 0) {
            return res.status(400).json({ error: 'Name already taken'});
        }
        const club = await pool.query('INSERT INTO clubs (name, description) VALUES ($1, $2) RETURNING id', [name, description]);
        await clearCache(cacheKey);
        res.status(200).json({id: club.rows[0].id});
    }catch(error){
        res.status(400).json({error: error.message});
    }
}

export const getClubs = async(req, res) => {
    try{
        const cachedClubs = await getCache(cacheKey);
        if(cachedClubs) return res.status(200).json(cachedClubs);

        const clubs = await pool.query('SELECT c.id, c.name, c.description FROM clubs c GROUP BY c.id');
        await setCache(cacheKey, clubs.rows);
        res.status(200).json(clubs.rows);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

export const updateClub = async (req, res) =>{
    const{ id } = req.params;
    const{ name, description } = req.body;
    try{
        const club = await pool.query('SELECT * FROM clubs WHERE id = $1', [id]);
        const existingClub = await pool.query('SELECT * FROM clubs WHERE name = $1', [name]);
        
        if(club.rows.length === 0) return res.status(404).json({error: 'Club not found'});
        if (existingClub.rows.length > 0 && existingClub.rows[0].id !== parseInt(id, 10)) return res.status(400).json({ error: 'Name already taken'});
        
        club = await pool.query('UPDATE clubs SET name = $1, description = $2 WHERE id = $3 RETURNING *', [name, description, id]);
        await clearCache(cacheKey);
        res.status(200).json(club.rows[0]);
    }catch(error){
        res.status(400).json({error: error.message});
    }
}

export const deleteClub = async (req, res) => {
    const { id } = req.params;
    try{
        const club = await pool.query('SELECT * FROM clubs WHERE id = $1', [id]);
        if(club.rows.length === 0) return res.status(404).json({error: 'Club not found'});
        
        await pool.query('DELETE FROM clubs WHERE id = $1', [id]);
        await clearCache(cacheKey);
        res.status(200).json();
    }catch(error){
        res.status(400).json({error: error.message});
    }
}



export const subscribeClub = async (req, res) => {
  const { user_id, club_id } = req.body;
  
  try {
    const club = await pool.query('SELECT * FROM clubs WHERE id = $1', [club_id]);
    if (club.rows.length === 0) return res.status(404).json({ error: 'Club not found' });

    const user = await pool.query('SELECT * FROM users WHERE id = $1', [user_id]);
    if (user.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const existingMembership = await pool.query('SELECT * FROM members WHERE user_id = $1 AND club_id = $2', [user_id, club_id]);
    if (existingMembership.rows.length > 0) return res.status(400).json({ error: 'User is already subscribed' });

    const subscribe = await pool.query('INSERT INTO members (user_id, club_id) VALUES ($1, $2) RETURNING *', [user_id, club_id]);
    res.status(200).json(subscribe.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
