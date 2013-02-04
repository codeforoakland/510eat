var FiveOneOhEat;

(function (exports) {
    if (typeof module !== "undefined" && module.exports) {
        module.exports = exports; // CommonJS
    } else if (typeof define === "function") {
        define(exports); // AMD
    } else {
        FiveOneOhEat = exports; // <script>
    }
}((function () {
    var exports = {

        ui: {
            //{"errors":[{"errorMessage":"Please provide the name for your site.","errorCode":104}]}
            getErrorString: function(errors){
                var errorString = '';
                $(errors).each(function(i,item){
                    errorString = errorString+(i+1)+'. '+item.errorMessage+' ';
                });
                return errorString;
            },
            setStatus : function(statusArea, message, type, showloading){
                var _instance  = this;

                jQuery(statusArea).html('');
                jQuery(statusArea).removeClass();
                jQuery(statusArea).addClass(type);

                if(showloading){
                    jQuery(statusArea).append(showloading);
                }

                jQuery(statusArea).append('<em>'+message+'</em>');

                if(message != ''){
                    jQuery(statusArea).show();
                } else {
                    jQuery(statusArea).hide();
                }

            }
        },
        util: {
            remove :function(list, val) {
                list.splice(list.indexOf(val), 1);
            },
            listContains :function(list, val) {
                for ( var int = 0; int < list.length; int++) {
                    if(list[int] == val)
                        return true;
                }
                return false;
            },
            makeSet :function(list) {
                var set = {};
                for (var i = 0; i < list.length; i++)
                    set[list[i]] = true;
                list = [];
                for (var item in set)
                    list.push(item);
                return list;
            },
            log: function(logString){
                if (window.console) console.log(logString);
            },
            serialize: function(obj, prefix) {
                var str = [];
                for(var p in obj) {
                    var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
                    str.push(typeof v == "object" ?
                        serialize(v, k) :
                        encodeURIComponent(k) + "=" + encodeURIComponent(v));
                }
                return str.join("&");
            },
            hashCode: function(val){
                var hash = 0;
                if (val.length == 0) return hash;
                for (i = 0; i < val.length; i++) {
                    char = val.charCodeAt(i);
                    hash = ((hash<<5)-hash)+char;
                    hash = hash & hash;
                }
                return hash;
            },
            trim: function (str) {
                return FiveOneOhEat.util.ltrim(FiveOneOhEat.util.rtrim(str), ' ');
            },
            ltrim: function (str) {
                return str.replace(new RegExp("^[" + ' ' + "]+", "g"), "");
            },
            rtrim: function (str) {
                return str.replace(new RegExp("[" + ' ' + "]+$", "g"), "");
            },
            preload: function(arrayOfImages) {
                jQuery(arrayOfImages).each(function(){
                    jQuery('<img/>')[0].src = this;
                });
            },
            update: function() {
                var obj = arguments[0], i = 1, len=arguments.length, attr;
                for (; i<len; i++) {
                    for (attr in arguments[i]) {
                        obj[attr] = arguments[i][attr];
                    }
                }
                return obj;
            },
            escape: function(s) {
                return ((s == null) ? '' : s)
                    .toString()
                    .replace(/[<>"&\\]/g, function(s) {
                        switch(s) {
                            case '<': return '&lt;';
                            case '>': return '&gt;';
                            case '"': return '\"';
                            case '&': return '&amp;';
                            case '\\': return '\\\\';
                            default: return s;
                        }
                    });
            },
            unescape: function (unsafe) {
                return unsafe
                    .replace(/&amp;/g, "&")
                    .replace(/&lt;/g, "<")
                    .replace(/&gt;/g, ">")
                    .replace(/&quot;/g, '"')
                    .replace(/&#039;/g, "'");
            },
            notundef: function(a, b) {
                return typeof(a) == 'undefined' ? b : a;
            },
            guidGenerator: function() {
                return (FiveOneOhEat.util.S4()+FiveOneOhEat.util.S4()+"-"+
                    FiveOneOhEat.util.S4()+"-"+FiveOneOhEat.util.S4()+"-"+
                    FiveOneOhEat.util.S4()+"-"+
                    FiveOneOhEat.util.S4()+FiveOneOhEat.util.S4()+FiveOneOhEat.util.S4());
            },
            keyGenerator: function() {
                return (FiveOneOhEat.util.S4()+FiveOneOhEat.util.S4());
            },
            tokenGenerator: function() {
                return (FiveOneOhEat.util.S4()+FiveOneOhEat.util.S4()+
                    FiveOneOhEat.util.S4()+FiveOneOhEat.util.S4()+
                    FiveOneOhEat.util.S4()+
                    FiveOneOhEat.util.S4()+FiveOneOhEat.util.S4()+FiveOneOhEat.util.S4());
            },
            S4: function() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            },
            replaceAll: function(txt, replace, with_this) {
                return txt.replace(new RegExp(replace, 'g'),with_this);
            },
            startsWith: function(sourceString, startsWith) {
                return sourceString.indexOf(startsWith) == 0;
            },
            urlify: function(text) {
                var urlRegex = /(https?:\/\/[^\s]+)/g;
                return text.replace(urlRegex, function(url) {
                    return '<a href="' + url + '">' + url + '</a>';
                });
            },
            getParameter: function ( queryString, parameterName ) {
                // Add "=" to the parameter name (i.e. parameterName=value)
                var parameterName = parameterName + "=";
                if ( queryString.length > 0 ) {
                    // Find the beginning of the string
                    begin = queryString.indexOf ( parameterName );
                    // If the parameter name is not found, skip it, otherwise return the value
                    if ( begin != -1 ) {
                        // Add the length (integer) to the beginning
                        begin += parameterName.length;
                        // Multiple parameters are separated by the "&" sign
                        end = queryString.indexOf ( "&" , begin );
                        if ( end == -1 ) {
                            end = queryString.length
                        }
                        // Return the string
                        return unescape ( queryString.substring ( begin, end ) );
                    }
                    // Return "null" if no parameter has been found
                    return "null";
                }
            },
            getParameterByName: function (locationSearch, name)
            {
                name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
                var regexS = "[\\?&]" + name + "=([^&#]*)";
                var regex = new RegExp(regexS);
                var results = regex.exec(locationSearch);
                if(results == null)
                    return "";
                else
                    return decodeURIComponent(results[1].replace(/\+/g, " "));
            }
        }
    };

    return exports;

}())));


