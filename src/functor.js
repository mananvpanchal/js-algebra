const { isSet, mapSet, forEachSet } = require('./util');

const Functor = function (value, loader) {
    if (!value && !(typeof loader === 'function')) {
        throw new Error('Loader should be type of function when value is null / undefined')
    }
    this.value = value;
    this.loader = loader;
};

Functor.isFunctor = function (functor) {
    return functor
        && typeof functor === 'object'
        && ('value' in functor)
        && ('map' in functor);
};

Functor.prototype.load = function() {
    if (!(typeof this.loader === 'function')) {
        throw new Error('Loader should be type of function')
    }
    this.value = this.loader(this);
};

Functor.prototype.map = function (mFunc) {
    if (!(typeof mFunc === 'function')) {
        throw new Error('Parameter of map shoud be type of function')
    }
    return new this.constructor(isSet(this.value)
        ? mapSet(this.value, mFunc)
        : mFunc(this.value));
};

Functor.prototype.forEach = function (fFunc) {
    if (!(typeof fFunc === 'function')) {
        throw new Error('Parameter of forEach shoud be type of function')
    }
    isSet(this.value)
        ? forEachSet(this.value, fFunc)
        : fFunc(this.value);
};

Functor.prototype.get = function () {
    return this.value;
};

Functor.prototype.typeStr = function () {
    return 'Functor';
};

module.exports = Functor;