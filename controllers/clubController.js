import Club from '../models/club.js'
import pool from '../models/db.js'

export const createClub = async (req, res) => {
    const { name, description } = req.body;
    try{
        const existingClub = await pool.query('SELECT * FROM clubs WHERE name = $1', [name]);
        if (existingClub.rows.length > 0) {
            return res.status(400).json({ error: 'Name already taken'});
        }
        const club = await pool.query('INSERT INTO clubs (name, description) VALUES ($1, $2) RETURNING id', [name, description]);
        res.status(200).json({id: club.row[0].id});
    }catch(error){
        res.status(400).json({error: error.message});
    }
}

export const getClubs = async(req, res) => {
    try{
        const clubs = await pool.query('SELECT * FROM clubs');
        res.status(200).json(clubs);
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
        res.status(200).json();
    }catch(error){
        res.status(400).json({error: error.message});
    }
}