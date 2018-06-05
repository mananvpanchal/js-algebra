const Apply = require('./apply');
const { expect } = require('chai');
const ArraySet = require('./array-set');

describe('Apply', function () {
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