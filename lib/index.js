var path = require('path'),
    loader = require('./loader'),
    fire = require('./fire');

if (!(process.argv[2])) throw new Error("Must specify a directory with your requests.");
var _path = process.argv[2];
if (_path[0].match(/[a-z0-9_-]/i)) _path = path.join(__dirname, _path);
loader.load(_path);

loader.each(fire.run);
