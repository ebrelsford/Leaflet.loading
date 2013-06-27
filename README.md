Leaflet.loading
===============

Leaflet.loading is a simple loading control for [Leaflet][]. An unobtrusive
loading indicator is added below the zoom control if one exists. The indicator
is visible when tiles are loading or when other data is loading, as indicated by
firing custom events on a map.


## Usage

Include `Control.Loading.js` and create a map with `loadingControl: true` in its
options. Then style your loading indicator. `Control.Loading.css` contains a 
start in this direction. The simplest case would be adding a 16 x 16 loading gif
in `.leaflet-control-loading`.

Once the above is complete you will have a loading indicator that only appears
when tiles are loading. 

If you want to show the loading indicator while other AJAX requests or something
else is occurring, simply fire the `dataloading` event on your map when you 
begin loading and `dataload` when you are finished loading. The control tracks 
the number of concurrent loaders, so it is your responsibility to ensure that 
the `dataloading` and `dataload` are called symmetrically.


## License

Leaflet.loading is free software, and may be redistributed under the MIT
License.


 [Leaflet]: https://github.com/Leaflet/Leaflet
