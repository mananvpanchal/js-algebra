/*const Monad = require('./monad');

const promise = Monad.of(null, function (monad) {

    monad.catch = function (catchCB) {
        monad.err = catchCB(monad.err);
        return monad;
    };

    monad.then = function (thenCB) {
        monad.res = thenCB(monad.res);
        return monad;
    };

    const resolve = function (res) {
        monad.res = res;
    }

    const reject = function (err) {
        monad.err = err;
    };

    const callback = function(resolve, reject) {
        //resolve(4);
        reject(5);
    };

    callback(resolve, reject);
});

console.log(promise);
promise.then(function (res) {

}).catch(function (err) {
    console.log(err);
});*/