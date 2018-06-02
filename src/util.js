const isSet = function (val) {
    return val 
        && typeof val === 'object'
        && ('forEach' in val)
        && ('addValue' in val)
        && ('emptySet' in val);
};

exports.isSet = isSet;