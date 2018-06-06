const Apply = require('./apply');
const inherit = require('./inheritance');
const { isSet, isChain, chainSet } = require('./util');

const Chain = function (value, loader) {
    Apply.call(this, value, loader);
};

Chain.isChain = function (chain) {
    return isChain(chain);
};

Chain.prototype.chain = function (cFunc) {
    if (!(typeof cFunc === 'function')) {
        throw new Error('Parameter of chain shoud be type of function')
    }
    return isSet(this.value)
        ? new this.constructor(chainSet(this.value, cFunc))
        : cFunc(this.value);
};

Chain.prototype.typeStr = function () {
    return 'Chain';
};

inherit(Chain, Apply);

module.exports = Chain;