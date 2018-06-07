const { expect } = require('chai');
const Monad = require('./monad');
const ArraySet = require('./array-set');
const { isSet } = require('./util');

describe('Monad', function () {

    describe('Is of Type test', function () {
        it('isMonad', function () {
            const m = Monad.of(1);
            expect(Monad.isMonad(m)).to.be.true;
        });

        it('isApplicative', function () {
            const m = Monad.of(1);
            expect(Monad.isApplicative(m)).to.be.true;
        });

        it('isChain', function () {
            const m = Monad.of(1);
            expect(Monad.isChain(m)).to.be.true;
        });

        it('isApply', function () {
            const m = Monad.of(1);
            expect(Monad.isApply(m)).to.be.true;
        });

        it('isFunctor', function () {
            const m = Monad.of(1);
            expect(Monad.isFunctor(m)).to.be.true;
        });

        it('typeStr', function () {
            const m = Monad.of(1);
            expect(m.typeStr()).to.be.equal('Monad');
        });
    });

    describe('Identity: u.map(a => a) == u', function () {
        it('should be work for primitive', function () {
            const u = Monad.of(5);
            expect(u.map(a => a)).to.be.deep.equal(u);
        });

        it('should be work for set', function () {
            const u = Monad.of(new ArraySet([1, 2, 3]));
            expect(u.map(a => a)).to.be.deep.equal(u);
        });
    });

    describe('Composition: u.map(x => f(g(x))) == u.map(g).map(f)', function () {
        it('should be work for primitive', function () {
            const u = Monad.of(5);
            const f = function (x) { return x + 5; };
            const g = function (x) { return x * 2; };
            expect(u.map(x => f(g(x)))).to.be.deep.equal(u.map(g).map(f));
        });

        it('should be work for set', function () {
            const u = Monad.of(new ArraySet([1, 2, 3]));
            const f = function (x) { return x + 5; };
            const g = function (x) { return x * 2; };
            expect(u.map(x => f(g(x)))).to.be.deep.equal(u.map(g).map(f));
        });
    });

    describe('Composition: v.ap(u.ap(a.map(f => g => x => f(g(x))))) == v.ap(u).ap(a)', function () {
        it('should be work for primitive', function () {
            const v = Monad.of(5);
            const u = Monad.of(function (x) { return x + 5; });
            const a = Monad.of(function (x) { return x * 2; });

            expect(v.ap(u.ap(a.map(f => g => x => f(g(x)))))).to.be.deep.equal(v.ap(u).ap(a));
        });

        it('should be work for set', function () {
            const v = Monad.of(new ArraySet([1, 2, 3]));
            const u = Monad.of(function (x) { return x + 5; });
            const a = Monad.of(function (x) { return x * 2; });

            expect(v.ap(u.ap(a.map(f => g => x => f(g(x)))))).to.be.deep.equal(v.ap(u).ap(a));
        });

        it('should work with set of functions', function () {
            const f = Monad.of(new ArraySet([x => x + 5, x => x * 2]));
            const v = Monad.of(new ArraySet([1, 2, 3]));
            expect(v.ap(f).get().getArray()).to.be.deep.equal([6, 7, 8, 2, 4, 6]);
        });
    });

    describe('Associativity: m.chain(f).chain(g) == m.chain(x => f(x).chain(g))', function () {
        it('should work for primitive', function () {
            const m = Monad.of(5);
            const f = function (x) { return Monad.of(x + 5); };
            const g = function (x) { return Monad.of(x * 2); };
            expect(m.chain(f).chain(g)).to.be.deep.equal(m.chain(x => f(x).chain(g)));
        });

        it('should work for set', function () {
            const m = Monad.of(new ArraySet([1, 2, 3]));
            const f = function (x) { return Monad.of(x + 5); };
            const g = function (x) { return Monad.of(x * 2); };
            expect(m.chain(f).chain(g)).to.be.deep.equal(m.chain(x => f(x).chain(g)));
        });
    });

    describe('Identity: v.ap(Monad.of(x => x)) == v', function () {
        it('shoud work for primitive', function () {
            const v = Monad.of(5);
            expect(v.ap(Monad.of(x => x))).to.be.deep.equal(v);
        });

        it('shoud work for set', function () {
            const v = Monad.of(new ArraySet([1, 2, 3]));
            expect(v.ap(Monad.of(x => x))).to.be.deep.equal(v);
        });
    });

    describe('Homomorphism: A.of(x).ap(A.of(f)) == A.of(f(x))', function () {
        it('should work for primitive', function () {
            const f = function (x) { return x + 5; };
            expect(Monad.of(5).ap(Monad.of(f))).to.be.deep.equal(Monad.of(f(5)));
        });

        it('shoud NOT work for set (set can\'t be passed to function)', function () {});
    });

    describe('Interchange: A.of(y).ap(u) == u.ap(A.of(f => f(y)))', function () {
        it('should work for primitive', function () {
            const u = Monad.of(function (x) { return x + 5; });
            expect(Monad.of(5).ap(u)).to.be.deep.equal(u.ap(Monad.of(f => f(5))));
        });

        it('shoud NOT work for set (set can\'t be passed to function)', function () {});
    });

    describe('Left Identity: M.of(a).chain(f) == f(a)', function () {
        it('should work for primitive', function () {
            const f = function (x) { return Monad.of(x + 5); };
            expect(Monad.of(5).chain(f)).to.be.deep.equal(f(5));
        });

        it('shoud NOT work for set (set can\'t be passed to function)', function () { });
    });

    describe('Right Identity: m.chain(M.of) == m', function () {
        it('should work for primitive', function () {
            const m = Monad.of(5);
            expect(m.chain(Monad.of.bind(Monad))).to.be.deep.equal(m);
        });

        it('should work for set', function () {
            const m = Monad.of(new ArraySet([1, 2, 3]));
            expect(m.chain(Monad.of.bind(Monad))).to.be.deep.equal(m);
        });
    });

    describe('Join', function () {
        it('should work for nested primitive', function () {
            const v1 = Monad.of(1);
            const v2 = Monad.of(Monad.of(1));
            const v3 = Monad.of(Monad.of(Monad.of(Monad.of(1))));

            expect(v1.join().get()).to.be.equal(1);
            expect(v2.join().get()).to.be.equal(1);
            expect(v3.join().get()).to.be.equal(1);
        });

        it('should work for nested set', function () {
            const v1 = Monad.of(new ArraySet([Monad.of(1), Monad.of(2), Monad.of(3)]));
            const v2 = Monad.of(new ArraySet([1, 2, 3]));
            const v3 = Monad.of(Monad.of(new ArraySet([
                Monad.of(new ArraySet([
                    Monad.of(new ArraySet([Monad.of(1), Monad.of(2), Monad.of(3)])),
                    Monad.of(new ArraySet([4, Monad.of(Monad.of(Monad.of(5))), 6])),
                    new ArraySet([Monad.of(7), 8, Monad.of(Monad.of(9))])
                ])),
                Monad.of(new ArraySet([10, 11, 12])),
                Monad.of(13),
                14])
            ));

            expect(v1.join().get().getArray()).to.be.deep.equal([1, 2, 3]);
            expect(v2.join().get().getArray()).to.be.deep.equal([1, 2, 3]);
            expect(v3.join().get().getArray()).to.be.deep.equal([
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
            ]);
        });
    });

    describe('Error checking', function () {
        it('shoud check for monad type', function () {
            const m = Monad.of(new ArraySet([1, 2, 3]));
            const f = function (x) { return x + 5; };
            expect(m.chain.bind(m, f)).to.throw('Return value of chain function is not a type of Monad');
        });

        it('shoud check for apply type', function () {
            const a = Monad.of(1);
            const f = function (x) { return x + 5; };
            expect(a.ap.bind(a, f)).to.throw('Parameter of ap should be type of Monad');
        });
    });
});