const { expect } = require('chai');
const Chain = require('./chain');
const ArraySet = require('./array-set');

describe('Chain', function () {
    describe('Associativity: m.chain(f).chain(g) == m.chain(x => f(x).chain(g))', function () {
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

    it('should work for nested primitive', function () {
        const v1 = new Chain(1);
        const v2 = new Chain(new Chain(1));
        const v3 = new Chain(new Chain(new Chain(new Chain(1))));

        expect(v1.join().get()).to.be.equal(1);
        expect(v2.join().get()).to.be.equal(1);
        expect(v3.join().get()).to.be.equal(1);
    });

    it('should work for nested set', function () {
        const v1 = new Chain(new ArraySet([new Chain(1), new Chain(2), new Chain(3)]));
        const v2 = new Chain(new ArraySet([1, 2, 3]));
        const v3 = new Chain(new Chain(new ArraySet([
            new Chain(new ArraySet([
                new Chain(new ArraySet([new Chain(1), new Chain(2), new Chain(3)])),
                new Chain(new ArraySet([4, new Chain(new Chain(new Chain(5))), 6])),
                new ArraySet([new Chain(7), 8, new Chain(new Chain(9))])
            ])),
            new Chain(new ArraySet([10, 11, 12])),
            new Chain(13),
            14])
        ));

        expect(v1.join().get().getArray()).to.be.deep.equal([1, 2, 3]);
        expect(v2.join().get().getArray()).to.be.deep.equal([1, 2, 3]);
        expect(v3.join().get().getArray()).to.be.deep.equal([
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
        ]);
    });
});
