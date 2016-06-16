var _ = require('underscore');

var AppConstants = {
    LANDING_PAGE: "landing_page",
    APPLY_PAGE: "apply_page"
};

AppConstants.DEBUG = false;
AppConstants.HOST = "localhost:8001";

_.extend(AppConstants, require('./debug'));


module.exports = AppConstants;
