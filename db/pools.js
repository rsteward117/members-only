const {Pool} = require("pg");
require('dotenv').config();

module.exports = new Pool({
    host: "localhost",
    user: "postgres",
    database: "members_only",
    password: process.env.DBpassword,
    port: 5432
});