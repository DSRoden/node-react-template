var AppConstants = require("./constants");

module.exports.getHostName = function() {
    // return "http" + (AppConstants.DEBUG ? "" : "s") + "://" + AppConstants.HOST;
    return "http://ubuntu@54.235.229.113";

}

module.exports.getPath = function(path) {
    return module.exports.getHostName() + path;
}
