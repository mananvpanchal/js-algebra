const { isChain } = require('./chain');
const { isSet } = require('./set');

const isMonad = function (monad) {
    return isChain(monad)
        && typeof monad.join === 'function';
};

const flattenMonad = function (val) {
    if (isMonad(val)) {
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
        if (isMonad(val)) {
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

module.exports = { isMonad, flattenMonad, flattenSet };