/**
 * Control: Token
 * 
 * Set session authentication token
 */
var Session = require("../model/session");

exports.route = function(app) {
    app.put("/session/:id/token", function(req, res, next) {
        Session.get(req.params.id, function(e, session) {
            if (e)
                return next(e);

            session.token = req.body.token;
            session.user = req.body.user;

            session.save(function(e) {
                if (e)
                    return next(e);
                res.json(202, {
                    authenticated : session.authenticated()
                });
            })
        });
    });
};
