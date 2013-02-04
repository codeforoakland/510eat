function FOOE_MarkersMap (target,cfg) {
    this.target = target;
    this.target_id = $(target).attr('id');
    this.markers = [];
    var errors = this.initCfg(cfg);
    if(errors.length>0){
        $(target).append('<div>problem</div>');
    } else {
        this.init(target);
    }

    return this;
}

FOOE_MarkersMap.prototype.initCfg = function( cfg ) {
    var _instance = this;
    if(!cfg.disableDefaultUI || cfg.disableDefaultUI==false)
        _instance.disableDefaultUI = false;
    else
        _instance.disableDefaultUI = true;
    _instance.location = cfg.location;
    _instance.zoom = cfg.zoom;
    _instance.observers = cfg.observers;
    _instance.static_url = cfg.static_url;
    var errors = [];
    return errors;
};


FOOE_MarkersMap.prototype.init = function( target ) {
    var _instance = this;

    var layer= 'toner';
    var mapOptions = {
        center: _instance.location,
        zoom: _instance.zoom,
        disableDefaultUI:  _instance.disableDefaultUI,
        mapTypeId: layer, mapTypeControlOptions: {
            mapTypeIds: [layer]
        }
    };

    _instance.gmap_control = new google.maps.Map(document.getElementById(_instance.target_id),
        mapOptions);

    _instance.gmap_control.mapTypes.set(layer, new google.maps.StamenMapType(layer));

    //set the handler
    jQuery.each(_instance.observers, function(i,observer) {
        google.maps.event.addListener(_instance.gmap_control, 'zoom_changed', function(event) {
            observer.handelMapEvent(
                'zoom_changed',
                _instance.gmap_control,
                { location: _instance.location, qmodel: _instance.query });
        });

    });

};


FOOE_MarkersMap.prototype.setItems = function(places, query) {
    var _instance = this;

    _instance.clearMarkers();

    _instance.query = query;

    /* this no longer needs to be a hash */
    //var lookup= new HashTable({});
    var bounds = new google.maps.LatLngBounds ();
    $(places).each(function(index,item){

        /* sort the grade to latest */
        item.document.inspections = item.document.inspections.sort(function(a,b){
            var parts_a= a.activity_date.split("/");
            var parts_b= b.activity_date.split("/");
            var d_a = new Date(parts_a[2], parts_a[0]-1, parts_a[1]);
            var d_b = new Date(parts_b[2], parts_b[0]-1, parts_b[1]);

            if(d_a.getTime() > d_b.getTime())
                return -1;
            else if(d_a.getTime() < d_b.getTime())
                return 1;
            else
                return 0;
        });

        item.latest_inspection = item.document.inspections[0];
        var item_location = new google.maps.LatLng(item.location.lat, item.location.lon);
        var marker = new google.maps.Marker({
            item:item,
            position: item_location,
            map: _instance.gmap_control,
            icon:Mustache.render(
                '{{{static_url}}}img/marker-{{grade}}.png',
                {static_url:_instance.static_url, grade:item.latest_inspection.grade})
        });

        google.maps.event.addListener(marker, 'click', function(){
            jQuery.each(_instance.observers, function(i,observer) {
                observer.handelMarkerEvent('click', marker, {});
            });
        });

        _instance.markers.push(marker);

        bounds.extend (item_location);
    });

    _instance.gmap_control.fitBounds(bounds);

    var listener = google.maps.event.addListener(_instance.gmap_control, "idle", function() {
        var zoom = _instance.gmap_control.getZoom();
        if (zoom > 16) _instance.gmap_control.setZoom(16);
        else _instance.gmap_control.setZoom(zoom+1);

        google.maps.event.removeListener(listener);
    });

};

FOOE_MarkersMap.prototype.clearMarkers = function() {
    var _instance = this;
    $.each(_instance.markers,function(i,marker){
        marker.setMap(null);
    });
    _instance.markers = [];
//    google.maps.event.trigger(_instance.gmap_control, 'resize');
};

FOOE_MarkersMap.prototype.getSearchBounds = function() {
    var _instance = this;
    var bounds = _instance.gmap_control.getBounds();

// Then the points
    var swPoint = bounds.getSouthWest();
    var nePoint = bounds.getNorthEast();

// Now, each individual coordinate
    var swLat = swPoint.lat();
    var swLng = swPoint.lng();
    var neLat = nePoint.lat();
    var neLng = nePoint.lng();

    var proximitymeter = google.maps.geometry.spherical.computeDistanceBetween(swPoint, nePoint);

    return { location: bounds.getCenter(), r:(proximitymeter/2000)}

};


FOOE_MarkersMap.prototype.triggerResize = function() {
    var _instance = this;
    google.maps.event.trigger(_instance.gmap_control, 'resize');
};

FOOE_MarkersMap.prototype.setCenter = function(lat,lng) {
    var _instance = this;
    var location = new google.maps.LatLng(lat, lng);
    _instance.gmap_control.setCenter(location);
};

FOOE_MarkersMap.prototype.setZoom = function(factor) {
    var _instance = this;
    _instance.gmap_control.setZoom(factor);
};


