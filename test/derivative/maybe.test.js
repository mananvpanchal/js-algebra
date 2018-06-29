const { expect } = require('chai');
const { Maybe } = require('../../src/derivative/maybe');
const { ArraySet } = require('../../src/set');
const { isSet } = require('../../src/util');

describe('Maybe', function () {

    describe('Is of Type test', function () {
        it('isMonad', function () {
            const m = Maybe.of(1);
            expect(Maybe.isMonad(m)).to.be.true;
        });

        it('isApplicative', function () {
            const m = Maybe.of(1);
            expect(Maybe.isApplicative(m)).to.be.true;
        });

        it('isChain', function () {
            const m = Maybe.of(1);
            expect(Maybe.isChain(m)).to.be.true;
        });

        it('isApply', function () {
            const m = Maybe.of(1);
            expect(Maybe.isApply(m)).to.be.true;
        });

        it('isFunctor', function () {
            const m = Maybe.of(1);
            expect(Maybe.isFunctor(m)).to.be.true;
        });

        it('typeStr', function () {
            const m = Maybe.of(1);
            expect(m.typeStr()).to.be.equal('Monad');
        });
    });

    describe('Functor: Identity: u.map(a => a) == u', function () {
        it('should be work for primitive', function () {
            const u = Maybe.of(5);
            expect(u.map(a => a)).to.be.deep.equal(u);
        });

        it('should be work for set', function () {
            const u = Maybe.of(new ArraySet([1, 2, 3]));
            expect(u.map(a => a)).to.be.deep.equal(u);
        });
    });

    describe('Functor: Composition: u.map(x => f(g(x))) == u.map(g).map(f)', function () {
        it('should be work for primitive', function () {
            const u = Maybe.of(5);
            const f = function (x) { return x + 5; };
            const g = function (x) { return x * 2; };
            expect(u.map(x => f(g(x)))).to.be.deep.equal(u.map(g).map(f));
        });

        it('should be work for set', function () {
            const u = Maybe.of(new ArraySet([1, 2, 3]));
            const f = function (x) { return x + 5; };
            const g = function (x) { return x * 2; };
            expect(u.map(x => f(g(x)))).to.be.deep.equal(u.map(g).map(f));
        });
    });

    describe('Apply: Composition: v.ap(u.ap(a.map(f => g => x => f(g(x))))) == v.ap(u).ap(a)', function () {
        it('should be work for primitive', function () {
            const v = Maybe.of(5);
            const u = Maybe.of(function (x) { return x + 5; });
            const a = Maybe.of(function (x) { return x * 2; });

            expect(v.ap(u.ap(a.map(f => g => x => f(g(x)))))).to.be.deep.equal(v.ap(u).ap(a));
        });

        it('should be work for set', function () {
            const v = Maybe.of(new ArraySet([1, 2, 3]));
            const u = Maybe.of(function (x) { return x + 5; });
            const a = Maybe.of(function (x) { return x * 2; });

            expect(v.ap(u.ap(a.map(f => g => x => f(g(x)))))).to.be.deep.equal(v.ap(u).ap(a));
        });

        it('should work with set of functions', function () {
            const f = Maybe.of(new ArraySet([x => x + 5, x => x * 2]));
            const v = Maybe.of(new ArraySet([1, 2, 3]));
            expect(v.ap(f).get().getArray()).to.be.deep.equal([6, 7, 8, 2, 4, 6]);
        });
    });

    describe('Chain: Associativity: m.chain(f).chain(g) == m.chain(x => f(x).chain(g))', function () {
        it('should work for primitive', function () {
            const m = Maybe.of(5);
            const f = function (x) { return Maybe.of(x + 5); };
            const g = function (x) { return Maybe.of(x * 2); };
            expect(m.chain(f).chain(g)).to.be.deep.equal(m.chain(x => f(x).chain(g)));
        });

        it('should work for set', function () {
            const m = Maybe.of(new ArraySet([1, 2, 3]));
            const f = function (x) { return Maybe.of(x + 5); };
            const g = function (x) { return Maybe.of(x * 2); };
            expect(m.chain(f).chain(g)).to.be.deep.equal(m.chain(x => f(x).chain(g)));
        });
    });

    describe('Applicative: Identity: v.ap(Maybe.of(x => x)) == v', function () {
        it('should work for primitive', function () {
            const v = Maybe.of(5);
            expect(v.ap(Maybe.of(x => x))).to.be.deep.equal(v);
        });

        it('shoud work for set', function () {
            const v = Maybe.of(new ArraySet([1, 2, 3]));
            expect(v.ap(Maybe.of(x => x))).to.be.deep.equal(v);
        });
    });

    describe('Applicative: Homomorphism: A.of(x).ap(A.of(f)) == A.of(f(x))', function () {
        it('should work for primitive', function () {
            const f = function (x) { return x + 5; };
            expect(Maybe.of(5).ap(Maybe.of(f))).to.be.deep.equal(Maybe.of(f(5)));
        });

        it('shoud NOT work for set (set can\'t be passed to function)', function () {});
    });

    describe('Applicative: Interchange: A.of(y).ap(u) == u.ap(A.of(f => f(y)))', function () {
        it('should work for primitive', function () {
            const u = Maybe.of(function (x) { return x + 5; });
            expect(Maybe.of(5).ap(u)).to.be.deep.equal(u.ap(Maybe.of(f => f(5))));
        });

        it('shoud NOT work for set (set can\'t be passed to function)', function () {});
    });

    describe('Maybe: Left Identity: M.of(a).chain(f) == f(a)', function () {
        it('should work for primitive', function () {
            const f = function (x) { return Maybe.of(x + 5); };
            expect(Maybe.of(5).chain(f)).to.be.deep.equal(f(5));
        });

        it('shoud NOT work for set (set can\'t be passed to function)', function () { });
    });

    describe('Maybe: Right Identity: m.chain(M.of) == m', function () {
        it('should work for primitive', function () {
            const m = Maybe.of(5);
            expect(m.chain(Maybe.of.bind(Maybe))).to.be.deep.equal(m);
        });

        it('should work for set', function () {
            const m = Maybe.of(new ArraySet([1, 2, 3]));
            expect(m.chain(Maybe.of.bind(Maybe))).to.be.deep.equal(m);
        });
    });

    describe('Join', function () {
        it('should work for nested primitive', function () {
            const v1 = Maybe.of(1);
            const v2 = Maybe.of(Maybe.of(1));
            const v3 = Maybe.of(Maybe.of(Maybe.of(Maybe.of(1))));

            expect(v1.join().get()).to.be.equal(1);
            expect(v2.join().get()).to.be.equal(1);
            expect(v3.join().get()).to.be.equal(1);
        });

        it('should work for nested set', function () {
            const v1 = Maybe.of(new ArraySet([Maybe.of(1), Maybe.of(2), Maybe.of(3)]));
            const v2 = Maybe.of(new ArraySet([1, 2, 3]));
            const v3 = Maybe.of(Maybe.of(new ArraySet([
                Maybe.of(new ArraySet([
                    Maybe.of(new ArraySet([Maybe.of(1), Maybe.of(2), Maybe.of(3)])),
                    Maybe.of(new ArraySet([4, Maybe.of(Maybe.of(Maybe.of(5))), 6])),
                    new ArraySet([Maybe.of(7), 8, Maybe.of(Maybe.of(9))])
                ])),
                Maybe.of(new ArraySet([10, 11, 12])),
                Maybe.of(13),
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
            const m = Maybe.of(new ArraySet([1, 2, 3]));
            const f = function (x) { return x + 5; };
            expect(m.chain.bind(m, f)).to.throw('Return value of chain function is not a type of Monad');
        });

        it('shoud check for apply type', function () {
            const a = Maybe.of(1);
            const f = function (x) { return x + 5; };
            expect(a.ap.bind(a, f)).to.throw('Parameter of ap should be type of Monad');
        });
    });

    describe('Maybe testing', function () {
        it('Just', function () {
            expect(Maybe.of(1).map(x => x + 1).get()).to.be.equal(2);
            expect(Maybe.ofNullable(2).getOrElse(3)).to.be.equal(2);
            expect(Maybe.ofNullable(2).orElse(() => Maybe.of(3)).get()).to.be.equal(2);
        });

        it('Nothing', function () {
            expect(Maybe.ofNullable(undefined).map(x => x + 1).get()).to.be.equal(null);
            expect(Maybe.ofNullable(null).getOrElse(3)).to.be.equal(3);
            expect(Maybe.ofNullable(null).orElse(() => Maybe.of(3)).get()).to.be.equal(3);
        });
    });
});