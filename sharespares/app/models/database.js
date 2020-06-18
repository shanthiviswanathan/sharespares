const mysql = require("mysql");
const util = require ('util')
const dbConfig = require("../config/db.config.js");

// Create a connection to the database
function makeDb () {
  const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
  });
  
  return {
    query (sql.args) {
      return util.promisify (connection.query)
         .call (connection,sql,args);
    },
    close() {
      return util.promisify(connection.end).call(connection)
    }
  };
}

module.exports = makeDb;