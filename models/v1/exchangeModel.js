var mysql = require('./Database');

exports.exchangeDataModel = function(){
    xcID =  null;
    xcName = null;
};

exports.getAllExchanges = function(callback){
  var sql = 'SELECT * FROM exchange';
  mysql.query(sql, function(err, result){
    if (err) console.log(err);
    else callback(null, result);
  });
}