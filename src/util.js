const isSet = function (val) {
    return val 
        && typeof val === 'object'
        && ('hasNextValue' in val)
        && ('getNextValue' in val)
        && ('setNextValue' in val)
        && ('emptySet' in val);
};

exports.isSet = isSet;