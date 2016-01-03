import {fork} from 'child_process'
import path from 'path'
import minimist from 'minimist'
import Promise from 'bluebird'

var init = Promise.resolve()
var opts = minimist(process.execArgv)
var forkOpts = {silent: false}
if (['debug', 'debug-brk'].some(opt => opt in opts)) {
  init = init
    .then(require('get-random-port'))
    .then(port => { forkOpts.execArgv = [`--debug=${port}`] })
    .return(null)
}

export default function spawn () {
  return spawn.promise = spawn.promise.then(client => {
    if (client && client.dontRespawn) return client.kill()
    var oldMessageListeners = client ? client.listeners('message') : []
    client = fork(path.join(__dirname, 'server.js'), forkOpts)
    client.setMaxListeners(100)
    client.on('exit', spawn)
    oldMessageListeners.forEach(client.on.bind(client, 'message'))
    return client
  })
}
spawn.promise = init

spawn.buckets = 0
spawn.getBucket = () => { return spawn.buckets++ }
