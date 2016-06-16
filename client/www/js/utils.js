var AppConstants = require("./constants");

module.exports.getHostName = function() {
    return "http" + (AppConstants.DEBUG ? "" : "s") + "://" + AppConstants.HOST;
}

module.exports.getPath = function(path) {
    return module.exports.getHostName() + path;
}
