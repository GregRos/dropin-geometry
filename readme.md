# dropin-geometry

The idea of `dropin-geometry` is to provide 2d geometry functions for drawing libraries that lack some of those functions.

This is achieved by having 2d objects that are easily convertible to other object formats used by graphics libraries.

In practice though, there are lots of existing geometry libraries. It's probably better to add functionality to those other libraries.

## Compatibility with other formats

Allow the library to operate on objects in different common formats used by different graphics libraries. 

Functions that accept an object parameter (e.g. a `Vector`, `Matrix`, `Line`, etc) should allow objects in a number of different representations. This would come at a small cost in performance.

Objects of these types should have easily accessible "export" getters or methods for conversions to other formats.

## Unify points, vectors, and complex numbers

Unify the APIs for these three kinds of objects to allow for performing complex operations on objects normally seen as vectors, as these operations can be quite handy and are very meaningful geometrically.

Allow conversion to and from these different representations.

## Convenient angle conversion API

The idea is to allow code like this:

``` typescript
// turn: Turn => Rad
// Actually converts *from* turn
let result1 = Math.sin(turn(0.5)); // the same as Math.sin(π / 2)

let result2 = Math.sin(deg(60)); // The same as Math.sin(π / 3);

let vec = vector([0, 1]);


// todeg: Rad => Deg
// Actually converts *to* deg
let indegrees = todeg(vec.angle());
```

The idea is that all functions will expect to receive angles in `rad`, but concisely named functions are available to convert other measurements to `rad`.

There are also concisely named functions to convert back.