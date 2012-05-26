var fs = require('fs'),
    path = require('path');

var suites = [];

module.exports.clear = function() {
  suites = [];
}

//loading can be sync.
module.exports.loaddir = function(_path) {
  var stats = fs.lstatSync(_path);
  if (!stats) throw new Error('Path (' + _path + ') does not exist. Please specify an existing path.');
  if (!(stats.isDirectory())) throw new Error('Path (' + _path + ') is not a directory.');

  var files = fs.readdirSync(_path);

  var len = files.length;
  for (var i = 0; i < len; i++) {
    var fpath = _path + '/' + files[i];
    module.exports.load(fpath);
  }
}

function loadpath(_path) {
  var stats = fs.lstatSync(_path);
  if (!stats) throw new Error('Path (' + _path + ') does not exist. Please specify an existing path.');

  if (stats.isDirectory()) {
    module.exports.loaddir(_path);
  } else {
    if (_path.match(/\.js$/i)) {
      var suite = {
        name: _path,
        module: require(_path)
      }
      suites.push(suite);
    }
  }
}

function loadobj(name, obj) {
  suites.push({
    name: name,
    module: obj
  });
}

module.exports.load = function() {
  var loader = loadpath;
  if (arguments.length > 1) {
    loader = loadobj;
  }

  loader.apply(this, arguments);
}

module.exports.each = function(cb) {
  var len = suites.length;
  for (var i = 0; i < len; i++) {
    cb(suites[i]);
  }
}

module.exports.printSuites = function() {
  var len = suites.length;
  for (var i = 0; i < len; i++) {
    var suite = suites[i];
    console.log(suite.name);
    var module = suite.module;
    for (var p in module) {
      console.log(' - ' + p);
    }
  }
}
