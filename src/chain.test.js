const { expect } = require('chai');
const Chain = require('./chain');
const ArraySet = require('./array-set');

describe('Chain', function () {

    describe('Is of Type test', function () {

        it('isChain', function () {
            const c = new Chain(1);
            expect(Chain.isChain(c)).to.be.true;
        });

        it('isApply', function () {
            const c = new Chain(1);
            expect(Chain.isApply(c)).to.be.true;
        });

        it('isFunctor', function () {
            const c = new Chain(1);
            expect(Chain.isFunctor(c)).to.be.true;
        });

        it('typeStr', function () {
            const c = new Chain(1);
            expect(c.typeStr()).to.be.equal('Chain');
        });
    });

    describe('Functor: Identity: u.map(a => a) == u', function () {
        it('should be work for primitive', function () {
            const u = new Chain(5);
            expect(u.map(a => a)).to.be.deep.equal(u);
        });

        it('should be work for set', function () {
            const u = new Chain(new ArraySet([1, 2, 3]));
            expect(u.map(a => a)).to.be.deep.equal(u);
        });
    });

    describe('Functor: Composition: u.map(x => f(g(x))) == u.map(g).map(f)', function () {
        it('should be work for primitive', function () {
            const u = new Chain(5);
            const f = function (x) { return x + 5; };
            const g = function (x) { return x * 2; };
            expect(u.map(x => f(g(x)))).to.be.deep.equal(u.map(g).map(f));
        });

        it('should be work for set', function () {
            const u = new Chain(new ArraySet([1, 2, 3]));
            const f = function (x) { return x + 5; };
            const g = function (x) { return x * 2; };
            expect(u.map(x => f(g(x)))).to.be.deep.equal(u.map(g).map(f));
        });
    });

    describe('Apply: Composition: v.ap(u.ap(a.map(f => g => x => f(g(x))))) == v.ap(u).ap(a)', function () {
        it('should be work for primitive', function () {
            const v = new Chain(5);
            const u = new Chain(function (x) { return x + 5; });
            const a = new Chain(function (x) { return x * 2; });

            expect(v.ap(u.ap(a.map(f => g => x => f(g(x)))))).to.be.deep.equal(v.ap(u).ap(a));
        });

        it('should be work for set', function () {
            const v = new Chain(new ArraySet([1, 2, 3]));
            const u = new Chain(function (x) { return x + 5; });
            const a = new Chain(function (x) { return x * 2; });

            expect(v.ap(u.ap(a.map(f => g => x => f(g(x)))))).to.be.deep.equal(v.ap(u).ap(a));
        });

        it('should work with set of functions', function () {
            const f = new Chain(new ArraySet([x => x + 5, x => x * 2]));
            const v = new Chain(new ArraySet([1, 2, 3]));
            expect(v.ap(f).get().getArray()).to.be.deep.equal([6, 7, 8, 2, 4, 6]);
        });
    });

    describe('Chain: Associativity: m.chain(f).chain(g) == m.chain(x => f(x).chain(g))', function () {
        it('should work for primitive', function () {
            const m = new Chain(5);
            const f = function (x) { return new Chain(x + 5); };
            const g = function (x) { return new Chain(x * 2); };
            expect(m.chain(f).chain(g)).to.be.deep.equal(m.chain(x => f(x).chain(g)));
        });

        it('should work for set', function () {
            const m = new Chain(new ArraySet([1, 2, 3]));
            const f = function (x) { return new Chain(x + 5); };
            const g = function (x) { return new Chain(x * 2); };
            expect(m.chain(f).chain(g)).to.be.deep.equal(m.chain(x => f(x).chain(g)));
        });
    });

    describe('Error checking', function () {
        it('shoud check for chain type', function () {
            const c = new Chain(new ArraySet([1, 2, 3]));
            const f = function (x) { return x + 5; };
            expect(c.chain.bind(c, f)).to.throw('Return value of chain function is not a type of Chain');
        });

        it('shoud check for apply type', function () {
            const a = new Chain(1);
            const f = function (x) { return x + 5; };
            expect(a.ap.bind(a, f)).to.throw('Parameter of ap should be type of Chain');
        });
    });
});
