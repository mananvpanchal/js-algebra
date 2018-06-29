const { isApply } = require('./apply');

const isApplicative = function (val) {
    return isApply(val)
        && typeof val.constructor.of === 'function';
};

module.exports = { isApplicative };