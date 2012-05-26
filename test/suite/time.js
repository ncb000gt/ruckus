var assert = require('assert'),
    testutils = require('../utils'),
    loader = require('../../lib/loader'),
    fire = require('../../lib/fire');

var server = null;
var host = null;
var port = null;

describe('responses', function() {

  beforeEach(function(done) {
    testutils.server(function(_server, _host, _port) {
      server = _server;
      host = _host;
      port = _port;
      done();
    });
  });

  afterEach(function(done) {
    server.close();
    loader.clear();
    done();
  });

  it('with 1 concurrent request', function(done) {
    var _suite = {
      '/': {
        maxConcurrent: 1,
        verbose: false,
        total: 10,
        url: function() {
          return 'http://' + host + ':' + port + '/';
        },
        cb: function(stats) {
          assert.equal(stats.total, 10);
          assert.ok((stats.totalMS/stats.total) > stats.avg);
          done();
        }
      }
    };

    loader.load('single-concurrent', _suite);
    loader.each(fire.run);
  });

  it('with 5 concurrent request', function(done) {

    var _suiteC = {
      '/': {
        verbose: false,
        total: 10,
        url: function() {
          return 'http://' + host + ':' + port + '/';
        },
        cb: function(statsC) {
          assert.equal(statsC.total, 10);
          var c = (statsC.totalMS/statsC.total);
          assert.ok(c < statsC.avg);

          var _suiteS = {
            '/': {
              maxConcurrent: 1,
              verbose: false,
              total: 10,
              url: function() {
                return 'http://' + host + ':' + port + '/';
              },
              cb: function(statsS) {
                assert.equal(statsS.total, 10);
                var s = (statsS.totalMS/statsS.total);
                assert.ok(s > statsS.avg);
                assert.ok(s > c);
                done();
              }
            }
          };

          loader.clear();
          loader.load('single-concurrent', _suiteS);
          loader.each(fire.run);
        }
      }
    };

    loader.load('concurrent', _suiteC);
    loader.each(fire.run);
  });
});
