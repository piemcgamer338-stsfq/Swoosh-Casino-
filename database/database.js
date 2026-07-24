const { Pool } = require("pg");
const config = require("../config/config");


const pool = new Pool({

    connectionString: process.env.DATABASE_URL,

    ssl: {
        rejectUnauthorized: false
    }

});





async function initDatabase() {


    await pool.query(`

        CREATE TABLE IF NOT EXISTS users (

            id SERIAL PRIMARY KEY,

            discord_id TEXT UNIQUE NOT NULL,


            balance INTEGER DEFAULT 0,

            vault INTEGER DEFAULT 0,


            wagered INTEGER DEFAULT 0,

            rateback_wagered INTEGER DEFAULT 0,


            won INTEGER DEFAULT 0,

            lost INTEGER DEFAULT 0,


            xp INTEGER DEFAULT 0,

            level INTEGER DEFAULT 1,


            force_lose INTEGER DEFAULT 0,


            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        );





        CREATE TABLE IF NOT EXISTS transactions (

            id SERIAL PRIMARY KEY,


            discord_id TEXT NOT NULL,


            type TEXT NOT NULL,


            amount INTEGER NOT NULL,


            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        );






        CREATE TABLE IF NOT EXISTS house (

            id INTEGER PRIMARY KEY,


            balance INTEGER NOT NULL

        );






        CREATE TABLE IF NOT EXISTS settings (

            guild_id TEXT PRIMARY KEY,


            win_channel TEXT

        );



    `);







    const house = await pool.query(

        "SELECT * FROM house WHERE id = 1"

    );



    if (house.rows.length === 0) {


        await pool.query(

            `
            INSERT INTO house
            (
                id,
                balance
            )

            VALUES
            (
                1,
                $1
            )
            `,

            [
                config.economy.houseStartBalance
            ]

        );


    }





    console.log(
        "✅ PostgreSQL Database initialized"
    );


}






initDatabase()

.catch(

    console.error

);






module.exports = pool;
