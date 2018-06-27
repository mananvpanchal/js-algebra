const _inherit = function(sub, base) {
    if(Object.setPrototypeOf) {
        Object.setPrototypeOf(sub, base);
    } else {
        sub.__proto__ = base; 
    }
};

module.exports = function (sub, base, staticBase) {
    _inherit(sub.prototype, base.prototype);
    _inherit(sub, staticBase || base);
};