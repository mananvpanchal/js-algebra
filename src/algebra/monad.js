const Chain = require('./chain');
const Applicative = require('./applicative');
const { inherit, isSet, isMonad, isChain, 
    flattenSet, flattenMonad } = require('../util');

const Monad = function (value) {
    Chain.call(this, value);
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