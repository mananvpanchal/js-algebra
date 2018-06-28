const inherit = require('./inheritance');
const Monad = require('./monad');

const Maybe = function (value, loader) {
    Monad.call(this, value, loader);
};

inherit(Maybe, Monad);

const Just = function(value) {
    Maybe.call(this, value, null);
};

inherit(Just, Maybe);

Just.prototype.getOrElse = function() {
    return this.get();
};

Just.prototype.orElse = function (f) {
    return this;
}

const Nothing = function () {
    Maybe.call(this, null, () => null);
};

inherit(Nothing, Maybe);

const nothing = function (_) {
    return this;
}

Nothing.prototype.map = nothing;
Nothing.prototype.chain = nothing;
Nothing.prototype.ap = nothing;

Nothing.prototype.getOrElse = function (a) {
    return a;
};
Nothing.prototype.orElse = function (f) {
    return f();
};

Maybe.of = function (value) {
    return new Just(value);
};

Maybe.ofNullable = function (value) {
    return value ? new Just(value) : new Nothing();
};

module.exports = { Maybe, Just, Nothing };