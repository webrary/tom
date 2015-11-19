/**
 * @project bootcamp-gulp-express
 * Created by ming on 2015-11-11.
 */

var express = require('express');
var router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// respond with "Hello World!" on the homepage
router.get('/', function(req, res) {
  res.send('Hello World!');
});

// accept POST request on the homepage
router.post('/', function(req, res) {
  res.send('Got a POST request');
});

module.exports = router;
