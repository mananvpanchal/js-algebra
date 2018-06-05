const { isSet } = require('./util');

const Monad = function (value, loader) {
    if (!value && !(typeof loader === 'function')) {
        throw new Error('Loader should be type of function when value is null / undefined')
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

const joinSet = function (set) {
    const newSet = set.emptySet();
    set.forEach(function (val) {
        if (Monad.isMonad(val)) {
            newSet.addValue(joinMonad(val.get()));
        } else if (isSet(val)) {
            newSet.addValue(joinSet(val));
        } else {
            newSet.addValue(val);
        }
    });
    return newSet;
};

const joinMonad = function (val) {
    if (Monad.isMonad(val)) {
        return joinMonad(val.get());
    } else if (isSet(val)) {
        return joinSet(val);
    } else {
        return val;
    }
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
    const val = joinMonad(this.value);
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