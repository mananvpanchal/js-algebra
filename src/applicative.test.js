const { expect } = require('chai');
const Applicative = require('./applicative');
const ArraySet = require('./array-set');

describe('Applicative', function () {

    describe('Is of Type test', function () {
    
        it('isApplicative', function () {
            const a = Applicative.of(1);
            expect(Applicative.isApplicative(a)).to.be.true;
        });

        it('isApply', function () {
            const a = Applicative.of(1);
            expect(Applicative.isApply(a)).to.be.true;
        });

        it('isFunctor', function () {
            const a = Applicative.of(1);
            expect(Applicative.isFunctor(a)).to.be.true;
        });

        it('typeStr', function () {
            const a = Applicative.of(1);
            expect(a.typeStr()).to.be.equal('Applicative');
        });
    });

    describe('Identity: u.map(a => a) == u', function () {
        it('should be work for primitive', function () {
            const u = Applicative.of(5);
            expect(u.map(a => a)).to.be.deep.equal(u);
        });

        it('should be work for set', function () {
            const u = Applicative.of(new ArraySet([1, 2, 3]));
            expect(u.map(a => a)).to.be.deep.equal(u);
        });
    });

    describe('Composition: u.map(x => f(g(x))) == u.map(g).map(f)', function () {
        it('should be work for primitive', function () {
            const u = Applicative.of(5);
            const f = function (x) { return x + 5; };
            const g = function (x) { return x * 2; };
            expect(u.map(x => f(g(x)))).to.be.deep.equal(u.map(g).map(f));
        });

        it('should be work for set', function () {
            const u = Applicative.of(new ArraySet([1, 2, 3]));
            const f = function (x) { return x + 5; };
            const g = function (x) { return x * 2; };
            expect(u.map(x => f(g(x)))).to.be.deep.equal(u.map(g).map(f));
        });
    });

    describe('Composition: v.ap(u.ap(a.map(f => g => x => f(g(x))))) == v.ap(u).ap(a)', function () {
        it('should be work for primitive', function () {
            const v = Applicative.of(5);
            const u = Applicative.of(function (x) { return x + 5; });
            const a = Applicative.of(function (x) { return x * 2; });

            expect(v.ap(u.ap(a.map(f => g => x => f(g(x)))))).to.be.deep.equal(v.ap(u).ap(a));
        });

        it('should be work for set', function () {
            const v = Applicative.of(new ArraySet([1, 2, 3]));
            const u = Applicative.of(function (x) { return x + 5; });
            const a = Applicative.of(function (x) { return x * 2; });

            expect(v.ap(u.ap(a.map(f => g => x => f(g(x)))))).to.be.deep.equal(v.ap(u).ap(a));
        });
    });

    it('should work with set of functions', function () {
        const f = Applicative.of(new ArraySet([x => x + 5, x => x * 2]));
        const v = Applicative.of(new ArraySet([1, 2, 3]));
        expect(v.ap(f).get().getArray()).to.be.deep.equal([6, 7, 8, 2, 4, 6]);
    });

    describe('Identity: v.ap(Applicative.of(x => x)) == v', function () {
        it('shoud work for primitive', function () {
            const v = Applicative.of(5);
            expect(v.ap(Applicative.of(x => x))).to.be.deep.equal(v);
        });

        it('shoud work for set', function () {
            const v = Applicative.of(new ArraySet([1, 2, 3]));
            expect(v.ap(Applicative.of(x => x))).to.be.deep.equal(v);
        });
    });

    describe('Homomorphism: A.of(x).ap(A.of(f)) == A.of(f(x))', function () {
        it('should work for primitive', function () {
            const f = function (x) { return x + 5; };
            expect(Applicative.of(5).ap(Applicative.of(f))).to.be.deep.equal(Applicative.of(f(5)));
        });

        it('shoud NOT work for set (set can\'t be passed to function)', function () {});
    });

    describe('Interchange: A.of(y).ap(u) == u.ap(A.of(f => f(y)))', function () {
        it('should work for primitive', function () {
            const u = Applicative.of(function (x) { return x + 5; });
            expect(Applicative.of(5).ap(u)).to.be.deep.equal(u.ap(Applicative.of(f => f(5))));
        });

        it('shoud NOT work for set (set can\'t be passed to function)', function () {});
    });
});