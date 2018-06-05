const Apply = require('./apply');
const inherit = require('./inheritance');

const Applicative = function (value, loader) {
    Apply.call(this, value, loader);
};

Applicative.of = function (value, loader) {
    return new this(value, loader);
};

Applicative.ofLoader = function (loader) {
    return new this(null, loader);
};

Applicative.isApplicative = function (monad) {
    return monad
        && typeof monad === 'object'
        && ('value' in monad)
        && ('map' in monad)
        && ('ap' in monad);
};

Applicative.prototype.typeStr = function () {
    return 'Applicative';
};

inherit(Applicative, Apply);

module.exports = Applicative;