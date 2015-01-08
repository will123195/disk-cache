# disk-cache

Simple disk caching - cache strings to files on disk

## Installation

```
npm install disk-cache
```

## Methods

### cache.get(key, [ttl], cb)
### cache.set(key, value, cb)

## Usage

```js
var cache = require('disk-cache')({
  path: './cache/' + Math.random()
})

var key = 'some/file.txt'
var value = 'abc123'
cache.set(key, value, function(err) {

  var ttl = 60 * 60 // 1 hour
  cache.get(key, ttl, function(err, val) {

    if (err.notFound) {
      // this value is not cached or has expired
      return
    }

    console.log(val) // abc123
  })
})
```