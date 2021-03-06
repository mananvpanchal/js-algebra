const { expect } = require('chai');

const { Functor } = require('../../src/algebra');
const { ArraySet } = require('../../src/set');

describe('Functor', function () {

    describe('Is of Type test', function () {

        it('isFunctor', function () {
            const f = new Functor(1);
            expect(Functor.isFunctor(f)).to.be.true;
        });

        it('typeStr', function () {
            const f = new Functor(1);
            expect(f.typeStr()).to.be.equal('Functor');
        });
    });

    describe('Functor: Identity: u.map(a => a) == u', function () {
        it('should be work for primitive', function () {
            const u = new Functor(5);
            expect(u.map(a => a)).to.be.deep.equal(u);
        });

        it('should be work for set', function () {
            const u = new Functor(new ArraySet([1, 2, 3]));
            expect(u.map(a => a)).to.be.deep.equal(u);
        });
    });

    describe('Functor: Composition: u.map(x => f(g(x))) == u.map(g).map(f)', function () {
        it('should be work for primitive', function () {
            const u = new Functor(5);
            const f = function (x) { return x + 5; };
            const g = function (x) { return x * 2; };
            expect(u.map(x => f(g(x)))).to.be.deep.equal(u.map(g).map(f));
        });

        it('should be work for set', function () {
            const u = new Functor(new ArraySet([1, 2, 3]));
            const f = function (x) { return x + 5; };
            const g = function (x) { return x * 2; };
            expect(u.map(x => f(g(x)))).to.be.deep.equal(u.map(g).map(f));
        });
    });
});