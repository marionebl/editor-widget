'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = spawn;

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var init = _bluebird2.default.resolve();
var opts = (0, _minimist2.default)(process.execArgv);
var forkOpts = { silent: false };
if (['debug', 'debug-brk'].some(function (opt) {
  return opt in opts;
})) {
  init = init.then(require('get-random-port')).then(function (port) {
    forkOpts.execArgv = ['--debug=' + port];
  }).return(null);
}

function spawn() {
  return spawn.promise = spawn.promise.then(function (client) {
    if (client && client.dontRespawn) return client.kill();
    var oldMessageListeners = client ? client.listeners('message') : [];
    client = (0, _child_process.fork)(_path2.default.join(__dirname, 'server.js'), forkOpts);
    client.setMaxListeners(100);
    client.on('exit', spawn);
    oldMessageListeners.forEach(client.on.bind(client, 'message'));
    return client;
  });
}
spawn.promise = init;

spawn.buckets = 0;
spawn.getBucket = function () {
  return spawn.buckets++;
};