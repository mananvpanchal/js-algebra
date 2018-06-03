const { isSet } = require('./util');

const forEachSet = function (set, forEach) {
    set.forEach(function (val, idx) {
        forEach(val)
    });
};

const mapSet = function (set, map) {
    const newSet = set.emptySet();
    set.forEach(function (val, idx) {
        newSet.addValue(map(val));
    });
    return newSet;
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

/*const _joinSet = function (set, newSet) {
    set.forEach(function (val) {
        if (Monad.isMonad(val)) {
            if(isSet(val.get())) {
                _joinSet(val.get(), newSet)
            } else {
                newSet.addValue(val.get());
            }
        } else {
            newSet.addValue(val);
        }
    });
};

const joinSet = function (set) {
    const newSet = set.emptySet();
    set.forEach(function (val) {
        if (Monad.isMonad(val)) {
            if(isSet(val.get())) {
                _joinSet(val.get(), newSet)
            } else {
                newSet.addValue(val.get());
            }
        } else {
            newSet.addValue(val);
        }
    });
    return Monad.of(newSet);
};*/

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

Monad.prototype.map = function (mFunc) {
    if (!(typeof mFunc === 'function')) {
        throw new Error('Parameter of map shoud be type of function')
    }
    return Monad.of(isSet(this.value)
        ? mapSet(this.value, mFunc)
        : mFunc(this.value));
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

Monad.prototype.chain = function (cFunc) {
    if (!(typeof cFunc === 'function')) {
        throw new Error('Parameter of chain shoud be type of function')
    }
    return isSet(this.value)
        ? chainSet(this.value, cFunc)
        : cFunc(this.value);
};

const joinMonad = function (val, set) {
    if(Monad.isMonad(val)) {
        if(Monad.isMonad(val.get()) || isSet(val.get())) {
            return joinMonad(val.get(), set);
        } else {
            set.addValue(val.get());
        }
        //return joinMonad(val.get(), set);
    } else if(isSet(val)) {
        val.forEach(function (ele) {
            if(Monad.isMonad(ele) || isSet(ele)) {
                return joinMonad(ele, set);
            } else {
                set.addValue(ele);
            }
        });
    } else {
        return val;
    }
};

Monad.prototype.join = function () {
    if(Monad.isMonad(this.value)) {
        return Monad.of(joinMonad(this.value.get()));
    } else if(isSet(this.value)) {
        const newSet = this.value.emptySet();
        this.value.forEach(function (ele) {
            if(Monad.isMonad(ele) || isSet(ele)) {
                joinMonad(ele, newSet);
            } else {
                newSet.addValue(ele);
            }
        });
        return Monad.of(newSet);
    } else {
        return Monad.of(this.value);
    }
};

/*Monad.prototype.join = function () {
    //console.log(Monad.isMonad(this.value), this.value, this.value.get());
    return isSet(this.value)
        ? Monad.of(joinSet(this.value))
        : (Monad.isMonad(this.value) 
            ? this.value
            : Monad.of(this.value))
};*/

Monad.prototype.forEach = function (fFunc) {
    if (!(typeof fFunc === 'function')) {
        throw new Error('Parameter of forEach shoud be type of function')
    }
    isSet(this.value)
        ? forEachSet(this.value, fFunc)
        : fFunc(this.value);
};

Monad.prototype.get = function () {
    return this.value;
};

module.exports = Monad;