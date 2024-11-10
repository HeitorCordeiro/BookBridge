import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;

export const authenticateToken = ( req , res , next ) => {
    const token = req.headers['authorization'];
    if(!token) return res.status(401).json({error: 'Access denied'});

    jwt.verify(token, secretKey, (err, user) => {
        if(err) return res.status(403).json({ error: 'Invalid Token'});
        req.user = user;
        next();
    });
}
