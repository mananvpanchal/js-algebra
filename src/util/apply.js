const { isFunctor } = require('./functor');
const { isSet } = require('./set');

const isApply = function (val) {
    return isFunctor(val)
        && typeof val.ap === 'function';
};

const _applySet = function (set, newSet, apFunc) {
    set.forEach(function (val, idx) {
        newSet.addValue(apFunc(val));
    });
};

const applySet = function (set, apply) {
    const newSet = set.emptySet();
    isSet(apply.get())
        ? apply.get().forEach(function (apFunc) {
            _applySet(set, newSet, apFunc);
        })
        : _applySet(set, newSet, apply.get());
    return newSet;
};

module.exports = { isApply, applySet };