/**
 * Control: Sign
 * 
 * Sign a canonicalized request object with a session's authentication token
 */
var Session = require("../model/session");
var Crypto = require("crypto");

exports.route = function(app) {
    app.put("/session/:id/sign", function(req, res, next) {
        Session.get(req.params.id, function(e, session) {
            if (e)
                return next(e);

            // Session isn't authenticated
            if (!session.authenticated())
                return res.json(401, {});

            // Generate canonical request string
            var canonical = 'Method:' + req.body.method + '\n';
            canonical += 'Hashed Path:' + req.body.hpath + '\n';
            canonical += 'X-Ops-Content-Hash:' + req.body.hbody + '\n';
            canonical += 'X-Ops-Timestamp:' + req.body.date + '\n';

            var hmac = Crypto.createHmac("sha256");
            hmac.update(canonical);
            res.send(hmac.digest('base64'));
        });
    });
};
