const { Monad } = require('../algebra');
const { inherit } = require('../util');

const Promise = function (callback) {
    if (!callback) throw Error('Value / Callbase cant be null / undefined');

    if (typeof callback === 'function') {
        this.callback = callback;
        Monad.call(this, callback(this.resolve, this.reject));
    } else {
        Monad.call(this, callback);
    }
};

inherit(Promise, Monad);

Promise.prototype.then = function (thenCB) {
    return this.get().isResolved() 
        ? Resolved.of(Resolved.of((thenCB(this.join().get())))) 
        : Rejected.of(Rejected.of(this.join().get()));
};

Promise.prototype.catch = function (catchCB) {
    const val = this.get();
    if(!this.get().isResolved()) {
        catchCB(this.join().get());
    }
    return Promise.of(this.join().get());
};

Promise.prototype.done = function (doneCB) {
    if(this.get().isResolved()) {
        doneCB(this.join().get());
    }
    return Promise.of(this.get());
};

Promise.prototype.isResolved = function () {
    return this.getStr() === 'Resolved';
}


const Resolved = function (value) {
    Promise.call(this, value);
};

inherit(Resolved, Promise);

Resolved.prototype.getStr = function () {
    return 'Resolved';
};


const Rejected = function (error) {
    Promise.call(this, error);
};

inherit(Rejected, Promise);

Rejected.prototype.getStr = function () {
    return 'Rejected';
};


Promise.prototype.resolve = function (value) {
    return Resolved.of(value);
};

Promise.prototype.reject = function (error) {
    return Rejected.of(error)
};


module.exports = Promise;