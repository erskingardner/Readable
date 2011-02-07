var  sys         = require('sys')
    ,http        = require('http')
    ,url         = require('url')
    ,req         = require('request')
    ,jsdom       = require('jsdom')
    ,events      = require('events')
    ,readability = require('../vendor/readability/lib/readability');

var emitter = new events.EventEmitter();

function Readable(options) {
  if (! (this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }
  var self = this;
  
  self.settings = {
    port: options.port
  };
  
  self.init();
};

Readable.prototype.init = function() {
  var self = this;
  self.httpServer = self.createHTTPServer();
  self.httpServer.listen(self.settings.port);
  sys.log('Server started on PORT ' + self.settings.port);
};

Readable.prototype.createHTTPServer = function() {
  var self = this;
  
  var server = http.createServer(function(request, response) {  
    request.addListener('end', function() {
      var  location  = url.parse(request.url, true)
          ,params    = (location.query || request.headers)
          ,body      = "";
      
      if (location.pathname == '/' && request.method == "GET"){
        if (params["url"] != null){
          self.fetchAndParse(params["url"]);
        }
        var listener = emitter.addListener("readability", function(result) {
          response.writeHead(200, {
            'Content-Type': 'text/html'
          });
          if (result == "error"){
            response.end("error");
          } else {
            response.end(result.content);          
          }
        });
      }
    });
  });
  
  return server
};

Readable.prototype.fetchAndParse = function(url) {
  var self = this;
  
  var fetched = req({uri: url}, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      readability.parse(body, '', function(result) {
        emitter.emit("readability", result);
      });
    } else {
      var result = "error";
      emitter.emit("readability", result);
    }
  });
};

module.exports = Readable;