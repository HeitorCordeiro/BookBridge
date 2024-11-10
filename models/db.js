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
                clubId INTEGER REFERENCES clubs(id) ON DELETE CASCADE
            )`
        )
        console.log('tabelas criadas')
    }catch(error){
        console.log('tabelas nao criadas')
    }
}

createTables();

export default pool;