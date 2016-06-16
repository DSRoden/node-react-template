var _ = require('underscore');

var AppConstants = {
    LANDING_PAGE: "landing_page",
    APPLY_PAGE: "apply_page",

    SEND_SUCCESS: "send_success"
};

AppConstants.DEBUG = false;
AppConstants.HOST = "localhost:8001";

_.extend(AppConstants, require('./debug'));


module.exports = AppConstants;
