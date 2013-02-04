function FOOE_InspectionSearch (cfg) {
    var errors = this.initCfg(cfg);
    if(errors.length>0){
        return errors;
    } else {
        return this;
    }
}

FOOE_InspectionSearch.prototype.initCfg = function( cfg ) {
    var _instance = this;
    var errors = [];
    _instance.endpoint = cfg.endpoint;
    _instance.observers = cfg.observers;
    _instance.location = cfg.location;
    _instance.ajax_loader = cfg.ajax_loader;
    return errors;
};

FOOE_InspectionSearch.prototype.search = function(cfg) {
    var _instance = this;
    _instance.location = cfg.location
    model = {
        search:cfg.query,
        lat:cfg.location.lat(),
        lng:cfg.location.lng(),
        r:cfg.r
    };

    $.ajax({
        url: _instance.endpoint,
        data: model,
        dataType: 'json'
    }).done(function(data) {
        if(data != null && data.length>0){
            jQuery.each(_instance.observers, function(i,observer) {
                observer.setItems(data, { location:  _instance.location,  query: cfg.query });
            });
        }
    });

};
