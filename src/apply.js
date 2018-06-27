const Functor = require('./functor');
const inherit = require('./inheritance');
const { isSet, isApply, applySet } = require('./util');

const Apply = function (value, loader) {
    Functor.call(this, value, loader);
};

Apply.isApply = function (apply) {
    return isApply(apply);
};

Apply.prototype.ap = function (apply) {
    if (!Apply.isApply(apply)) {
        throw new Error('Parameter of ap should be type of '+this.typeStr());
    }
    if (!isSet(apply.value) && !(typeof apply.value === 'function')) {
        throw new Error('Value of apply should be type of set or function');
    }
    return new this.constructor(isSet(this.get())
        ? applySet(this.get(), apply)
        : apply.value(this.get()));
};

Apply.prototype.typeStr = function () {
    return 'Apply';
};

inherit(Apply, Functor);

module.exports = Apply;
