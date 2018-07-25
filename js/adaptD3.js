define([
    'core/js/adapt',
    './adaptD3View'
], function(Adapt, AdaptD3View) {


    return Adapt.register("adaptD3", {
        view: AdaptD3View
    });

});
