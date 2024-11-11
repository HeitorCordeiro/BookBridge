import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv'
dotenv.config();

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database:  process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
})

const createTables = async () => {
    
    try{
        await pool.query(
            `CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            )`
        )

        await pool.query(
            `CREATE TABLE IF NOT EXISTS clubs(
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                description TEXT
            )`
        )
        
        await pool.query(
            `CREATE TABLE IF NOT EXISTS books(
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE
                )`
            )
            
            await pool.query(
                `CREATE TABLE IF NOT EXISTS reviews(
                    id SERIAL PRIMARY KEY,
                    book_id INTEGER REFERENCES books(id) ON delete CASCADE,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <=5),
                	comment TEXT
                );`
            )
            
            await pool.query(
                `CREATE TABLE IF NOT EXISTS members(
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
                    PRIMARY KEY (user_id, club_id)
                    );`
                )
                
        console.log('tabelas criadas')
    }catch(error){
        console.log('tabelas nao criadas')
    }
}

createTables();

export default pool;