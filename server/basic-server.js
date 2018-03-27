var Request = require('./request-handler.js')
var fs = require('fs');
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');


var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var headers = defaultCorsHeaders;

var app = express();
/* Import node's http module: */
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
//TODO: write some test data

var idCounter = 0;

// Every server needs to listen on a port with a unique number. The
// standard port for HTTP servers is port 80, but that port is
// normally already claimed by another server and/or not accessible
// so we'll use a standard testing port like 3000, other common development
// ports are 8080 and 1337.
var port = 3000;

// For now, since you're running this server on your local machine,
// we'll have it listen on the IP address 127.0.0.1, which is a
// special address that always refers to localhost.
var ip = '127.0.0.1';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var getHandler = function(req, res){
  fs.readFile('./server/dataMessage.txt', function(err, data){
    if(err){
      console.log(err);
    } else {
      res.status(200);
      console.log(res);
      res.type('json');
      res.set(headers);
      responseObj = data.toString();
      responseObj = '{"results":['+responseObj+']}';
      res.send(responseObj);
    }
  })
}; 



app.get('/classes/messages', getHandler);


app.options('/classes/messages', function(req, res){
    res.status(200);
    res.type('text');
    headers['allow'] = 'GET, POST, OPTIONS'
    res.set(headers);
    res.send();
});


app.post('/classes/messages', function(req, res){
    var messageObj = req.body;
    messageObj.objectId = ++idCounter;
    messageObj = ',' + JSON.stringify(messageObj)
    fs.appendFile('./server/dataMessage.txt', messageObj, function(err){
    if(err){
      console.log(err);
    }})
    res.status(201);
    res.type('text');
    res.set(headers);
    res.send();
})



// We use node's http module to create a server.
//
// The function we pass to http.createServer will be used to handle all
// incoming requests.
//
// After creating the server, we will tell it to listen on the given port and IP. */
// var server = http.createServer(Request.requestHandler);
// console.log('Listening on http://' + ip + ':' + port);
// server.listen(port, ip);

// To start this server, run:
//
//   node basic-server.js
//
// on the command line.
//
// To connect to the server, load http://127.0.0.1:3000 in your web
// browser.
//
// server.listen() will continue running as long as there is the
// possibility of serving more requests. To stop your server, hit
// Ctrl-C on the command line.

exports.getHandler = getHandler;