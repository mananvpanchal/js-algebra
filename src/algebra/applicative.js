const Apply  = require('./apply');
const { inherit, isApplicative } = require('../util');

const Applicative = function (value) {
    Apply.call(this, value);
};

Applicative.isApplicative = function (applicative) {
    return isApplicative(applicative);
};

Applicative.of = function (value) {
    return new this(value);
};

Applicative.prototype.typeStr = function () {
    return 'Applicative';
};

inherit(Applicative, Apply);

module.exports = Applicative;