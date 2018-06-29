const { isApply } = require('./apply');

const isChain = function (val) {
    return isApply(val)
        && typeof val.chain === 'function';
};

const chainSet = function (set, chain) {
    const newSet = set.emptySet();
    set.forEach(function (val, idx) {
        newSet.addValue(chain(val));
    });
    return newSet;
};

module.exports = { isChain, chainSet };