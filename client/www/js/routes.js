var _ = require("underscore");
var Backbone = require("backbone");
var React = require("react");

var AppConstants = require("./constants");
var AppDispatcher = require("./dispatcher");


var Router = Backbone.Router.extend({
    routes: {
	"": "landing",
	"landing/": "landing",
    },
    landing: function(){
        AppDispatcher.trigger(AppConstants.LANDING_PAGE);
    }
});

var router = new Router();

// var pushState = true;
// if (typeof cordova !== "undefined") {
//     pushState = !pushState;
// }
// Backbone.history.start({root: "/", pushState: pushState});

Backbone.history.start({root: "/"});

window.router = router;

module.exports = router;
