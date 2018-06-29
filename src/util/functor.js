const isFunctor = function (val) {
    return val
        && typeof val === 'object'
        && val.value !== undefined
        && typeof val.map === 'function';
};

const mapSet = function (set, map) {
    const newSet = set.emptySet();
    set.forEach(function (val, idx) {
        newSet.addValue(map(val));
    });
    return newSet;
};

module.exports = { isFunctor, mapSet };