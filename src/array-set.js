const ArraySet = function (val) {
    this.val = val;
    this.index = 0;
};

ArraySet.prototype.hasNextValue = function () {
    return this.index < this.val.length;
};

ArraySet.prototype.getNextValue = function () {
    const v = this.val[this.index];
    this.index = this.index + 1;
    return v;
};

ArraySet.prototype.setNextValue = function (v) {
    this.val.push(v);
};

ArraySet.prototype.emptySet = function () {
    return new ArraySet([]);
};

ArraySet.prototype.resetIndex = function () {
    this.index = 0;
}

module.exports = ArraySet;