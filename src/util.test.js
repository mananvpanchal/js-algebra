const { expect } = require('chai');
const { 
    isSet, isFunctor, isApply, isApplicative, isChain, isMonad 
} = require('./util');

const ArraySet = require('./array-set');
const Functor = require('./functor');
const Apply = require('./apply');
const Applicative = require('./applicative');
const Chain = require('./chain');
const Monad = require('./monad');

describe('Util test', function () {

    it('isSet', function () {
        const set = new ArraySet([1, 2, 3]);
        expect(isSet(set)).to.be.true;
    });

    it('isFunctor', function () {
        const functor = new Functor(5);
        expect(isFunctor(functor)).to.be.true;
    });

    it('isApply', function () {
        const apply = new Apply(5);
        expect(isApply(apply)).to.be.true;
    });

    it('isApplicative', function () {
        const applicative = Applicative.of(5);
        expect(isApplicative(applicative)).to.be.true;
    });

    it('isChain', function () {
        const chain = new Chain(5);
        expect(isChain(chain)).to.be.true;
    });

    it('isMonad', function () {
        const monad = Monad.of(5);
        expect(isMonad(monad)).to.be.true;
    });
});