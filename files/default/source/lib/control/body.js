/**
 * Control: Body
 * Request body aggregator
 */
exports.aggregate = function() {
    return (function(req, res, next) {
        var body = "";
        req.setEncoding("utf8");
        req.on("data", function(chunk) {
            body += chunk;
        });
        
        req.on("end", function(chunk) {
            if(chunk)
                body += chunk;
            
            req.body = body;
            next();
        });
    });
};

exports.json = function() {
    return (function(req, res, next) {
        try {
            var unparsed = req.body;
            req.body = JSON.parse(unparsed);
            req.unparsedBody = unparsed;
        } catch(e) {
        }
        
        next();
    });
};
