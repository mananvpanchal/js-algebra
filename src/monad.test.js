const { expect } = require('chai');
const Monad = require('./monad');
const ArraySet = require('./array-set');
const { isSet } = require('./util');

describe('Monad rules', function () {
    describe('M.of(a).chain(f) should be f(a)', function () {

        it('should work for prmitive', function () {
            const f = function (x) { return Monad.of(x + 2); };
            expect(Monad.of(5).chain(f).get()).to.equal(f(5).get());
        });

        it('should work for set', function () {
            const set = new ArraySet([1, 2, 3]);
            const f = function (x) {
                if (isSet(x)) {
                    const x1 = x.emptySet();
                    x.forEach(function (val, idx) {
                        x1.addValue(val + 2);
                    });
                    return Monad.of(x1);
                } else {
                    return Monad.of(x + 2);
                }
            };
            const exp = Monad.of(set).chain(f).get();
            const act = f(set).get();
            expect(exp).to.deep.equal(act);
        });
    });

    describe('Monad m.chain(M.of) should be m', function () {

        it('should work for primitive', function () {
            const f = function (x) { return Monad.of(x + 2); };
            const m = Monad.of(5);
            expect(m.chain(Monad.of)).to.deep.equal(m);
        });

        it('should work for set', function () {
            const f = function (x) {
                if (isSet(x)) {
                    const x1 = x.emptySet();
                    x.forEach(function (val, idx) {
                        x1.addValue(val + 2);
                    });
                    return Monad.of(x1);
                } else {
                    return Monad.of(x + 2);
                }
            };
            const val = new ArraySet([1, 2, 3]);
            const m = Monad.of(val);
            const exp = m.chain(Monad.of);
            expect(exp).to.deep.equal(m);
        });
    });
});

describe('Chain rules', function () {
    describe('Monad m.chain(f).chain(g) should be m.chain(x => f(x).chain(g))', function () {

        const f = function (x) { return Monad.of(x + 5); };
        const g = function (x) { return Monad.of(x * 2); };

        it('should work for primitive', function () {
            const m = Monad.of(5);
            const exp = m.chain(f).chain(g);
            const act = m.chain(x => f(x).chain(g));
            expect(exp).to.be.deep.equal(act);
        });

        it('should work for set', function () {
            const val = new ArraySet([1, 2, 3]);
            const m = Monad.of(val);
            const exp = m.chain(f).chain(g);
            const act = m.chain(x => f(x).chain(g));
            expect(exp).to.be.deep.equal(act);
        })
    });
});

describe('Applicative rules', function() {
    describe('Monad v.ap(A.of(x => x)) should be v', function () {

        it('should work for primitive', function () {
            const v = Monad.of(5);
            const exp = v.ap(Monad.of(x => x));
            expect(exp).to.be.deep.equal(v);
        });

        it('should work for set', function () {
            const val = new ArraySet([1, 2, 3]);
            const v = Monad.of(val);
            const exp = v.ap(Monad.of(x => x));
            expect(exp).to.be.deep.equal(v);
        });
    });
});

describe('Set of value, set of functions', function () {
    it('should ap work', function () {
        const f = Monad.of(new ArraySet([x => x + 5, x => x * 2]));
        const v = Monad.of(new ArraySet([1, 2, 3]));
        expect(v.ap(f).get().getArray()).to.be.deep.equal([6, 7, 8, 2, 4, 6]);
    });
});

describe('Join', function () {
    it('should work for primitive', function () {
        const v3 = Monad.of(Monad.of(Monad.of(Monad.of(1))));
        const v1 = Monad.of(Monad.of(1));
        const v2 = Monad.of(1);
        expect(v1.join().get()).to.be.equal(1);
        expect(v2.join().get()).to.be.equal(1);
        expect(v3.join().get()).to.be.equal(1);
    });

    it('should work for set', function () {
        const v3 = Monad.of(Monad.of(new ArraySet([
            Monad.of(new ArraySet([
                Monad.of(new ArraySet([Monad.of(1), Monad.of(2), Monad.of(3)])), 
                Monad.of(new ArraySet([4, Monad.of(Monad.of(Monad.of(5))), 6])), 
                Monad.of(new ArraySet([Monad.of(7), Monad.of(8), Monad.of(9)]))
            ])), 
            Monad.of(new ArraySet([10, 11, 12])), 
            Monad.of(13), 14])));
        //const v1 = Monad.of(new ArraySet([Monad.of(1), Monad.of(2), Monad.of(3)]));
        //const v2 = Monad.of(new ArraySet([1, 2, 3]));
        //expect(v1.join().get().getArray()).to.be.deep.equal([1, 2, 3]);
        //expect(v2.join().get().getArray()).to.be.deep.equal([1, 2, 3]);
        console.log(v3.join());
    });
});