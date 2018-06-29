const { isFunctor, mapSet } = require('./functor');
const { isApply, applySet } = require('./apply');
const { isApplicative } = require('./applicative');
const { isChain, chainSet } = require('./chain');
const { isMonad, flattenMonad, flattenSet } = require('./monad');
const { isSet } = require('./set');
const { inherit } = require('./inheritance');

module.exports = {
    isFunctor, mapSet,
    isApply, applySet,
    isApplicative,
    isChain, chainSet,
    isMonad, flattenMonad, flattenSet,
    isSet,
    inherit
};