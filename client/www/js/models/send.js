// var _ = require("underscore");
// var Backbone = require("backbone");


// var AppConstants = require("../constants");
// var AppDispatcher = require("../dispatcher");
// var getPath = require("../utils").getPath;

// var _questions = {"data": {}, "lastUpdated": null};

// var Question = Backbone.Model.extend({
//     url: function() {
// 	return getPath("/api/1/question/id/" + this.id + "/")
//     },
//     vote: function(choice_id, value) {
// 	var $this = this;
// 	var headers = User.authHeaders();
// 	headers["Content-Type"] = "application/x-www-form-urlencoded";
// 	$.ajax({
// 	    url: getPath("/api/1/question/" + $this.id + "/vote/"),
// 	    type: "POST",
// 	    // TODO: Remove the hardcoding for other types of choices
// 	    data: {"choice_id": choice_id, "value": value, "type": "slider"},
// 	    headers: headers,
// 	    success: function(data, status, jqXHR) {
// 		var question = $this.parse(data);
// 		AppDispatcher.trigger(AppConstants.VOTE_SUCCESS, question);
// 	    },
// 	    error: function(jqXHR, status, error) {
// 	    }
// 	});
//     },
//     addComment: function(comment) {
// 	var $this = this;
// 	var headers = User.authHeaders();
// 	$.ajax({
// 	    url: getPath("/api/1/question/" + $this.id + "/comment/"),
// 	    type: "POST",
// 	    headers: headers,
// 	    data: {"comment": comment},
// 	    success: function(data, status, jqXHR) {
// 		AppDispatcher.trigger(AppConstants.ADD_COMMENT_SUCCESS, data);
// 	    },
// 	    error: function(jqXHR, status, error) {
// 		AppDispatcher.trigger(AppConstants.ADD_COMMENT_ERROR, jqXHR);
// 	    }
// 	});
//     },
//     addVideoComment: function(comment) {
// 	var $this = this;
// 	var headers = User.authHeaders();
// 	$.ajax({
// 	    url: getPath("/api/1/question/" + $this.id + "/comment/video/"),
// 	    type: "POST",
// 	    headers: headers,
// 	    data: {"video": comment},
// 	    success: function(data, status, jqXHR) {
// 		AppDispatcher.trigger(AppConstants.ADD_COMMENT_SUCCESS, data);
// 	    },
// 	    error: function(jqXHR, status, error) {
// 		AppDispatcher.trigger(AppConstants.ADD_COMMENT_ERROR, jqXHR);
// 	    }
// 	});
//     },
//     deleteComment: function(qID, cID){
//     var $this = this;
//     var headers = User.authHeaders();
//     $.ajax({
//     	url: getPath("/api/1/question/" + qID + '/comment/' + cID + '/'),
//     	type: "DELETE",
//     	headers: headers,
//     	data: {questionId: qID, commentId: cID},
//     	success: function(data, status, jqXHR){
//     	    AppDispatcher.trigger(AppConstants.DELETE_COMMENT_SUCCESS, {qId: qID, cId: cID});
//     	},
//     	error: function(jqXHR, status, error){
//     	    AppDispatcher.trigger(AppConstants.DELETE_COMMENT_ERROR, jqXHR);
//     	}
//     });
//     },
//     getBySlug: function(options) {
// 	options.url = getPath("/api/1/question/" + options.slug + "/");
// 	this.fetch(options);
//     }
// });