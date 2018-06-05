const { expect } = require('chai');
const Applicative = require('./applicative');
const ArraySet = require('./array-set');

describe('Applicative', function () {
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