/**
 * Control: Data
 * Access session data
 */
var Session = require("../model/session");

exports.route = function(app) {
    app.get("/session/:id/data", function(req, res, next) {
        Session.get(req.params.id, req.query, function(e, session) {
            if (e)
                return next(e);

            // Keep session alive
            session.touch(function(e) {
                if (e)
                    return next(e);
                
                if(session.isNew)
                    return res.json(404, {});
                res.json(session.data);
            });
        });
    });

    app.put("/session/:id/data", function(req, res, next) {
        Session.get(req.params.id, req.query, function(e, session) {
            if (e)
                return next(e);
            
            session.data = req.body;
            session.save(function(e) {
                if (e)
                    return next(e);
                res.json(202, {
                    authenticated : !!session.token
                });
            })
        });
    });
};
