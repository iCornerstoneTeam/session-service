#!/usr/bin/env node
/**
 * Server
 */

var Express = require("express");
var HTTP = require("http");
var Path = require("path");
var Winston = require("winston");
var ICSUtils = require("ics-utils");

// Controllers
var Session = require("./lib/control/session");
var Data = require("./lib/control/data");
var Sign = require("./lib/control/sign");
var Token = require("./lib/control/token");

var app = Express(); // HTTP Router

// Middleware
app.use(Express.favicon());
app.use(ICSUtils.Middleware.Body.aggregate());
app.use(ICSUtils.Middleware.Body.json(true));
app.use(ICSUtils.Middleware.Logger.winston());
app.use(app.router);

//Routes
Session.route(app);
Data.route(app);
Sign.route(app);
Token.route(app);

// Start UI interface
var server = HTTP.createServer(app);
server.listen(9080, function() {
    Winston.info("Listening for HTTP requests on port " + 9080);
});
