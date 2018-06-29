const Promise = require('./src/derivative/promise');

const p = new Promise(function (resolve, reject) {
    return resolve(5);
    //return reject(-1);
});

p.then(function (val) {
    console.log(val);
    return val + 1;
}).then(function (val) {
    console.log(val);
    return val * 2;
}).done(function (val) {
    console.log('done', val);
}).catch(function (err) {
    console.log('catch', err);
})