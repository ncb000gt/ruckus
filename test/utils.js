var http = require('http'),
    scan = require('portscan');

module.exports.server = function(cb) {
  scan(9000, {
    success: function(host, port) {
      var server = http.createServer(function(req, res) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello World\n');
      });
      server.listen(port);
      if (cb) cb(server, host, port);
    },
    findOne: true,
    findActive: false
  });
}
