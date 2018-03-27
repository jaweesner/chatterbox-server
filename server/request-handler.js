/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var fs = require('fs');
var http = require('http');
//var messages = [];
var idCounter = 0;
var clientPath = "./client/chatter/client/"

var requestHandler = function(request, response) {

  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.

  //inheirited var messages.

  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var statusCode;
  var headers = defaultCorsHeaders;
  var responseObj = '';  
  //headers['Content-Type'] = 'default';
  //var baseUrl = request.url.split('?')[0];
  // if(baseUrl === "/"){
  //  fs.readFile( clientPath + "index.html", function (err, data) {
  //     if(err){
  //     console.log(err);
  //     }
  //     console.log(data);
      
  //     //response.writeHead(200, {'Content-Type': 'text/html'});
  //     response.write(data);
  //     response.end();
  //  });
  // }else if(baseUrl == "/scripts/app.js"){
  //   fs.readFile(clientPath + baseUrl, function (err, data) {
  //     if(err){
  //     console.log(err);
  //     }
  //     console.log(data);
      
  //     response.writeHead(200, {'Content-Type': 'application/javascript'});
  //     response.write(data);
  //     response.end();
  //  });


  // } else 
if (request.url.split('?')[0] !== '/classes/messages'){
    statusCode = 404; 
    response.writeHead(statusCode, headers);
    response.end(responseObj);
  } else if (request.method === 'GET'){
    // The outgoing status.
    fs.readFile('./server/dataMessage.txt', function(err, data){
      if(err){
        console.log(err);
      } else {
        // console.log(data);
            statusCode = 200;
    // See the note below about CORS headers.
    // Tell the client we are sending them plain text.
    //
    // You will need to change this if you are sending something
    // other than plain text, like JSON or HTML.
    headers['Content-Type'] = 'application/json';
    // response.on('error', (err) => {
    //   // This prints the error message and stack trace to `stderr`.
    //   console.log(err);
    // });
    responseObj = data.toString();
    responseObj = '{"results":['+responseObj+']}';
    console.log('responseObj' + responseObj);
    //JSON.stringify({results: messages});
    response.writeHead(statusCode, headers);
    response.end(responseObj);
      }
    }) 

 

  } else if (request.method === 'POST'){
    // The outgoing status.    
    //debugger;
    statusCode = 201;
    headers['Content-Type'] = 'text/plain';
    // See the note below about CORS headers.
    var body = [];
    request.on('error', (err) => {
    }).on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
    //   response.on('error', (err) => {
    // // This prints the error message and stack trace to `stderr`.
    //     console.log('responseError');
    //     console.error(err);
    //   });
      // Tell the client we are sending them plain text.
      //
      // You will need to change this if you are sending something
      // other than plain text, like JSON or HTML.
      var messageObj = JSON.parse(body)
      messageObj.objectId = ++idCounter;
      messageObj = ',' + JSON.stringify(messageObj)
      fs.appendFile('./server/dataMessage.txt', messageObj, function(err){
      if(err){
        console.log(err);
      }})
      response.writeHead(statusCode, headers);
      response.end(responseObj);
    });
  } else if (request.method === 'OPTIONS'){
    // The outgoing status.    
    statusCode = 200;
    // See the note below about CORS headers.
    headers['allow'] = 'GET, POST, OPTIONS'
    // Tell the client we are sending them plain text.
    //
    // You will need to change this if you are sending something
    // other than plain text, like JSON or HTML.
    headers['Content-Type'] = 'text/plain';
    // response.on('error', (err) => {
    //   // This prints the error message and stack trace to `stderr`.
    //   console.error(err);
    // });
    response.writeHead(statusCode, headers);
    response.end(responseObj);
  } else {
    statusCode = 405;
    response.writeHead(statusCode, headers);
    response.end(responseObj);
  }
  console.log(statusCode)
}


  

 
  // This prints the error message and stack trace to `stderr`.

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.


  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  // This prints the error message and stack trace to `stderr`.

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.


// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

module.exports.requestHandler = requestHandler;
