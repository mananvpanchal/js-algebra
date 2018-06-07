# Algebra implementation in Javascript 

### The implementation is based on [fantacy-land](https://github.com/fantasyland/fantasy-land) specification

The algebra can be any of type and set.

An object can be said as `set` if it has below functions.

* forEach: 
- The function iterates for each value of set.
- The function has a function as argument. The arg function should be call for each value passing to it.

* addValue: 
- The function adds value to set.
- The function has a value as argument.

* emptySet: 
- The function returns empty set of same kind.
- The function has no arguemnt but should return same kind of empty set.