function FOOE_BrowseMapManager (cfg,target) {
    var errors = this.initCfg(cfg);
    if(errors.length>0){
        return errors;
    } else {
        return this;
    }
}

FOOE_BrowseMapManager.prototype.initCfg = function( cfg ) {
    var _instance = this;
    var errors = [];
    _instance.level = cfg.level;
    _instance.endpoint = cfg.endpoint;
    _instance.show_places = false;
    _instance.observers = cfg.observers;
    _instance.location = cfg.location;
    return errors;
};



FOOE_BrowseMapManager.prototype.handelMapEvent = function( event, map, data_event ) {
    var _instance = this;

    if(event == 'zoom_changed'){
//        var search_bounds = _instance.map_control.getSearchBounds();
//        _instance.geo_search.search(search_bounds);
//        return false;
    }

};

FOOE_BrowseMapManager.prototype.handelMarkerEvent = function( event, marker, data_event ) {
    var _instance = this;
    FiveOneOhEat.util.log('handelMarkerEvent:'+event);
    if(event == 'click'){

        //sort ispection dates
        marker.item.document.inspections = marker.item.document.inspections.sort(function(a,b){	var parts_a= a.activity_date.split("/");
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

        marker.item.facility_url = '/facility/'+marker.item.id;

        _instance.select_area.html(
            Mustache.render('<div class="item_row"><div class="item_location">' +
                '<div class="item_name"><a href="{{facility_url}}">{{document.facility_name}}</a></div>' +
                '<div class="item_address">{{document.address}}</div></div>' +
                '<div class="item_inspections">{{#document.inspections}}' +
                '<div class="item_inspection">' +
                '<div style="display:inline-block;"><strong>{{activity_date}}</strong></br><ul>{{#violation_descriptions}}' +
                '<li>{{.}}</li>'+
                '{{/violation_descriptions}}</ul></div>' +
                '<div class="item_grade-{{grade}}">&nbsp;</div>' +
                '</div>'+
                '{{/document.inspections}}</div>' +
                '</div>',marker.item));


    }
};

/*--------- utility classes -----------*/
function HashTable(obj)
{
    this.length = 0;
    this.items = {};
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            this.items[p] = obj[p];
            this.length++;
        }
    }

    this.setItem = function(key, value)
    {
        var previous = undefined;
        if (this.hasItem(key)) {
            previous = this.items[key];
        }
        else {
            this.length++;
        }
        this.items[key] = value;
        return previous;
    }

    this.getItem = function(key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    }

    this.hasItem = function(key)
    {
        return this.items.hasOwnProperty(key);
    }

    this.removeItem = function(key)
    {
        if (this.hasItem(key)) {
            previous = this.items[key];
            this.length--;
            delete this.items[key];
            return previous;
        }
        else {
            return undefined;
        }
    }

    this.keys = function()
    {
        var keys = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                keys.push(k);
            }
        }
        return keys;
    }

    this.values = function()
    {
        var values = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    }


    this.each = function(fn) {
        for (var k in this.items) {
            if (this.hasItem(k)) {
                fn(k, this.items[k]);
            }
        }
    }

    this.clear = function()
    {
        this.items = {}
        this.length = 0;
    }
}

