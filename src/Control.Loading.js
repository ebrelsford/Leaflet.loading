/*
 * L.Control.Loading is a control that shows a loading indicator when tiles are
 * loading or when map-related AJAX requests are taking place.
 */
L.Control.Loading = L.Control.extend({
    options: {
        position: 'topleft',
        separate: false,
    },

    initialize: function(options) {
        L.setOptions(this, options);
        this._dataLoaders = 0;
    },

    onAdd: function(map) {
        // Create the loading indicator
        var classes = 'leaflet-control-loading';
        var container;
        if (map.zoomControl && !this.options.separate) {
            // If there is a zoom control, hook into the bottom of it
            container = map.zoomControl._container;
        }
        else {
            // Otherwise, create a container for the indicator
            container = L.DomUtil.create('div', 'leaflet-control-zoom');
        }
        if (!this.options.separate) {
            // If a separate control hasn't been requested, style like the zoom control
            classes += ' leaflet-bar-part last leaflet-bar-part-bottom';
        }
        this._indicator = L.DomUtil.create('a', classes, container);
        return container;
    },

    addLoader: function() {
        // Add to the loaders we are tracking
        this._dataLoaders++;

        // If there are some loaders, show the indicator
        if (this._dataLoaders > 0) {
            this._showIndicator();
        }
    },

    removeLoader: function() {
        // Subtract from the loaders we are tracking
        this._dataLoaders--;

        // If there are no loaders left, remove the indicator
        if (this._dataLoaders <= 0) {
            // If there is a mismatch don't let the number of loaders
            // become negative
            this._dataLoaders = 0;
            this._hideIndicator();
        }
    },

    _showIndicator: function() {
        // Show loading indicator
        L.DomUtil.addClass(this._indicator, 'is-loading');

        // If map.zoomControl exists, make the zoom-out button not last
        if (this._map.zoomControl && !this.options.separate) {
            L.DomUtil.removeClass(this._map.zoomControl._zoomOutButton, 'leaflet-bar-part-bottom');
        }
    },

    _hideIndicator: function() {
        // Hide loading indicator
        L.DomUtil.removeClass(this._indicator, 'is-loading');

        // If map.zoomControl exists, make the zoom-out button last
        if (this._map.zoomControl && !this.options.separate) {
            L.DomUtil.addClass(this._map.zoomControl._zoomOutButton, 'leaflet-bar-part-bottom');
        }
    },

});

L.Map.addInitHook(function () {
    if (!this.options.loadingControl) return;

    // Create and add the control to the map
    this.loadingControl = L.Control.loading();
    this.addControl(this.loadingControl);

    // When a layer is added to the map, add listeners for begin and end
    // of load
    this.on('layeradd', function(e) {
        e.layer.on({
            loading: function(e) {
                this._map.loadingControl.addLoader();
            },
            load: function(e) {
                this._map.loadingControl.removeLoader();
            },
        });
    });

    // Add listeners to the map for (custom) dataloading and dataload
    // events, eg, for AJAX calls that affect the map but will not be
    // reflected in the above layer events.
    this.on({
        dataloading: function(e) {
            this.loadingControl.addLoader();
        },
        dataload: function(e) {
            this.loadingControl.removeLoader();
        },
    });
});

L.Control.loading = function(options) {
    return new L.Control.Loading(options);
};
