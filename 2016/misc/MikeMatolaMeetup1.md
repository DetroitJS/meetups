# Programmatically filling...

### a JavaScript array with values (without using for loops or external libraries), or, the one useful use of the Array constructor (mit apply() special sauce), or, ES6/ES2015 makes this less ugly.

### Detroit JavaScript Meetup-1 talk by Michael Matola

---

## Use Cases

* Times (behind the scenes implemented with array)
* Range
* Programmatically fill array with values, per a callback function

## (Shhh!)

* All of this could be done with a for loop instead
* All of this could be done with Underscore.js's or lodash's `_.range()` function

## My goals
* No for loop (more functional approach)
* No library (VanillaJS)

---

```javascript
> function sayHi() { console.log('Hello, Detroit JavaScript!'); }
> function cube(x, i) { return Math.pow(3, i); }
>
> [3, 3, 3].forEach(sayHi);
> [25, 26, 27, 28].forEach( /* do something useful with these numbers */);
> [1, 3, 9, 27, 81, 243, 729, 2187, 6561, 19683].forEach( /* */ );
```

#### Aside

Array constructor behaves the same whether or not you invoke it with new, so `new Array(10)` and `Array(10)` produce the same results.

## Why doesn't the naive solution for programmatically filling an array work?

So let's try `map`ping over an array created with the array constructor.

```javascript
> var arr = new Array(10).map(function(x, i) {
    return Math.pow(3, i);
  });
> arr;
[undefined × 10]
```

Does `new Array(10)` give us a real array? -Yes.

```javascript
> Array.isArray(arr);
true
> Object.prototype.toString.call(arr);
"[object Array]"
> arr.join();
",,,,,,,,,"
> console.dir(arr);
```

* Array[10]
  * length: 10

Contrast that with:

```javascript
> console.dir([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);  
```

* Array[10]
  * length: 10
  * 0: 0
  * 1: 1
  * and so forth

Contrast that with:

```javascript
> var arr2 = [,,,,,,,,,,];
> arr2;
[undefined × 10]
> console.dir(arr2);
```

* Array[10]
  * length: 10

## JavaScript arrays

* JavaScript arrays can have "holes."
* These holes are effectively missing indexes (think of a JavaScript array as more like a map/dictionary).
* Trying to access a hole results in `undefined`. An array element can also have the value `undefined`. It can be hard to tell the difference. (`console.dir` output in some browsers and Node.js REPL is helpful.)
* You can create holes by assignment or by setting the length of an existing array.
* You almost never want holes in your array.
* The Array constructor (unhelpfully?) creates an array with the specified length, but with holes instead of indexes.
* `Array.prototype.forEach` and `Array.prototype.map` skip holes.
* Using `Function.prototype.apply` on the Array constructor or an array-like object turns each hole into an index whose value is `undefined`.
* The only time I've found any of this array hole stuff to be useful is programmatically filling an array with values using this "apply constructor" technique.

## Solution

So don't just *invoke* the Array constructor, *apply* the Array constructor with an invocation of the Array constructor as the second argument to turn the holes into elements with the value `undefined`:

```javascript
> var arr = Array.apply(null, new Array(10));
> arr;
[undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]
> console.dir(arr);
```

* Array[10]
  * length: 10
  * 0: undefined
  * 1: undefined
  * and so forth

Finally, the solution with `map`:

```javascript
> var arr = Array.apply(null, new Array(10)).map(function(x, i) {
    return Math.pow(3, i);
  });
> arr;
[1, 3, 9, 27, 81, 243, 729, 2187, 6561, 19683]
> console.dir(arr);
```

* Array[10]
  * length: 10
  * 0: 1
  * 1: 3
  * 2: 9
  * and so forth

Alternately, use an array-like object:

```javascript
> var arr = Array.apply(null, {length: 10}).map(function(x, i) {
    return Math.pow(3, i);
  });
> arr;
[1, 3, 9, 27, 81, 243, 729, 2187, 6561, 19683]
```

## ES2015 offers additional solutions

* `Array.from` can convert an Iterable or array-like object into an array, taking a mapping function as optional second argument (more efficient than separately calling `map`)).
* Spread operator

```javascript
Array.from(Array(10), (x, i) => Math.pow(3, i));
Array.from({length: 10}, (x, i) => Math.pow(3, i));
[...Array(10)].map((x, i) => Math.pow(3, i));
```

Not just numbers:

```javascript
> [...Array(26)].map((x, index) => String.fromCharCode(index + 'a'.charCodeAt(0)));
["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
```

## For grins

```javascript
> Array.from({length:3}).forEach(sayHi);
> [...Array(3)].forEach(sayHi);
> [...Array(3).keys()].forEach(sayHi);
```

(`forEach` does visit elements whose value is `undefined`.)

Note:

```javascript
> var g = [...Array(3)];
> g
[undefined, undefined, undefined]
```

* Array[3]
  * length: 3
  * 0: undefined
  * 1: undefined
  * 2: undefined

```javascript
> var g2 = [...Array(3).keys()];
> g2;
[0, 1, 2]
```

## Filter out the holes

```javascript
> var holey = [1, 3, 5, , , , 7, 9, 11];
> holey;
[1, 3, 5, undefined × 3, 7, 9, 11]
> holey.filter(() => true);
[1, 3, 5, 7, 9, 11]
```

## Reference

* *Speaking JavaScript* by Dr. Axel Rauschmayer, http://www.2ality.com
* Several StackOverflow discussions
