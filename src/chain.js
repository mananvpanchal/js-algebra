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
    const typeStr = this.typeStr.bind(this);
    if (!(typeof cFunc === 'function')) {
        throw new Error('Parameter of chain shoud be type of function')
    }
    if (isSet(this.value)) {
        const newSet = this.value.emptySet();
        const chnSet = chainSet(this.value, cFunc);
        chnSet.forEach(function (chn, idx) {
            if(!isChain(chn)) {
                throw new Error('Return value of chain function is not a type of '+typeStr());
            }
            newSet.addValue(chn.get());
        });
        return new this.constructor(newSet);
    } else {
        return cFunc(this.value);
    }
};

Chain.prototype.typeStr = function () {
    return 'Chain';
};

inherit(Chain, Apply);

module.exports = Chain;