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
        this._dataLoaders = {};
    },

    onAdd: function(map) {
        this._addLayerListeners(map);
        this._addMapListeners(map);

        // Create the loading indicator
        var classes = 'leaflet-control-loading';
        var container;
        if (map.zoomControl && !this.options.separate) {
            // If there is a zoom control, hook into the bottom of it
            container = map.zoomControl._container;
            // These classes are no longer used as of Leaflet 0.6
            classes += ' leaflet-bar-part-bottom leaflet-bar-part last';
        }
        else {
            // Otherwise, create a container for the indicator
            container = L.DomUtil.create('div', 'leaflet-control-zoom leaflet-bar');
        }
        this._indicator = L.DomUtil.create('a', classes, container);
        return container;
    },

    onRemove: function(map) {
        this._removeLayerListeners(map);
        this._removeMapListeners(map);
    },

    removeFrom: function (map) {
        // Override Control.removeFrom() to avoid clobbering the entire
        // _container, which is the same as zoomControl's
        this._container.removeChild(this._indicator);
        this._map = null;
        this.onRemove(map);
        return this;
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

    _handleLoading: function(e) {
        this.addLoader(this.getEventId(e));
    },

    _handleLoad: function(e) {
        this.removeLoader(this.getEventId(e));
    },

    getEventId: function(e) {
        if (e.id) {
            return e.id;
        }
        else if (e.layer) {
            return e.layer._leaflet_id;
        }
        return e.target._leaflet_id;
    },

    _layerAdd: function(e) {
        e.layer.on({
            loading: this._handleLoading,
            load: this._handleLoad,
        }, this);
    },

    _addLayerListeners: function(map) {
        // Add listeners for begin and end of load to any layers already on the 
        // map
        if (map._layers) {
            for (var index in map._layers) {
                map._layers[index].on({
                    loading: this._handleLoading,
                    load: this._handleLoad,
                }, this);
            }
        }

        // When a layer is added to the map, add listeners for begin and end
        // of load
        map.on('layeradd', this._layerAdd, this);
    },

    _removeLayerListeners: function(map) {
        // Remove listeners for begin and end of load from all layers
        if (map._layers) {
            for (var index in map._layers) {
                map._layers[index].off({
                    loading: this._handleLoading,
                    load: this._handleLoad,
                }, this);
            }
        }

        // Remove layeradd listener from map
        map.off('layeradd', this._layerAdd, this);
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
        map.off({
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
