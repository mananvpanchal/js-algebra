const isSet = function (val) {
    return val
        && typeof val === 'object'
        && ('forEach' in val)
        && ('addValue' in val)
        && ('emptySet' in val);
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

const chainSet = function (chainObj) {
    return function (set, chain) {
        const newSet = set.emptySet();
        set.forEach(function (val, idx) {
            const chn = chain(val);
            if (!chainObj.constructor.isChain(chn)) {
                //todo: 
                throw new Error('Return value of chain is not a '+chainObj.typeStr());
            }
            newSet.addValue(chn.get());
        });
        return new chainObj.constructor(newSet);
    }
};

exports.isSet = isSet;
exports.mapSet = mapSet;
exports.forEachSet = forEachSet;
exports.applySet = applySet;
exports.chainSet = chainSet;