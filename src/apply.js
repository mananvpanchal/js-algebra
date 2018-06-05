const Functor = require('./functor');
const inherit = require('./inheritance');
const { isSet, applySet } = require('./util');

const Apply = function (value, loader) {
    Functor.call(this, value, loader);
};

Apply.isApply = function (apply) {
    return apply
        && typeof apply === 'object'
        && ('value' in apply)
        && ('map' in apply)
        && ('ap' in apply);
};

Apply.prototype.ap = function (apply) {
    if (!Apply.isApply(apply)) {
        //todo: need to think about "type of" string
        throw new Error('Parameter of ap should be type of apply');
    }
    if (!isSet(apply.value) && !(typeof apply.value === 'function')) {
        throw new Error('Value of apply should be type of set or function');
    }
    return new this.constructor(isSet(this.value)
        ? applySet(this.value, apply)
        : apply.value(this.value));
};

inherit(Apply, Functor);

module.exports = Apply;
