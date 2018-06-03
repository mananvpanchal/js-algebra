const ArraySet = function (val) {
    this.val = val;
};

ArraySet.prototype.forEach = function (func) {
    for(let i = 0; i < this.val.length; i++) {
        func(this.val[i], i);
    }
};

ArraySet.prototype.addValue = function (v) {
    this.val.push(v);
};

ArraySet.prototype.emptySet = function () {
    return new ArraySet([]);
};

ArraySet.prototype.getArray = function () {
    return this.val;
};

module.exports = ArraySet;