const { isSet } = require('./util');

const mapSet = function (set, map) {
    const newSet = set.emptySet();
    while (set.hasNextValue()) {
        newSet.setNextValue(map(set.getNextValue()));
    }
    return newSet;
};

const applySet = function (set, monad) {
    const newSet = set.emptySet();
    monad.map(function (apply) {
        while (set.hasNextValue()) {
            newSet.setNextValue(apply(set.getNextValue()));
        }
    });
    return newSet;
};

const chainSet = function (set, chain) {
    const newSet = set.emptySet();
    while (set.hasNextValue()) {
        newSet.setNextValue(chain(set.getNextValue()).get());
    }
    return Monad.of(newSet);
};

const Monad = function (val, extender) {
    this.value = val;
    if(extender) {
        extender(this);
    }
};

Monad.of = function (val, loader) {
    return new Monad(val, loader);
};

Monad.prototype.map = function (mFunc) {
    return Monad.of(isSet(this.value)
        ? mapSet(this.value, mFunc)
        : mFunc(this.value));
};

Monad.prototype.ap = function (monad) {
    return Monad.of(isSet(this.value)
        ? applySet(this.value, monad)
        : monad.value(this.value));
};

Monad.prototype.chain = function (cFunc) {
    return isSet(this.value) 
        ? chainSet(this.value, cFunc) 
        : cFunc(this.value);
};

Monad.prototype.get = function () {
    return this.value;
}

//To make stuff FP compitible the function added but its own self is not FP compliant
//Need to think about it
Monad.prototype.flatten = function () {
    if(isSet(this.value)) {
        const newSet = this.value.emptySet();
        while(this.value.hasNextValue()) {
            const val = this.value.getNextValue();
            if(val instanceof Monad) {
                val.map(function (v) {
                    newSet.setNextValue(v);
                });
            }
        }
        return Monad.of(newSet);
    } else {
        return Monad.of(this.value);
    }
}

module.exports = Monad;