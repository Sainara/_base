var express = require('express');
var mysql = require('mysql');
var app = express();
var router = express.Router();
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'dbuser',
  password : 's3kreee7'
});

//connection.connect();

//connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
//  if (err) throw err;
//  console.log('The solution is: ', rows[0].solution);
//});

//connection.end();

app.use(express.static('app'));

app.get('/', function(req, res) {
  res.render('index.jade');
//  res.sendfile('app/index.html')
});
app.get('/somepage', function(req, res) {
  //res.render('another.jade');
 res.sendfile('app/another.html')
});

app.listen(5000);
