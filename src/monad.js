const { isSet } = require('./util');

const forEachSet = function (set, forEach) {
    while (set.hasNextValue()) {
        forEach(set.getNextValue());
    }
};

const mapSet = function (set, map) {
    const newSet = set.emptySet();
    while (set.hasNextValue()) {
        newSet.setNextValue(map(set.getNextValue()));
    }
    return newSet;
};

const applySet = function (set, monad) {
    const newSet = set.emptySet();
    monad.forEach(function (apply) {
        set.resetIndex();
        while (set.hasNextValue()) {
            newSet.setNextValue(apply(set.getNextValue()));
        }
    });
    return newSet;
};

const chainSet = function (set, chain) {
    const newSet = set.emptySet();
    while (set.hasNextValue()) {
        const monad = chain(set.getNextValue());
        if(!Monad.isMonad(monad)) {
            throw new Error('Return value of chain is not a Monad');
        }
        newSet.setNextValue(monad.get());
    }
    return Monad.of(newSet);
};



const Monad = function (value, loader) {
    if (!value && !(typeof loader === 'function')) {
        throw new Error('loader should be type of function when value is null / undefined')
    }
    this.value = value ? value : loader(this);
};

Monad.of = function (value) {
    return new Monad(value);
};

Monad.ofLoader = function (loader) {
    return new Monad(null, loader);
};

Monad.isMonad = function (monad) {
    return monad
        && typeof monad === 'object'
        && ('value' in monad)
        && ('map' in monad)
        && ('ap' in monad)
        && ('chain' in monad);
};

Monad.prototype.map = function (mFunc) {
    if (!(typeof mFunc === 'function')) {
        throw new Error('parameter of map shoud be type of function')
    }
    return Monad.of(isSet(this.value)
        ? mapSet(this.value, mFunc)
        : mFunc(this.value));
};

Monad.prototype.ap = function (monad) {
    if (!Monad.isMonad(monad))
        throw new Error('parameter of ap should be type of monad');
    if (!isSet(monad.value) && !(typeof monad.value === 'function'))
        throw new Error('value of monad should be type of set or function');
    return Monad.of(isSet(this.value)
        ? applySet(this.value, monad)
        : monad.value(this.value));
};

Monad.prototype.chain = function (cFunc) {
    if (!(typeof cFunc === 'function')) {
        throw new Error('parameter of chain shoud be type of function')
    }
    return isSet(this.value)
        ? chainSet(this.value, cFunc)
        : cFunc(this.value);
};

Monad.prototype.forEach = function (fFunc) {
    if (!(typeof fFunc === 'function')) {
        throw new Error('parameter of forEach shoud be type of function')
    }
    if(isSet(this.value)) {
        forEachSet(this.value, fFunc);
    } else {
        fFunc(this.value);
    }
};

Monad.prototype.get = function () {
    return this.value;
};

module.exports = Monad;