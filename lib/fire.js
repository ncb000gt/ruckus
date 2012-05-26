var request = require('request');

module.exports.run = function(suite) {
  var module = suite.module;
  for (var p in module) {
    test(suite.name, p, module[p]);
  }
}

function test(name, name, test) {
  var total = test.total || 50;
  var maxConcurrent = test.maxConcurrent || 5;
  var timeout = test.timeout || 10000;

  var completed = 0;
  var activeReqs = 0;
  var reqMS = 0;
  var _start = new Date().getTime();

  for (var i = total; i >= 0; i--) {
    var url = test.url(); //only requirement for the object
    makeReq(url);
  }

  function makeReq(url) {
    if (activeReqs == maxConcurrent) {
      setTimeout(function() { makeReq(url); }, 10);
    } else {
      activeReqs++;

      var start = new Date().getTime();
      request({url: url, timeout: timeout, pool: { maxSockets: 1000000 }}, function(err, req, body) {
        var end = new Date().getTime();
        reqMS += (end - start);
        //console.log((end - start));
        activeReqs--;

        if (++completed == total) {
          done(_start, end);
        }

        //console.log(' - ' + url);
        //console.log(body);
      });
    }
  }

  function done(s, e) {
    var totalMS = e - s;
    var avg = reqMS / total;
    if (test.verbose) {
      console.log(name);
      console.log(' - name: ' + name);
      console.log(' - total number of requests: ' + total);
      console.log(' - time for all requests (some concurrent): ' + totalMS + ' ms');
      console.log(' - avg: ' + avg + ' ms/req');
    }
    if (test.cb) {
      return test.cb({
        total: total,
        totalMS: totalMS,
        avg: avg
      });
    }
  }
}
