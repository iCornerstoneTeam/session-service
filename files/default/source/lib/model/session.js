/**
 * Model: Session
 */
var Memcached = require("Memcached");
var store = new Memcached("localhost:11211");
var nothing = function() {};

var Session = module.exports = function(id, isNew) {
    Object.defineProperty(this, "id", {
        value : id,
        configurable : false,
        enumerable : false,
        writable : false
    });

    Object.defineProperty(this, "isNew", {
        value : (typeof isNew === "undefined" ? true : !!isNew),
        enumerable : false,
        writable : true
    });

    this.expires = +(this.expires) || 3600;
    this.data = this.data || {};
};

Session.get = function(id, callback) {
    callback = typeof callback === "function" ? callback : nothing;
    store.get(id, function(e, session) {
        if (e)
            return callback(e);

        if (session) {
            try { // Instantiate Session object
                session = JSON.parse(session.toString("utf8"));
                Session.call(session, id, false);
                session.__proto__ = session.prototype;

                return callback(null, session);
            } catch (e) {
            }
        }

        // Non-existent session or corrupted data
        callback(null, new Session(id));
    });
};

Session.del = function(id, callback) {
    store.del(id, (typeof callback === "function" ? callback : nothing));
};

Session.prototype.authenticated = function() {
    return this.user && this.token;
};

Session.prototype.touch = function(callback) {
    store.touch(this.id, this.expires,
        (typeof callback === "function" ? callback : nothing));
};

Session.prototype.save = function(callback) {
    store.set(this.id, JSON.stringify(this), this.expires,
        (typeof callback === "function" ? callback : nothing));
};
