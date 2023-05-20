const Pool = require('pg').Pool;

require('dotenv').config();

const pool = new Pool({
    user: process.env.PSQL_USERNAME,
    password: process.env.PSQL_PASSWORD,
    database: "audio_database",
    host: "localhost",
    port: "5432",
});


module.exports = pool;