const { ArraySet } = require('./src/set');
const { Functor, Apply, Applicative, Chain, Monad } = require('./src/algebra');

exports.default = Monad;

exports.ArraySet = ArraySet;
exports.Functor = Functor;
exports.Apply = Apply;
exports.Applicative = Applicative;
exports.Chain = Chain;
