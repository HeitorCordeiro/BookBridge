import bcrypt  from 'bcryptjs';
import jwt from 'jsonwebtoken'
import pool from '../models/db.js'
import dotenv from "dotenv";
import { logger } from '../middlewares/logMiddleware.js';
dotenv.config(); 


const secretKey = process.env.JWT_SECRET_KEY;


export const register = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    logger.info('try Register User');
    try {
      const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

      if (existingUser.rows.length > 0) {
        logger.warn('Username already taken'); 
        return res.status(400).json({ error: 'Username already taken' });
      }

      await pool.query('INSERT INTO users(username, password) VALUES ($1, $2)', [username, hashedPassword]);
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      logger.error(error);
      res.status(400).json({ error: error.message });
    }
  };
  

export const login = async (req, res) => {
        const { username, password } = req.body;
        const result  = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
        logger.info('try Login: ${username}');
        try{
          if(!user){
            logger.warn('User not found'); 
            return res.status(404).json({error: 'User not found'});
          } 
            
          if(!bcrypt.compareSync(password, user.password)) {
            logger.warn('Invalid password'); 
            return res.status(404).json({error: 'Invalid password'});
          }
          
          const token = jwt.sign({id: user.id}, secretKey, { expiresIn: '1d'});
          res.status(200).json({token});
        }catch(error){
          logger.error(error);
          res.status(400).json({error: error.message});
        }
};


