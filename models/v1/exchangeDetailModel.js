var mysql = require('./Database');

exports.xcDetailDataModel = function(){
    priceID =  null;
    xcID = null;
    coinID = null;
    coinShortForm = null;
};

exports.getXCDetailData = function(callback){
  var sql = 'SELECT * FROM exchange_detail';
  mysql.query(sql, function(err, result){
    if (err) console.log(err);
    else callback(null, result);
  });
}

