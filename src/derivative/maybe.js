const { inherit } = require('../util');
const { Monad } = require('../algebra');

const Maybe = function (value) {
    Monad.call(this, value);
};

inherit(Maybe, Monad);

const Just = function(value) {
    Maybe.call(this, value);
};

inherit(Just, Maybe);

Just.prototype.getOrElse = function() {
    return this.get();
};

Just.prototype.orElse = function (f) {
    return this;
}

const Nothing = function () {
    Maybe.call(this, null);
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