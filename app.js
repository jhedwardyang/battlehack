
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var test = require('./routes/test');
var supplier = require('./routes/supplier');
var distributor = require('./routes/distributor');
var analysis = require('./routes/analysis');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.use('/', express.static(path.join(__dirname, '../public')));

app.post('/test', test.test);

app.post('/supplier/new', supplier.insert);
app.post('/distributor/new', distributor.insert);
app.post('/analysis/cluster', analysis.cluster);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
