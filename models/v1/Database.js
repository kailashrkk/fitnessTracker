
var mysql = require('mysql');
var globals = require('../v1/Globals.js');

var connection = mysql.createConnection({

    host : globals.DATABASE_SERVER,
    port : 3306,
    database : 'Crypto',
    user : 'santcarranza',
    password : 'sant.aws.123?+',
    multipleStatements: true

});

connection.connect();

module.exports = connection;