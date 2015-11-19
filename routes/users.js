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

// define the home page route
router.get('/', function(req, res) {
  res.send('Users home page');
});

// accept PUT request at /user
router.put('/', function(req, res) {
  res.send('Got a PUT request at /user');
});

// accept DELETE request at /user
router.delete('/', function(req, res) {
  res.send('Got a DELETE request at /user');
});

// define the about route

router.get('/about', function(req, res) {
  res.send('About users');
});

module.exports = router;