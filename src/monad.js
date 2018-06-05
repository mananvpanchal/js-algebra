const Chain = require('./chain');
const Applicative = require('./applicative');
const inherit = require('./inheritance');
const { isSet } = require('./util');

const Monad = function (value, loader) {
    Chain.call(this, value, loader);
};

Monad.isMonad = function (monad) {
    return Chain.isChain(monad);
};

Monad.isChain = function (monad) {
    return Chain.isChain(monad);
};

Monad.prototype.typeStr = function () {
    return 'Monad';
};

//todo: do same for applicative, apply and functor

inherit(Monad, Chain, Applicative);

module.exports = Monad;