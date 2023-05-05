const mysql = require("mysql2");
const config = require("../config/env.config");


let connection = mysql.createConnection({
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME
});;

const connectToDb = () => {
  connection.connect(err => {
    if(err) {
      console.log("Error connecting to database...", err)
    }
    console.log("Database connected...");
  });

}

module.exports = {connectToDb, connection}
