/*
 * L.Control.Loading is a control that shows a loading indicator when tiles are
 * loading or when map-related AJAX requests are taking place.
 */
L.Control.Loading = L.Control.extend({
    options: {
        position: 'topleft',
    },

    initialize: function(options) {
        L.setOptions(this, options);
        this._dataLoaders = {};
    },

    onAdd: function(map) {
        this._addLayerListeners(map);

        this._addMapListeners(map);

        // Create the loading indicator
        var classes = 'leaflet-control-loading leaflet-bar-part last';
        var container;
        if (map.zoomControl) {
            // If there is a zoom control, hook into the bottom of it
            container = map.zoomControl._container;
            classes += ' leaflet-bar-part-bottom';
        }
        else {
            // Otherwise, create a container for it
            container = L.DomUtil.create('div', 'leaflet-control-zoom');
        }
        this._indicator = L.DomUtil.create('a', classes, container);
        return container;
    },

    onRemove: function(map) {
        this._removeLayerListeners(map);

        this._removeMapListeners(map);
    },

    addLoader: function(id) {
        this._dataLoaders[id] = true;
        this.updateIndicator();
    },

    removeLoader: function(id) {
        delete this._dataLoaders[id];
        this.updateIndicator();
    },

    updateIndicator: function() {
        if (this.isLoading()) {
            this._showIndicator();
        }
        else {
            this._hideIndicator();
        }
    },

    isLoading: function() {
        return this._countLoaders() > 0;
    },

    _countLoaders: function() {
        var size = 0, key;
        for (key in this._dataLoaders) {
            if (this._dataLoaders.hasOwnProperty(key)) size++;
        }
        return size;
    },

    _showIndicator: function() {
        // Show loading indicator
        L.DomUtil.addClass(this._indicator, 'is-loading');

        // If map.zoomControl exists, make the zoom-out button not last
        if (this._map.zoomControl) {
            L.DomUtil.removeClass(this._map.zoomControl._zoomOutButton, 'leaflet-bar-part-bottom');
        }
    },

    _hideIndicator: function() {
        // Hide loading indicator
        L.DomUtil.removeClass(this._indicator, 'is-loading');

        // If map.zoomControl exists, make the zoom-out button last
        if (this._map.zoomControl) {
            L.DomUtil.addClass(this._map.zoomControl._zoomOutButton, 'leaflet-bar-part-bottom');
        }
    },

    _handleLoading: function(e) {
        var id;
        if (e.id) {
            id = e.id;
        }
        else if (e.layer) {
            id = e.layer._leaflet_id;
        }
        else {
            id = e.target._leaflet_id;
        }
        this.addLoader(id);
    },

    _handleLoad: function(e) {
        var id;
        if (e.id) {
            id = e.id;
        }
        else if (e.layer) {
            id = e.layer._leaflet_id;
        }
        else {
            id = e.target._leaflet_id;
        }
        this.removeLoader(id);
    },

    _layerAdd: function(e) {
        e.layer.on({
            loading: this._handleLoading,
            load: this._handleLoad,
        }, this);
    },

    _addLayerListeners: function(map) {
        // Add listeners for begin and end of load
        // to any layers already on the map
        if (map._layers) {
            for (var index in map._layers) {
                map._layers[index].on({
                    loading: this._handleLoading,
                    load: this._handleLoad,
                });
            }
        }

        // When a layer is added to the map, add listeners for begin and end
        // of load
        map.on('layeradd', this._layerAdd, this);
    },

    _removeLayerListeners: function(map) {
        // Remove listeners from all layers
        if (map._layers) {
            for (var index in map._layers) {
                map._layers[index].off({
                    loading: this._handleLoading,
                    load: this._handleLoad,
                });
            }
        }

        // Remove layeradd listener from map
        map.off('layeradd', this._layerAdd);
    },

    _addMapListeners: function(map) {
        // Add listeners to the map for (custom) dataloading and dataload
        // events, eg, for AJAX calls that affect the map but will not be
        // reflected in the above layer events.
        map.on({
            dataloading: this._handleLoading,
            dataload: this._handleLoad,
        }, this);
    },

    _removeMapListeners: function(map) {
        map.offn({
            dataloading: this._handleLoading,
            dataload: this._handleLoad,
        }, this);
    },
});

L.Map.addInitHook(function () {
    if (this.options.loadingControl) {
        this.loadingControl = new L.Control.Loading();
        this.addControl(this.loadingControl);
    }
});

L.Control.loading = function(options) {
    return new L.Control.Loading(options);
};
