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

const forEachSet = function (set, forEach) {
    set.forEach(function (val, idx) {
        forEach(val)
    });
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
        const chn = chain(val);
        if (!isChain(chn)) {
            throw new Error('Return value of chain is not a type of Chain');
        }
        newSet.addValue(chn.get());
    });
    return newSet;
};

const flattenMonad = function (val) {
    if (isChain(val)) {
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
        if (isChain(val)) {
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
exports.isFunctor= isFunctor;
exports.isApply = isApply;
exports.isApplicative = isApplicative;
exports.isChain = isChain;
exports.isMonad = isMonad;

exports.mapSet = mapSet;
exports.forEachSet = forEachSet;
exports.applySet = applySet;
exports.chainSet = chainSet;
exports.flattenSet = flattenSet;
exports.flattenMonad = flattenMonad;
exports.createSetTree = createSetTree;