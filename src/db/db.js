const mysql = require("mysql2");
const config = require("../config");

const connection = mysql.createConnection({
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME
});

const connectDb = () => {
  connection.connect(err => {
    if(err) throw err;
  });
  console.log("Database connected...");
}

module.exports = {connectDb, connection}
