const { isSet, isFunctor, mapSet, forEachSet } = require('./util');

const Functor = function (value, loader) {
    if (!value && !(typeof loader === 'function')) {
        throw new Error('Loader should be type of function when value is null / undefined')
    }
    this.value = value;
    this.loader = loader;
};

Functor.isFunctor = function (functor) {
    return isFunctor(functor);
};

Functor.prototype.load = function() {
    if (!(typeof this.loader === 'function')) {
        throw new Error('Loader should be type of function')
    }
    return this.loader(this);
};

Functor.prototype.map = function (mFunc) {
    if (!(typeof mFunc === 'function')) {
        throw new Error('Parameter of map shoud be type of function')
    }
    return new this.constructor(isSet(this.get())
        ? mapSet(this.get(), mFunc)
        : mFunc(this.get()));
};

Functor.prototype.get = function () {
    return this.value || (this.value = this.load());
};

Functor.prototype.typeStr = function () {
    return 'Functor';
};

module.exports = Functor;