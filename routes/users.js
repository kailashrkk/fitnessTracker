var express = require('express');
var router = express.Router();
var apiController = require('../controllers/v1/apiController.js');

/* GET users listing. */
router.get('/:cycle', function(req, res, next) {
  apiController.getApiInfo(req,res);
});

module.exports = router;
