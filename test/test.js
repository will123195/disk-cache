var ok = require('assert').ok
var DiskCache = require('..')
var cache = DiskCache({
  path: './cache/' + Math.random()
})

it('should cache to disk', function(done) {
  var key = 'some/file.txt'
  var value = 'abc123'
  cache.set(key, value, function(err) {
    ok(!err, err)
    cache.get(key, function(err, val) {
      ok(!err, err)
      ok(val == value, 'value mismatch')
      done()
    })
  })
})

it('should not return expired cache value', function(done) {
  var key = 'some/file.txt'
  var value = 'abc123'
  var ttl = 1
  cache.set(key, value, function(err) {
    ok(!err, err)
    setTimeout(function() {
      cache.get(key, ttl, function(err, val) {
        ok(err && err.notFound, 'expired value was found')
        done()
      })
    }, 1100)
  })
})

it('should not find non-existent key', function(done) {
  var key = 'some/non-existent/file.txt'
  cache.get(key, function(err, val) {
    ok(err && err.notFound, 'non-existent value was found')
    done()
  })
})