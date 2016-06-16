var _ = require("underscore");
var Backbone = require("backbone");


var AppConstants = require("../constants");
var AppDispatcher = require("../dispatcher");
var getPath = require("../utils").getPath;

var Send = Backbone.Model.extend({
    sendMessage: function(message) {
	var $this = this;
	// headers["Content-Type"] = "application/x-www-form-urlencoded";
	$.ajax({
	    url: getPath("/api/1/send/"),
	    type: "POST",
	    // TODO: Remove the hardcoding for other types of choices
	    data: {"message": message},
	    // headers: headers,
	    success: function(data, status, jqXHR) {
		AppDispatcher.trigger(AppConstants.SEND_SUCCESS);
	    },
	    error: function(jqXHR, status, error) {
	    }
	});
    }
});

module.exports = {
    Send: new Send()
};
