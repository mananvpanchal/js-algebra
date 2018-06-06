const Apply = require('./apply');
const { expect } = require('chai');
const ArraySet = require('./array-set');

describe('Apply', function () {

    describe('Is of Type test', function () {

        it('isApply', function () {
            const a = new Apply(1);
            expect(Apply.isApply(a)).to.be.true;
        });

        it('isFunctor', function () {
            const a = new Apply(1);
            expect(Apply.isFunctor(a)).to.be.true;
        });

        it('typeStr', function () {
            const a = new Apply(1);
            expect(a.typeStr()).to.be.equal('Apply');
        });
    });

    describe('Identity: u.map(a => a) == u', function () {
        it('should be work for primitive', function () {
            const u = new Apply(5);
            expect(u.map(a => a)).to.be.deep.equal(u);
        });

        it('should be work for set', function () {
            const u = new Apply(new ArraySet([1, 2, 3]));
            expect(u.map(a => a)).to.be.deep.equal(u);
        });
    });

    describe('Composition: u.map(x => f(g(x))) == u.map(g).map(f)', function () {
        it('should be work for primitive', function () {
            const u = new Apply(5);
            const f = function (x) { return x + 5; };
            const g = function (x) { return x * 2; };
            expect(u.map(x => f(g(x)))).to.be.deep.equal(u.map(g).map(f));
        });

        it('should be work for set', function () {
            const u = new Apply(new ArraySet([1, 2, 3]));
            const f = function (x) { return x + 5; };
            const g = function (x) { return x * 2; };
            expect(u.map(x => f(g(x)))).to.be.deep.equal(u.map(g).map(f));
        });
    });

    describe('Composition: v.ap(u.ap(a.map(f => g => x => f(g(x))))) == v.ap(u).ap(a)', function () {
        it('should be work for primitive', function () {
            const v = new Apply(5);
            const u = new Apply(function (x) { return x + 5; });
            const a = new Apply(function (x) { return x * 2; });

            expect(v.ap(u.ap(a.map(f => g => x => f(g(x)))))).to.be.deep.equal(v.ap(u).ap(a));
        });

        it('should be work for set', function () {
            const v = new Apply(new ArraySet([1, 2, 3]));
            const u = new Apply(function (x) { return x + 5; });
            const a = new Apply(function (x) { return x * 2; });

            expect(v.ap(u.ap(a.map(f => g => x => f(g(x)))))).to.be.deep.equal(v.ap(u).ap(a));
        });
    });

    it('should work with set of functions', function () {
        const f = new Apply(new ArraySet([x => x + 5, x => x * 2]));
        const v = new Apply(new ArraySet([1, 2, 3]));
        expect(v.ap(f).get().getArray()).to.be.deep.equal([6, 7, 8, 2, 4, 6]);
    });
});