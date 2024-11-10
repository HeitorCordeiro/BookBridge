import bcrypt  from 'bcryptjs';
import User from '../models/user.js';
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();


const secretKey = process.env.JWT_SECRET_KEY;


export const register = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      const user = await User.create({ username, password: hashedPassword });
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

export const login = async (req, res) => {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        try{
          if(!user) return res.status(404).json({error: 'User not found'});
          if(!bcrypt.compareSync(password, user.password)) return res.status(404).json({error: 'Invalid password'});
          
          const token = jwt.sign({id: user.id}, secretKey, { expiresIn: '1d'});
          res.status(200).json({token});
        }catch(error){
          res.status(400).json({error: error.message});
        }
};

export const olhar = async (req, res) => {
    try { const users = await User.findAll(); 
    res.status(200).json(users);    
    }catch (error) { res.status(500).json({ error: error.message }); }
};

