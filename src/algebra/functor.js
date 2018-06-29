const { isSet, isFunctor, mapSet, forEachSet } = require('../util');

const Functor = function (value) {
    this.value = value;
};

Functor.isFunctor = function (functor) {
    return isFunctor(functor);
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
    return this.value;
};

Functor.prototype.typeStr = function () {
    return 'Functor';
};

module.exports = Functor;