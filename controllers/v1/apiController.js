var priceModel = require('../../models/v1/priceModel.js');
var coinModel = require('../../models/v1/coinModel.js');
var xcModel = require('../../models/v1/exchangeModel.js');
var async = require('async');
var request = require('request');

exports.getApiInfoAndUpdateDB = function () {
	console.log('IN');
	var eth_gdax_binance = 0;
	var ltc_gdax_binance = 0;
	var btc_gdax_binance = 0;
	var bch_gdax_binance = 0;

	var eth_binance_gdax = 0;
	var ltc_binance_gdax = 0;
	var btc_binance_gdax = 0;
	var bch_binance_gdax = 0;

	var btc_gdax = 0;
	var btc_binance = 0;
	var bch_gdax = 0;
	var bch_binance = 0;
	var eth_gdax = 0;
	var eth_binance = 0;
	var ltc_gdax = 0;
	var ltc_binance = 0;

	//G_B_ETH
	var calc_G_B_eth_btc = 0;
	var calc_G_B_eth_ltc = 0;
	var calc_G_B_eth_bch = 0;

	//G_B_BTC
	var calc_G_B_btc_eth = 0;
	var calc_G_B_btc_bch = 0;
	var calc_G_B_btc_ltc = 0;

	//G_B_LTC
	var calc_G_B_ltc_btc = 0;
	var calc_G_B_ltc_eth = 0;
	var calc_G_B_ltc_bch = 0;

	//G_B_BCH
	var calc_G_B_bch_btc = 0;
	var calc_G_B_bch_ltc = 0;
	var calc_G_B_bch_eth = 0;

	//B_G_ETH
	var calc_B_G_eth_btc = 0;
	var calc_B_G_eth_ltc = 0;
	var calc_B_G_eth_bch = 0;

	//B_G_BTC
	var calc_B_G_btc_eth = 0;
	var calc_B_G_btc_bch = 0;
	var calc_B_G_btc_ltc = 0;

	//B_G_LTC
	var calc_B_G_ltc_btc = 0;
	var calc_B_G_ltc_eth = 0;
	var calc_B_G_ltc_bch = 0;

	//B_G_BCH
	var calc_B_G_bch_btc = 0;
	var calc_B_G_bch_ltc = 0;
	var calc_B_G_bch_eth = 0;

	function coin_deet(name, price, exchange){
		this.name = name;
		this.price = price;
		this.exchange = exchange;
	}

	var apiArray = [];

	async.waterfall([
		function(done){
			priceModel.getAllDbData(function(err, result){
				if(err){
					done(err);
				}else{
					//console.log(result)
					done(null, result);
				}
			})
		}, function(array, done){
			array.forEach(function(element){
				
				if(element['exchange_name'] == "gdax"){
					gdaxApi(element['coin_short_form'], function(err, result){
						//console.log(element['coin_short_form'] + ' is at gadx for a price of ' + result);
						var coinDeet = new coin_deet(element["coin_name"], result, element["exchange_name"]);
						apiArray.push(coinDeet)
						//console.log(apiArray);
						if(apiArray.length == array.length){
							done(null, apiArray);
						}
					})
				}else if(element['exchange_name'] == "binance"){
					binanceApi(element['coin_short_form'], function(err, result){
						//console.log(element['coin_short_form'] + ' is at binance at a price of ' + result);
						var coinDeet = new coin_deet(element["coin_name"], result, element["exchange_name"]);
						apiArray.push(coinDeet)
						//console.log(apiArray);
						if(apiArray.length == array.length){
							done(null, apiArray);
						}
					})
				}else{
					//bitsoapi logic would be added in here
				}

			})
		}, function(apiArray, done){
			console.log("FINAL");
			console.log(apiArray);
			apiArray.forEach(function(item){
				if(item["name"] == "Bitcoin"){
					//console.log(item);
					if( item["exchange"] == "gdax"){
						btc_gdax = item["price"];
					}else if(item["exchange"] == "binance"){
						btc_binance = item["price"];
					}else{

					}
				}else if (item["name"] == "Ethereum"){
					if( item["exchange"] == "gdax"){
						eth_gdax = item["price"];
					}else if(item["exchange"] == "binance"){
						eth_binance = item["price"];
					}else{

					}
				}else if (item["name"] == "Litecoin"){
					if( item["exchange"] == "gdax"){
						ltc_gdax = item["price"];
					}else if(item["exchange"] == "binance"){
						ltc_binance = item["price"];
					}else{

					}
				}else if (item["name"] == "BitcoinCash"){
					if( item["exchange"] == "gdax"){
						bch_gdax = item["price"];
					}else if(item["exchange"] == "binance"){
						bch_binance = item["price"];
					}else{

					}
				}else{

				}
			})
			if(btc_gdax != 0 && btc_binance != 0 && ltc_binance != 0 && ltc_gdax != 0 && eth_binance != 0 && eth_gdax != 0 && bch_binance != 0 && bch_gdax != 0){
				done(null, apiArray);
			}
		}, function(apiArray, done) {
			// console.log(btc_gdax + " btc_gdax");
			// console.log(btc_binance + " btc_binance");
			// console.log(ltc_gdax + " ltc_gdax");
			// console.log(ltc_binance+ " ltc_binance");
			// console.log(bch_gdax + " bch_gdax");
			// console.log(bch_binance+ " bch_binance");
			// console.log(eth_gdax + " eth_gdax");
			// console.log(eth_binance + " eth_binance");
			btc_gdax_binance = ((btc_binance/btc_gdax) - 1)*100;
			ltc_gdax_binance = ((ltc_binance/ltc_gdax) - 1)*100;
			bch_gdax_binance = ((bch_binance/bch_gdax) - 1)*100;
			eth_gdax_binance = ((eth_binance/eth_gdax) - 1)*100;

			btc_binance_gdax = ((btc_gdax/btc_binance) - 1)*100;
			ltc_binance_gdax = ((ltc_gdax/ltc_binance) - 1)*100;
			bch_binance_gdax = ((bch_gdax/bch_binance) - 1)*100;
			eth_binance_gdax = ((eth_gdax/eth_binance) - 1)*100;

			if(btc_gdax_binance != 0 && ltc_gdax_binance != 0 && bch_gdax_binance != 0 && eth_gdax_binance != 0 && btc_binance_gdax != 0 && ltc_binance_gdax != 0 && bch_binance_gdax != 0 && eth_binance_gdax != 0){
				done(null, apiArray);
			}
		}, function(apiArray, done) {
			//GDAX - BINANCE
			//ETH
			calc_G_B_eth_btc = eth_gdax_binance + btc_binance_gdax;
			calc_G_B_eth_ltc = eth_gdax_binance + ltc_binance_gdax;
			calc_G_B_eth_bch = eth_gdax_binance + bch_binance_gdax;

			//BTC
			calc_G_B_btc_eth = btc_gdax_binance + eth_binance_gdax;
			calc_G_B_btc_bch = btc_gdax_binance + bch_binance_gdax;
			calc_G_B_btc_ltc = btc_gdax_binance + ltc_binance_gdax;

			//LTC
			calc_G_B_ltc_btc = ltc_gdax_binance + btc_binance_gdax;
			calc_G_B_ltc_eth = ltc_gdax_binance + eth_binance_gdax;
			calc_G_B_ltc_bch = ltc_gdax_binance + bch_binance_gdax;

			//BCH
			calc_G_B_bch_btc = bch_gdax_binance + btc_binance_gdax;
			calc_G_B_bch_ltc = bch_gdax_binance + ltc_binance_gdax;
			calc_G_B_bch_eth = bch_gdax_binance + eth_binance_gdax;


			//BINANCE - GDAX
			//ETH
			calc_B_G_eth_btc = eth_binance_gdax + btc_gdax_binance;
			calc_B_G_eth_ltc = eth_binance_gdax + ltc_gdax_binance;
			calc_B_G_eth_bch = eth_binance_gdax + bch_gdax_binance;

			//BTC
			calc_B_G_btc_eth = btc_binance_gdax + eth_gdax_binance;
			calc_B_G_btc_bch = btc_binance_gdax + bch_gdax_binance;
			calc_B_G_btc_ltc = btc_binance_gdax + ltc_gdax_binance;

			//LTC
			calc_B_G_ltc_btc = ltc_binance_gdax + btc_gdax_binance;
			calc_B_G_ltc_eth = ltc_binance_gdax + eth_gdax_binance;
			calc_B_G_ltc_bch = ltc_binance_gdax + bch_gdax_binance;

			//BCH
			calc_B_G_bch_btc = bch_binance_gdax + btc_gdax_binance;
			calc_B_G_bch_ltc = bch_binance_gdax + ltc_gdax_binance;
			calc_B_G_bch_eth = bch_binance_gdax + eth_gdax_binance;


			if(calc_G_B_eth_btc != 0 && calc_G_B_eth_ltc != 0 && calc_G_B_eth_bch != 0 && calc_G_B_btc_eth != 0 && calc_G_B_btc_bch != 0 && calc_G_B_btc_ltc != 0 && calc_G_B_ltc_btc != 0 && calc_G_B_ltc_bch != 0 && calc_G_B_ltc_eth != 0 && calc_G_B_bch_btc != 0 && calc_G_B_bch_ltc != 0 && calc_G_B_bch_eth != 0){
				if(calc_B_G_eth_btc != 0 && calc_B_G_eth_ltc != 0 && calc_B_G_eth_bch != 0 && calc_B_G_btc_eth != 0 && calc_B_G_btc_bch != 0 && calc_B_G_btc_ltc != 0 && calc_B_G_ltc_btc != 0 && calc_B_G_ltc_bch != 0 && calc_B_G_ltc_eth != 0 && calc_B_G_bch_btc != 0 && calc_B_G_bch_ltc != 0 && calc_B_G_bch_eth != 0){
					done(null, apiArray);
				}
			}
		}, function(apiArray, done) {
			var date = new Date();
			var timeStamp = date.getTime();
			priceModel.enterGBTimeStampAndGetID(timeStamp,function (err, result){
				if(err){
					callback(err);
				}else{
					var GBID = result;
					done(null, apiArray, GBID);
				}
			})
		}, function(apiArray,GBID, done) {
			var date = new Date();
			var timeStamp = date.getTime();
			priceModel.enterBGTimeStampAndGetID(timeStamp,function (err, result){
				if(err){
					callback(err);
				}else{
					var BGID = result;
					done(null, apiArray, GBID, BGID);
				}
			})
		}, function(apiArray, GBID, BGID, done){
			console.log(GBID);
			console.log(BGID);
			priceModel.enterdetails(GBID,"eth_btc",calc_G_B_eth_btc, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		}, function(apiArray, GBID, BGID, done){
			priceModel.enterdetails(GBID,"eth_ltc",calc_G_B_eth_ltc, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		}, function(apiArray, GBID, BGID, done){
			priceModel.enterdetails(GBID,"eth_bch",calc_G_B_eth_bch, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		}, function(apiArray, GBID, BGID, done){
			priceModel.enterdetails(GBID,"btc_eth",calc_G_B_btc_eth, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		}, function(apiArray, GBID, BGID, done){
			priceModel.enterdetails(GBID,"btc_bch",calc_G_B_eth_bch, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		}, function(apiArray, GBID, BGID, done){
			priceModel.enterdetails(GBID,"btc_ltc",calc_G_B_btc_ltc, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		},function(apiArray, GBID, BGID, done){
			priceModel.enterdetails(GBID,"ltc_btc",calc_G_B_ltc_btc, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		}, function(apiArray, GBID, BGID, done){
			priceModel.enterdetails(GBID,"ltc_bch",calc_G_B_ltc_bch, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		}, function(apiArray, GBID, BGID, done){
			priceModel.enterdetails(GBID,"ltc_eth",calc_G_B_ltc_eth, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		},function(apiArray, GBID, BGID, done){
			priceModel.enterdetails(GBID,"bch_btc",calc_G_B_bch_btc, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		}, function(apiArray, GBID, BGID, done){
			priceModel.enterdetails(GBID,"bch_ltc",calc_G_B_bch_ltc, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		}, function(apiArray, GBID, BGID, done){
			priceModel.enterdetails(GBID,"bch_eth",calc_G_B_bch_eth, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		}, function(apiArray, GBID, BGID, done){
			console.log(GBID);
			console.log(BGID);
			priceModel.enterdetails(BGID,"eth_btc",calc_B_G_eth_btc, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		}, function(apiArray, GBID, BGID, done){
			priceModel.enterdetails(BGID,"eth_ltc",calc_B_G_eth_ltc, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		}, function(apiArray, GBID, BGID, done){
			priceModel.enterdetails(BGID,"eth_bch",calc_B_G_eth_bch, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		}, function(apiArray, GBID, BGID, done){
			priceModel.enterdetails(BGID,"btc_eth",calc_B_G_btc_eth, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		}, function(apiArray, GBID, BGID, done){
			priceModel.enterdetails(BGID,"btc_bch",calc_B_G_btc_bch, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		}, function(apiArray, GBID, BGID, done){
			priceModel.enterdetails(BGID,"btc_ltc",calc_B_G_btc_ltc, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		},function(apiArray, GBID, BGID, done){
			priceModel.enterdetails(BGID,"ltc_btc",calc_B_G_ltc_btc, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		}, function(apiArray, GBID, BGID, done){
			priceModel.enterdetails(BGID,"ltc_bch",calc_B_G_ltc_bch, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		}, function(apiArray, GBID, BGID, done){
			priceModel.enterdetails(BGID,"ltc_eth",calc_B_G_ltc_eth, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		},function(apiArray, GBID, BGID, done){
			priceModel.enterdetails(BGID,"bch_btc",calc_B_G_bch_btc, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		}, function(apiArray, GBID, BGID, done){
			priceModel.enterdetails(BGID,"bch_ltc",calc_B_G_bch_ltc, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		}, function(apiArray, GBID, BGID, done){
			priceModel.enterdetails(BGID,"bch_eth",calc_B_G_bch_eth, function(err, result){
				if(err){
					callback(err);
				}else{
					done(null, apiArray, GBID, BGID);
				}
			})
		},
		function(apiArray, GBID, BGID, done){
			priceModel.deleteDataFromADay(function(err, result){
				if(err){
					callback(err);
				}else{
					if(result==true){
						console.log('API UPDATED and DB cleaned');
					}else{
						console.log('There was an issue');
					}
				}
			})
		}
	], function(err){
		console.log('There was an error');
	})
}

function gdaxApi(symbol, cb){
	var newURL = 'https://api.gdax.com/products/'+symbol+'/ticker';
	var options = {
	  	url: newURL,
	  headers: {
	    'User-Agent': 'request'
	  }
	};
 
	function callback(error, response, body) {
	  if (!error && response.statusCode == 200) {
	    var info = JSON.parse(body);
	    //console.log(info['price']);
	    cb(null, info['price']);
	  }
	}
	request(options, callback);
}

function binanceApi(symbol, cb){
	var newURL = 'https://api.binance.com/api/v1/ticker/price?symbol='+symbol;
	var options = {
	  	url: newURL,
	  headers: {
	    'User-Agent': 'request'
	  }
	};
 
	function callback(error, response, body) {
	  if (!error && response.statusCode == 200) {
	    var info = JSON.parse(body);
	    //console.log(info['price']);
	    cb(null, info['price']);
	  }
	}
	request(options, callback);
}

function bitsoApi(symbol, cb){
	var newURL = 'https://api.bitso.com/v3/ticker/';
	var options = {
	  	url: newURL,
	  headers: {
	    'User-Agent': 'request'
	  }
	};
 
	function callback(error, response, body) {
	  if (!error && response.statusCode == 200) {
	    var info = JSON.parse(body);
	    console.log(info);
	    var payload = info['payload'];
	    payload.find(function(element){
	    	if(element['book'] == symbol){
	    		//console.log(element['last']);
				cb(null, element['last']);
	    	}
	    })
	  }
	}
	request(options, callback);
}

exports.getApiInfo = function(req, res){
	var cycle_name = req.params.cycle;
	console.log(cycle_name);
	var cycleID;

	function resultArray(name, time, prices){
		this.name = name;
		this.time = time;
		this.prices = prices;
	}

	var apiArray = [];

	async.waterfall([
		function(cb){
			if(cycle_name == "gdaxbinance"){
				cycleID = 1;
				cb();
			}else if(cycle_name == "binancegdax"){
				cycleID = 2;
				cb();
			}else{
				res.send({"status":"400","reason":"cycle not given"});
			}
		},
		function(cb){
			priceModel.getCycleSpecificInfo(cycleID, function(err, result){
				if(err){
					cb(err);
				}else{
					cb(null, result);
				}
			})
		}, function(array, cb){
			if(array.length > 0){
				var completion = array.length;
				array.forEach(function(item){
					priceModel.getCycleSpecificDetailInfo(item['id'], function(err, result){
						if(err){
							cb(err);
						}else{
							var rez = new resultArray(cycle_name, item['cycle_time'], result);
							apiArray.push(rez)
							completion--;
							if(completion == 0){
								cb(null, apiArray);
							}
						}
					})
				})
			}else{
				res.send({"status":"401","reason":"no data available"});
			}
		}, function(array, cb){

			console.log('Smooth');
			res.send({"status":"200","data":array});
		}
	], function(err){
		console.log('There was an error in the getApiInfo method');
		res.send({"status":"500","reason":"error in getApiInfo method, report to dev"});
	})
}