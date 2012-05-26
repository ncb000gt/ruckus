var testutils = require('../utils'),
    assert = require('assert'),
    loader = require('../../lib/loader'),
    fire = require('../../lib/fire');

var server = null;
var host = null;
var port = null;

describe('ruckus', function() {
  beforeEach(function(done) {
    loader.clear();
    testutils.server(function(_server, _host, _port) {
      server = _server;
      host = _host;
      port = _port;
      done();
    });
  });

  it('should load the object', function(done) {
    var _suite = {
      '/': {
        verbose: false,
        total: 10,
        url: function() {
          return 'http://' + host + ':' + port + '/';
        }
      }
    };

    loader.load('basic-hit', _suite);

    loader.each(function(suite) {
      assert.equal(suite.name, 'basic-hit');
      assert.deepEqual(suite.module, _suite);
      done();
    });
  });

  it('should load the path', function(done) {
    var _suite = {
      '/': {
        verbose: false,
        total: 10,
        url: function() { return 'http://localhost/'; }
      }
    };

    var dir = __dirname + '/../requests/basic-hits.js';
    loader.load(dir);

    loader.each(function(suite) {
      assert.equal(suite.name, dir);
      assert.ok(suite.module.toString() === _suite.toString());
      done();
    });
  });

  it('should hit the test server with 10 requests', function(done) {
    var suite = {
      '/': {
        verbose: false,
        total: 10,
        url: function() {
          return 'http://' + host + ':' + port + '/';
        },
        cb: function(stats) {
          assert.equal(stats.total, 10);
          done();
        }
      }
    };

    loader.load('basic-hit', suite);
    loader.each(fire.run);
  });
});
