require.paths.unshift(__dirname + '/vendor');

var Readable = require('./lib/readable');

new Readable({
  port: 8000
});