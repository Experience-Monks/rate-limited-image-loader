var loader = require('async-image-loader');
var EventEmitter = require('events').EventEmitter;
var raf = require('raf');

module.exports = function getRateLimitedImageLoader(countImages, milliseconds) {

  return function rateLimitedImageLoader(images, options, callback) {

    if(typeof options === 'function') {
      callback = options;
      options = undefined;
    }

    var emitter = new EventEmitter();
    var queu = images.slice();
    var countLoads = Math.ceil(images.length / countImages);
    var countLoaded = 0;
    var totalCount = images.length;
    var loadedImages = [];
    var loadStartTime = 0;

    var doLoad = function() {

      // if we can load now go for it
      if(Date.now() - loadStartTime > milliseconds) {

        loadStartTime = Date.now();

        loader(queu.splice(0, countImages), options, function(images) {

          loadedImages = loadedImages.concat(images);

          if(queu.length > 0) {

            doLoad();
          } else {

            callback(loadedImages);
          }
        })
        .on('progress', function(info) {

          countLoaded++;

          info.total = totalCount;
          info.count = countLoaded;

          emitter.emit('progress', info);
        })
        .on('not-found', function(info) {

          emitter.emit('not-found', info);
        });

      // we should attempt to load later
      } else {

        raf(doLoad);
      }
    };
    
    doLoad();

    return emitter;
  };
};