/*   --- jquery plugins ----- */
(function( $ ){
    $.fn.fooeSearchByNameForm = function( cfg ) {
        return this.each(function() {

            var $this = $(this);
            $this.cfg = cfg;

            $this.html(Mustache.render('<input id="search_name" type="text" class="input-medium search-query">' +
                '&nbsp;<button type="submit" class="btn">Search</button><div id="results_area"></div>',{}));


            $this.find('button').click(function(){
                if($this.find('#search_name').val()){
                    var search_url = Mustache.render(
                        '{{{url}}}?name={{name}}',
                        { url:$this.cfg.endpoint, name: $this.find('#search_name').val()});
                    $.ajax({
                        url: $this.cfg.endpoint,
                        data: { name: $this.find('#search_name').val()},
                        dataType:'json'
                    }).done(function(data) {
                            var $results_area = $this.find('#results_area');
                            $results_area.html('');
                            $(data).each(function(index,item){

                                item.facility_url = '/facility/'+item.id;

                                //sort ispection dates
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

                                $results_area.append(
                                    Mustache.render('<div class="item_row"><div class="item_location">' +
                                        '<div class="item_name"><a href="{{facility_url}}">{{document.facility_name}}</a></div>' +
                                        '<div class="item_address">{{document.address}}</div></div>' +
                                        '<div class="item_inspections">{{#document.inspections}}' +
                                            '<div class="item_inspection">' +
                                                '<div style="display:inline-block;"><strong>{{activity_date}}</strong></br><ul>{{#violation_descriptions}}' +
                                                '<li>{{.}}</li>'+
                                                '{{/violation_descriptions}}</ul></div>' +
                                                '<div class="item_grade-{{grade}}">&nbsp;</div>' +
                                            '</div>'+
                                        '{{/document.inspections}}</div>' +
                                        '</div>',item));
                            });

                        });
                }

                return false;
            });

        });
    };

    $.fn.fooeFacilityMap = function( cfg ) {
        return this.each(function() {

            var $this = $(this);
            $this.cfg = cfg;

            var map_canvas = $('<div id="map_canvas" style="width:100%;height:400px"></div>');
            $($this).append(map_canvas);

            $this.map_control = new FOOE_FacilityMap(map_canvas,{
                location:cfg.location,
                zoom:cfg.zoom,
                grade:cfg.grade,
                disableDefaultUI:true,
                observers: [$this.mgr],
                static_url:cfg.static_url
            });

            $this.map_control.setItems(
                [{
                    grade:cfg.grade,
                    location: cfg.location
                }]);


        });
    };


    $.fn.fooeBrowseMap = function( cfg ) {
        return this.each(function() {

            var $this = $(this);
            $this.cfg = cfg;

            var neigborhoods = $('<ul class="nav nav-pills"></ul>');
            $($this).append(neigborhoods);

            var select_area = $('<div id="select_area" style="width:100%; text-align:left; margin-top: 10px; margin-bottom: 10px;"></div>');
            $($this).append(select_area);

            var map_canvas = $('<div id="map_canvas" style="width:100%;height:400px"></div>');
            $($this).append(map_canvas);

            $this.mgr = new FOOE_BrowseMapManager({
                level:'tour',
                endpoint: cfg.endpoint
            },$this);

            $this.mgr.select_area = select_area;

            $this.mgr.map_control = new FOOE_MarkersMap(map_canvas,{
                location:cfg.location,
                zoom:cfg.zoom,
                disableDefaultUI:true,
                observers: [$this.mgr],
                static_url:cfg.static_url
            });

            $this.mgr.geo_search = new FOOE_InspectionSearch({
                endpoint: cfg.endpoint,
                observers: [$this.mgr.map_control]
            });

            $this.mgr.geo_search.search({location:cfg.location, r:0.5});

            $.ajax({
                url: cfg.static_url+"json/neighborhoods.json",
                dataType: 'json'
            }).done(function(data) {
                jQuery.each(data, function(i,neigborhood) {
                    //observer.setItems(data, {location:  _instance.location,  query: cfg.query});
                    neigborhood.lat = neigborhood.location[0];
                    neigborhood.lng = neigborhood.location[1];
                    var nitem = $(Mustache.render('<li data-name="{{name}}" ' +
                        'data-location-lat="{{lat}}" data-location-lng="{{lng}}" ' +
                        'data-radius="{{r}}"><a href="#">{{name}}</a></li>', neigborhood));

                    $(nitem).click(function(){
                        $this.mgr.geo_search.search(
                            {
                                location: new google.maps.LatLng($(this).data('location-lat'), $(this).data('location-lng')),
                                r:$(this).data('radius')
                            });
                        return false;
                    });
                    $(neigborhoods).append(nitem);

                });
            });

        });
    };

})( jQuery );


