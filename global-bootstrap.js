/**
*   Require a app module from app's root path
*   @module global
*   @param {string} path - Path to the app module, relative to app's root path
*/
global.appRequire = function(path) {
    return require(require('path').resolve(__dirname, path));
};

// Initialize dotenv
require('dotenv').load();