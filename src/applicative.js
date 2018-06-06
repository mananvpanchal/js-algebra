const Apply = require('./apply');
const inherit = require('./inheritance');
const { isApplicative } = require('./util');

const Applicative = function (value, loader) {
    Apply.call(this, value, loader);
};

Applicative.isApplicative = function (applicative) {
    return isApplicative(applicative);
};

Applicative.of = function (value, loader) {
    return new this(value, loader);
};

Applicative.ofLoader = function (loader) {
    return new this(null, loader);
};

Applicative.isApplicative = function (monad) {
    return isApplicative(monad);
};

Applicative.prototype.typeStr = function () {
    return 'Applicative';
};

inherit(Applicative, Apply);

module.exports = Applicative;