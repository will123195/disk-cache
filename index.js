var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var moment = require('moment')
var callerPath = require('caller-path')

var cache = module.exports = function cache(opts) {
  opts = opts || {}
  if (!opts.pwd) {
    opts.pwd = path.dirname(callerPath())
  }

  if (!(this instanceof cache)) {
    return new cache(opts)
  }

  // default to caller path
  opts.path = opts.path || opts.pwd
  // if absolute path not specified
  if (opts.path.slice(0, 1) !== path.sep) {
    opts.path = path.normalize(opts.pwd + path.sep + opts.path)
  }
  // make sure the path specified ends with /
  if (opts.path.slice(-1) !== path.sep) {
    opts.path += path.sep
  }

  this.opts = opts

}

cache.prototype.set = function(key, value, cb) {
  var filename = this.opts.path + key
  var dir = path.dirname(filename)
  mkdirp(dir, function(err) {
    if (err) return cb(err)
    fs.writeFile(filename, value, cb)
  })
}

cache.prototype.get = function(key, ttl, cb) {
  if (typeof ttl === 'function') {
    cb = ttl
    ttl = 0
  }
  var filename = this.opts.path + key
  if (!ttl) {
    return fs.readFile(filename, done)
  }
  fs.stat(filename, function(err, stat) {
    if (err) return cb(err)
    var filetime = moment(stat.mtime).format('X')
    var now = moment().format('X')
    if (filetime + ttl < now) {
      return notFound()
    }
    fs.readFile(filename, done)
  })

  function done(err, value) {
    if (err && err.errno === 34) {
      return notFound()
    }
    cb(err, value)
  }

  function notFound() {
    var err = new Error('Key "' + key + '" not found.')
    err.notFound = true
    return cb(err)
  }
}