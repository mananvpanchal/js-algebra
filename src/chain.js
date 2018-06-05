const Apply = require('./apply');
const inherit = require('./inheritance');
const { isSet, chainSet } = require('./util');

const Chain = function (value, loader) {
    Apply.call(this, value, loader);
};

Chain.isChain = function (chain) {
    return chain
        && typeof chain === 'object'
        && ('value' in chain)
        && ('map' in chain)
        && ('ap' in chain)
        && ('chain' in chain);
};

Chain.prototype.chain = function (cFunc) {
    if (!(typeof cFunc === 'function')) {
        throw new Error('Parameter of chain shoud be type of function')
    }
    return isSet(this.value)
        ? chainSet(this)(this.value, cFunc)
        : cFunc(this.value);
};

const flattenChain = function (val) {
    if (Chain.isChain(val)) {
        return flattenChain(val.get());
    } else if (isSet(val)) {
        return createSetTree(val);
    } else {
        return val;
    }
};

const createSetTree = function (set) {
    const newSet = set.emptySet();
    set.forEach(function (val) {
        if (Chain.isChain(val)) {
            newSet.addValue(flattenChain(val.get()));
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

Chain.prototype.join = function () {
    const val = flattenChain(this.value);
    if (isSet(val)) {
        const newSet = val.emptySet();
        flattenSet(val, newSet);
        return new this.constructor(newSet);
    } else {
        return new this.constructor(val);
    }
};

Chain.prototype.typeStr = function () {
    return 'Chain';
};

inherit(Chain, Apply);

module.exports = Chain;