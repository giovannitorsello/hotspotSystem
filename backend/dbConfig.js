var config = require("./config.js").load();
var mysql = require("mysql2");
var conn = mysql.createConnection({
  host: config.database.database_host,
  user: config.database.database_username,
  password: config.database.database_password,
  database: config.database.database_name,
});

conn.connect(function (err) {
  if (err) throw err;
  console.log("Database connesso correttamente");
});

module.exports = conn;

//grant all privileges on node_app.* to 'antonio'@'localhost' identified by "antonio";
