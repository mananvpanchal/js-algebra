const isSet = function (val) {
    return val
        && typeof val === 'object'
        && typeof val.forEach === 'function'
        && typeof val.addValue === 'function'
        && typeof val.emptySet === 'function';
};

module.exports = { isSet };