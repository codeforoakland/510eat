function FOOE_FacilityMap (target,cfg) {
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

FOOE_FacilityMap.prototype.initCfg = function( cfg ) {
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


FOOE_FacilityMap.prototype.init = function( target ) {
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


FOOE_FacilityMap.prototype.setItems = function(places) {
    var _instance = this;


    var bounds = new google.maps.LatLngBounds ();
    $(places).each(function(index,item){

        var marker = new google.maps.Marker({
            position: item.location,
            map: _instance.gmap_control,
            icon:Mustache.render(
                '{{{static_url}}}img/marker-{{grade}}.png',
                {static_url:_instance.static_url, grade:item.grade})
        });

    });


};

