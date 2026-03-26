import { Pool } from "pg";


export const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE
})


async function setDatabase() {

    await pool.query(`CREATE TABLE IF NOT EXISTS USERS(
    ID SERIAL PRIMARY KEY,
    USERNAME TEXT NOT NULL,
    EMAIL TEXT UNIQUE NOT NULL,
    USER_PASSWORD TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS TASKS(
    ID SERIAL PRIMARY KEY,
    TITLE TEXT NOT NULL,
    TASK_DESCRIPTION TEXT NOT NULL,
    COMPLETED BOOLEAN,
    USER_ID INT NOT NULL REFERENCES USERS(ID)
);`)


}

setDatabase()
