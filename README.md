Leaflet.loading
===============

Leaflet.loading is a simple loading control for [Leaflet][]. An unobtrusive
loading indicator is added below the zoom control if one exists. The indicator
is visible when tiles are loading or when other data is loading, as indicated by
firing custom events on a map. The indicator can be an image, or a [spin.js][]
spinner (image-less).


## Usage

Leaflet.loading is only tested on Leaflet version 0.6 or greater. It will almost
certainly not work with older versions of Leaflet. Of course we intend to
support Leaflet 1.0, and we have tested against the latest release (beta 2).
Please create an issue if you find that any part of this project is not
compatible with Leaflet 1.0.

Include `Control.Loading.js` and `Control.Loading.css`, then create a map with
`loadingControl: true` in its options.

By default, Leaflet.loading includes a base64-encoded animagted loading image in
`Control.Loading.css`. You can customize this by changing `background-image` for
the selector `.leaflet-control-loading`. The simplest case would be adding a 16
x 16 loading gif in `.leaflet-control-loading`.

You can also set `spinjs: true` in the options, and load [spin.js][] to use that
instead of an image. A spin.js options object can be passed as the spin key when
initializing the control.

Whichever method you use, make sure you only use one.

Once the above is complete you will have a loading indicator that only appears
when tiles are loading.

If you want to show the loading indicator while other AJAX requests or something
else is occurring, fire the `dataloading` event on your map when you begin
loading and `dataload` when you are finished loading. Please note that there is
[an issue](https://github.com/ebrelsford/Leaflet.loading/issues/26) with the
way this control tracks these events and that this will be re-worked in a
future version.

### Options

 - **position**: (string) Where you want the control to show up on the map (standard
   Leaflet control option). Optional, defaults to `topleft`
 - **separate**: (boolean) Whether the control should be separate from the zoom
   control or not, defaults to false.
 - **zoomControl**: (L.Control.Zoom) The zoom control that the control should be
   added to. This is only necessary when adding a loading control to a zoom
   control that you added manually and do not want a separate loading control.
 - **delayIndicator**: (float) The number of milliseconds to wait before
   showing the loading indicator. Defaults to `null` (no delay).
 - **spinjs**: (boolean) Enable the use of [spin.js][]. Optional, defaults to
   `false`
 - **spin**: (object) A [spin.js][] options object. Optional, defaults to

    ```
    {
        lines: 7,
        length: 3,
        width: 3,
        radius: 5,
        rotate: 13,
        top: "83%"
    }
    ```

### Usage with [`react-leaflet`](https://github.com/PaulLeCam/react-leaflet)

1. `npm install leaflet-loading`.
1. Add `import "leaflet-loading";` to the file containing [`MapContainer`](https://react-leaflet.js.org/docs/start-setup).
1. Add `@import "~leaflet-loading/src/Control.Loading.css"` to `index.scss`.
1. Add `loadingControl={true}` to `<MapContainer>` props.

If you're using **TypeScript** you will get an error:

```
Property 'loadingControl' does not exist on type 'IntrinsicAttributes & MapContainerProps'.  TS2322
```

Until [react-leaflet#847](https://github.com/PaulLeCam/react-leaflet/issues/847) is fixed you can work around with [`@ts-ignore`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html#suppress-errors-in-ts-files-using--ts-ignore-comments), eg:
```js
<MapContainer
  // @ts-ignore
  loadingControl={true}
>
```


## Demos

See Leaflet.loading in action (zoom or pan to make tiles load):

 - Using the [simplest setup][simple], with the loading indicator attached to
   the zoom control.
 - With the loading indicator [separate][] from the zoom control.
 - With the loading indicator and zoom control on the [top right][topright] of
   the map.
 - The [simplest example using spin.js](http://ebrelsford.github.io/Leaflet.loading/spinjs.html) instead of an image
 - Combined with a [fullscreen control][combined] (e.g. [leaflet.fullscreen][]).


## License

Leaflet.loading is free software, and may be redistributed under the MIT
License.


 [Leaflet]: https://github.com/Leaflet/Leaflet
 [spin.js]: https://github.com/fgnass/spin.js/
 [simple]: http://ebrelsford.github.io/Leaflet.loading/simple.html
 [separate]: http://ebrelsford.github.io/Leaflet.loading/separate.html
 [topright]: http://ebrelsford.github.io/Leaflet.loading/topright.html
 [combined]: http://ebrelsford.github.io/Leaflet.loading/combined.html
 [leaflet.fullscreen]: https://github.com/brunob/leaflet.fullscreen
