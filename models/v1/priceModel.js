var mysql = require('./Database');
var async = require('async');

exports.priceDataModel = function(){
    priceID =  null;
    xcID = null;
    coinID = null;
    priceUSD = null;
};

exports.getAllData = function(callback){
  var sql = 'SELECT * FROM coin_exchange_price';
  mysql.query(sql, function(err, result){
    if (err) console.log(err);
    else callback(null, result);
  });
}


exports.getAllDbData = function(callback){
  var sql = 'select xcd.coin_short_form, xc.exchange_name, c.coin_name,xcd.coin_id, xcd.exchange_id from exchange_detail as xcd LEFT JOIN exchange as xc on xc.id = xcd.exchange_id LEFT JOIN coin as c ON c.id =xcd.coin_id';
  mysql.query(sql, function(err, result){
    if (err) console.log(err);
    else callback(null, result);
  });
}

exports.enterGBTimeStampAndGetID = function(time, callback) {
	var sql = 'insert into transaction_cycle_spread(cycle_time, cycle_id) values(?,?)';
	var sqlParams = [time, 1];

	var sql2 = 'SELECT id FROM transaction_cycle_spread WHERE cycle_time = ? and cycle_id = ?';
	var sqlParams2 = [time, 1];
  mysql.query(sql, sqlParams,function(err, result){
    if (err) console.log(err);
    else {
    	mysql.query(sql2,sqlParams2, function(err, result2){
	    if (err) console.log(err);
	    else {
	    	callback(null, result2[0]['id']);
	    }
	  });
    }
  });
}

exports.enterBGTimeStampAndGetID = function(time, callback) {
	var sql = 'insert into transaction_cycle_spread(cycle_time, cycle_id) values(?,?)';
	var sqlParams = [time, 2];
  	var sql2 = 'SELECT id FROM transaction_cycle_spread WHERE cycle_time = ? and cycle_id = ?';
	var sqlParams2 = [time, 2];
  mysql.query(sql, sqlParams,function(err, result){
    if (err) console.log(err);
    else {
    	mysql.query(sql2,sqlParams2, function(err, result2){
	    if (err) console.log(err);
	    else {
	    	callback(null, result2[0]['id']);
	    }
	  });
    }
  });
}

exports.enterdetails = function(id,name,calc, callback){
  var sql = 'INSERT INTO transaction_spread_detail(cycle_spread_time_id, cycle_title,cycle_price_spread) VALUES (?,?,?)';
  var sqlParams = [id,name,calc];
  console.log(sqlParams);
  mysql.query(sql,sqlParams, function(err, result){
    if (err) console.log(err);
    else callback(null, result);
  });
}

exports.deleteDataFromADay = function(callback){
  var date = new Date();
  var time = date.getTime();
  var old_time = time - 86400000;
  var sql1 = 'SELECT id FROM transaction_cycle_spread WHERE cycle_time < ?';
  var sqlParams1 = [old_time];
  var sql2 = 'DELETE FROM transaction_spread_detail WHERE cycle_spread_time_id = ?';
  var sqlParams2;
  var sql3 = 'DELETE FROM transaction_cycle_spread WHERE id = ?';
  var sqlParams3;

  async.waterfall([
    function(cb){
      mysql.query(sql1,sqlParams1, function(err, result){
        if (err) console.log(err);
        else{ 
          if(result.length > 0) { 
            cb(null, result)
          }else{
            callback(null, true);
          }
        }
      });
    },
    function(idArray, cb){
      var completion = idArray.length;
      idArray.forEach(function(item){
        sqlParams2 = item['id']
        mysql.query(sql2,sqlParams2, function(err, result){
          if (err) console.log(err);
          else{ 
            completion--;
            if(completion == 0){
              cb(null, idArray);
            }
          }
        });
      })
    },function(idArray, cb){
      var completion = idArray.length;
      idArray.forEach(function(item){
        sqlParams3 = item['id']
        mysql.query(sql3,sqlParams3, function(err, result){
          if (err) console.log(err);
          else{ 
            completion--;
            if(completion == 0){
              console.log('Db cleaned');
              callback(null, true);
            }
          }
        });
      })
    }
  ],function(err){
    console.log('There was an error');
    callback(null, false);
  })
  // mysql.query(sql,sqlParams, function(err, result){
  //   if (err) console.log(err);
  //   else callback(null, result);
  // });
}

exports.getCycleSpecificInfo = function(id, callback){
  var sql = 'SELECT id, cycle_time FROM transaction_cycle_spread WHERE cycle_id = ? ORDER BY cycle_time DESC';
  var sqlParams = [id]
  mysql.query(sql,sqlParams, function(err, result){
    if (err) console.log(err);
    else callback(null, result);
  });
}

exports.getCycleSpecificDetailInfo = function(id, callback){
  var sql = 'SELECT cycle_title, cycle_price_spread FROM transaction_spread_detail WHERE cycle_spread_time_id = ?';
  var sqlParams = [id]
  mysql.query(sql,sqlParams, function(err, result){
    if (err) console.log(err);
    else callback(null, result);
  });
}

