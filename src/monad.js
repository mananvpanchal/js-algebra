const Chain = require('./chain');
const Applicative = require('./applicative');
const inherit = require('./inheritance');
const { isSet, isMonad, isChain, 
    createSetTree, flattenSet, 
    flattenMonad } = require('./util');

const Monad = function (value, loader) {
    Chain.call(this, value, loader);
};

Monad.isMonad = function (monad) {
    return isMonad(monad);
};

Monad.prototype.join = function () {
    const val = flattenMonad(this.get());
    if (isSet(val)) {
        const newSet = val.emptySet();
        flattenSet(val, newSet);
        return new this.constructor(newSet);
    } else {
        return new this.constructor(val);
    }
};

Monad.prototype.typeStr = function () {
    return 'Monad';
};

Monad.isChain = Chain.isChain;
inherit(Monad, Chain, Applicative);

module.exports = Monad;