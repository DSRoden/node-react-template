var _ = require("underscore");
var Backbone = require("backbone");

var AppConstants = require("./constants");

var AppDispatcher = {};
_.extend(AppDispatcher, Backbone.Events);


module.exports = AppDispatcher;
