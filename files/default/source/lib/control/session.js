/**
 * Control: Session
 */
var Memcached = require("Memcached");
var Winston = require("winston");

exports.route = function(app) {
    var store = new Memcached("localhost:11211");

    app.get("/session/:id", function(req, res, next) {
        store.get(req.params.id, function(err, data) {
            if (err)
                return next(err);
            if (!data)
                return res.send(404);

            // Touch session to reset timeout
            if (+(req.query.timeout))
                store.touch(req.params.id, req.query.timeout, function(err) {
                    !!err && Winston.error(err);
                });

            res.send(data);
        });
    });
    app.put("/session/:id", function(req, res, next) {
        // Default 1h; TODO configurable
        var timeout = +(req.query.timeout) || 3600;
        
        store.set(req.params.id, req.body, timeout, function(err) {
            if (err)
                return next(err);
            res.send(202);
        });
    });
    app.del("/session/:id", function(req, res, next) {
        store.del(req.params.id, function(err) {
            if (err)
                return next(err);
            res.send(204);
        });
    });
    
    // DEBUG
    app.get("/session", function(req, res, next) {
        store.items(function(err, data) {
            if (err)
                return next(err);
            res.send(data);
        });
    });
};
