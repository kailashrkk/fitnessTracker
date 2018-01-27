var mysql = require('./Database');

exports.coinDataModel = function(){
    coinID =  null;
    coinName = null;
};

exports.getAllCoins = function(callback){
  var sql = 'SELECT * FROM coin';
  mysql.query(sql, function(err, result){
    if (err) console.log(err);
    else callback(null, result);
  });
}