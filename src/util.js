const isSet = function (val) {
    return val
        && typeof val === 'object'
        && typeof val.forEach === 'function'
        && typeof val.addValue === 'function'
        && typeof val.emptySet === 'function';
};

const isFunctor = function (val) {
    return val
        && typeof val === 'object'
        && val.value !== undefined
        && typeof val.map === 'function';
};

const isApply = function (val) {
    return isFunctor(val)
        && typeof val.ap === 'function';
};

const isApplicative = function (val) {
    return isApply(val)
        && typeof val.constructor.of === 'function';
};

const isChain = function (val) {
    return isApply(val)
        && typeof val.chain === 'function';
};

const isMonad = function (monad) {
    return isChain(monad)
        && typeof monad.join === 'function';
};

const mapSet = function (set, map) {
    const newSet = set.emptySet();
    set.forEach(function (val, idx) {
        newSet.addValue(map(val));
    });
    return newSet;
};

const _applySet = function (set, newSet, apFunc) {
    set.forEach(function (val, idx) {
        newSet.addValue(apFunc(val));
    });
};

const applySet = function (set, apply) {
    const newSet = set.emptySet();
    isSet(apply.get())
        ? apply.get().forEach(function (apFunc) {
            _applySet(set, newSet, apFunc);
        })
        : _applySet(set, newSet, apply.get());
    return newSet;
};

const chainSet = function (set, chain) {
    const newSet = set.emptySet();
    set.forEach(function (val, idx) {
        newSet.addValue(chain(val));
    });
    return newSet;
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

exports.isSet = isSet;
exports.isFunctor = isFunctor;
exports.isApply = isApply;
exports.isApplicative = isApplicative;
exports.isChain = isChain;
exports.isMonad = isMonad;

exports.mapSet = mapSet;
exports.applySet = applySet;
exports.chainSet = chainSet;
exports.flattenSet = flattenSet;
exports.flattenMonad = flattenMonad;
exports.createSetTree = createSetTree;