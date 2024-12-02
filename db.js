const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "whatsapp_bot",
});

const db = pool.promise();

module.exports = db;
