#!/usr/bin/env node
/**
 * Server
 */

var Express = require("express");
var HTTP = require("http");
var Path = require("path");
var Winston = require("winston");

// Private Modules
var Body = require("./lib/control/body");
var Logger = require("./lib/control/logger");
var Session = require("./lib/control/session");

var app = Express(); // HTTP Router

// Middleware
app.use(Express.favicon());
app.use(Body.aggregate());
app.use(Logger.winston());
app.use(app.router);

//Routes
Session.route(app);

// Start UI interface
var server = HTTP.createServer(app);
server.listen(9080, function() {
    Winston.info("Listening for HTTP requests on port " + 9080);
});
