/**
 * Control: Session
 */
var Session = require("../model/session");
exports.route = function(app) {
    app.del("/session/:id", function(req, res, next) {
        Session.del(req.params.id, function(err) {
            if (err)
                return next(err);
            res.status(204);
            res.end();
        });
    });
};
