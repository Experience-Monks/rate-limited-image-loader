var RATE_LIMIT = 1000;
var COUNT_IMAGES = 5;

var loader = require('./..')(COUNT_IMAGES, RATE_LIMIT);
var baboonImageUri = require('baboon-image-uri');
var tape = require('tape');

var images = Array.apply(null, Array(15))
.map( function() {
  return baboonImageUri;
});

tape('test loading images', function(t) {

  var timeLoadStart = Date.now();

  var emitter = loader(images, function(images) {

    t.equal(images.length, 15, 'loaded 15 images');
    t.end();
  });

  emitter.on('progress', onProgressCheck1);
  emitter.on('progress', function(info) {
    document.body.appendChild(info.image);
  });

  function onProgressCheck1(info) {

    if(info.count > 5) {

      t.ok(Date.now() - timeLoadStart > RATE_LIMIT, 'Load 1 was rate limited');

      emitter.removeListener('progress', onProgressCheck1);

      timeLoadStart = Date.now();

      emitter.on('progress', onProgressCheck2);
    }  
  }

  function onProgressCheck2(info) {

    if(info.count > 10) {

      t.ok(Date.now() - timeLoadStart > RATE_LIMIT, 'Load 2 was rate limited');

      emitter.removeListener('progress', onProgressCheck2);
    }
  }
});