var mysql = require('mysql2');
var conn = mysql.createConnection({
  host: 'localhost', // HOSTNAME
  user: 'root',      // DATABASE NAME
  password: 'antonio',      // DB PASSWORD
  database: 'node_app' // // DB NAME
}); 
 
conn.connect(function(err) {
  if (err) throw err;
  console.log('Database connesso correttamente');
});
module.exports = conn;