/**
 * @project bootcamp-gulp-express
 * Created by ming on 2015-11-11.
 */
var express = require('express');
var users = require('./routes/users');
var index = require('./routes/index');

var app = express();

app.use('/users', users);
app.use('/', index);

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
