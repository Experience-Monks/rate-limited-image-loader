# rate-limited-image-loader

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Will load a series of images while adhering to rate limits.

## Example
```javascript
// the following will create a loader 
// which will load 2 images every 1000 milliseconds
var loader = require('rate-limited-image-loader')(2, 1000);

var images = [
    'imageURL.jpg', 'imageURL.png', 'imageURL1.jpg', 'imageURL1.png'
];

// Load in images.
// The api is based around https://github.com/Jam3/async-image-loader
loader(images, function(images) {
    images.forEach( function(image) {
        document.body.appendChild(image);
    });
})
.on('progress', function(info) {
    console.log('percentage loaded:', info.count / info.total);
});
```

## Install

```sh
npm install rate-limited-image-loader --save
```

## Usage

[![NPM](https://nodei.co/npm/rate-limited-image-loader.png)](https://www.npmjs.com/package/rate-limited-image-loader)

#### `loader = require('rate-limited-image-loader')(imagesToLoad, milliseconds)`

Returns a function which can be used to load images. This loader function is based on the module `async-image-loader`. The difference being the image load will be rate limited. `imagesToLoad` is the count of images that can be loaded in `milliseconds`.

For instance with the Google Maps Image API you can load 50 images per minute your loader would be constructed like this:
```javascript
// loader to load 50 images per minute
var loader = require('rate-limited-image-loader')(50, 60 * 1000);
```

#### `emitter = loader(urls, [opt], [cb])`

Starts loading the specified `urls`. Elements in the `urls` array can either be strings, or objects containing `{ url }`.

The `opt` settings can be:

- `crossOrigin` the CORS setting for image loading (default undefined)
- `defaultImage` the fallback Image to use when a load 404s (default null) 

On complete, `cb` is called with an array of HTMLImageObjects as the first paramter (same order as input). Any images not found will be replaced with `defaultImage`, or null.

#### `emitter.on('progress', fn)`

Each resource will trigger a `progress` event when it completes loading, or when it fails. The function is passed an `event` parameter:

```js
{
  total: Number        // total # of images,  N
  count: Number        // # of loaded images, [ 1 .. N ]
  image: Image         // loaded image element, or defaultImage
  data:  String|Object // the value provided in the input array
}
```

Since the loading is done in parallel, the order is not the same as the input. This event will be triggered regardless of whether the `image` resource loaded successfully, so `image` may be null.

Here, `ev.data` is the same element that was given in the input array, either a string URL or the object containing `{ url }`.

#### `emitter.on('not-found', fn)`

Emitted for each resource that cannot be loaded (i.e. 404). The passed value is the `data` that was unable to load; either a String or `{ url }` object depending on what was passed to input.

This is emitted before the `progress` event.


## License

MIT, see [LICENSE.md](http://github.com/Jam3/rate-limited-image-loader/blob/master/LICENSE.md) for details.
