const { isSet } = require('./util');

const Monad = function (value, loader) {
    if (!value && !(typeof loader === 'function')) {
        throw new Error('Loader should be type of function when value is null / undefined')
    }
    this.value = value;
    this.loader = loader;
};

Monad.of = function (value, loader) {
    return new Monad(value, loader);
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

Monad.prototype.load = function() {
    if (!(typeof this.loader === 'function')) {
        throw new Error('Loader should be type of function')
    }
    this.value = this.loader(this);
};

const mapSet = function (set, map) {
    const newSet = set.emptySet();
    set.forEach(function (val, idx) {
        newSet.addValue(map(val));
    });
    return newSet;
};

Monad.prototype.map = function (mFunc) {
    if (!(typeof mFunc === 'function')) {
        throw new Error('Parameter of map shoud be type of function')
    }
    return Monad.of(isSet(this.value)
        ? mapSet(this.value, mFunc)
        : mFunc(this.value));
};

const applySet = function (set, monad) {
    const newSet = set.emptySet();
    monad.forEach(function (apply) {
        set.forEach(function (val, idx) {
            newSet.addValue(apply(val));
        });
    });
    return newSet;
};

Monad.prototype.ap = function (monad) {
    if (!Monad.isMonad(monad)) {
        throw new Error('Parameter of ap should be type of monad');
    }
    if (!isSet(monad.value) && !(typeof monad.value === 'function')) {
        throw new Error('Value of monad should be type of set or function');
    }
    return Monad.of(isSet(this.value)
        ? applySet(this.value, monad)
        : monad.value(this.value));
};

const chainSet = function (set, chain) {
    const newSet = set.emptySet();
    set.forEach(function (val, idx) {
        const monad = chain(val);
        if (!Monad.isMonad(monad)) {
            throw new Error('Return value of chain is not a Monad');
        }
        newSet.addValue(monad.get());
    });
    return Monad.of(newSet);
};

Monad.prototype.chain = function (cFunc) {
    if (!(typeof cFunc === 'function')) {
        throw new Error('Parameter of chain shoud be type of function')
    }
    return isSet(this.value)
        ? chainSet(this.value, cFunc)
        : cFunc(this.value);
};

const forEachSet = function (set, forEach) {
    set.forEach(function (val, idx) {
        forEach(val)
    });
};

Monad.prototype.forEach = function (fFunc) {
    if (!(typeof fFunc === 'function')) {
        throw new Error('Parameter of forEach shoud be type of function')
    }
    isSet(this.value)
        ? forEachSet(this.value, fFunc)
        : fFunc(this.value);
};

const flattenMonad = function (val) {
    if (Monad.isMonad(val)) {
        return flattenMonad(val.get());
    } else if (isSet(val)) {
        return createSetTree(val);
    } else {
        return val;
    }
};

const createSetTree = function (set) {
    const newSet = set.emptySet();
    set.forEach(function (val) {
        if (Monad.isMonad(val)) {
            newSet.addValue(flattenMonad(val.get()));
        } else if (isSet(val)) {
            newSet.addValue(createSetTree(val));
        } else {
            newSet.addValue(val);
        }
    });
    return newSet;
};

const flattenSet = function (set, newSet) {
    set.forEach(function (val) {
        if (isSet(val)) {
            flattenSet(val, newSet);
        } else {
            newSet.addValue(val);
        }
    });
};

Monad.prototype.join = function () {
    const val = flattenMonad(this.value);
    if (isSet(val)) {
        const newSet = val.emptySet();
        flattenSet(val, newSet);
        return Monad.of(newSet);
    } else {
        return Monad.of(val);
    }
};

Monad.prototype.get = function () {
    return this.value;
};

module.exports = Monad;