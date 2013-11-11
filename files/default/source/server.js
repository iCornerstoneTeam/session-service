#!/usr/bin/env node
/**
 * Server
 */
var Express = require("express");
var HTTP = require("http");
var Path = require("path");

// Internal Modules

var app = Express(); // HTTP Router

//Controllers

// Handlers
app.use(Express.favicon());
app.use(app.router);
app.use(NotFound.controller());

// Start UI interface
var server = HTTP.createServer(app);
server.listen(9080, function() {
    console.log("Listening for HTTP requests on port " + 9080);
});
