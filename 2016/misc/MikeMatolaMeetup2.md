# A gentle introduction to currying/partial function application in JavaScript

### I struggled through many explanations and examples of currying/partial function application before finally starting to understand it. I offer a gentle introduction to the hows and whys of currying/partial function application in JavaScript (with added bonus: closures).

### Detroit JavaScript Meetup-2 talk by Michael Matola

---

![Illuminati Meme: Those numbers are from a curried function? Illuminati confirmed](https://i.imgflip.com/16nx8s.jpg)

* Haskell Curry
* Schonfinkel

## Use case

First, remainder operator vs. `wrap`

```javascript
> 3 % 12;
3
> 0 % 12;
0
> 12 % 12;
0
```

```javascript
> wrap(12, 3); // "wrap" not implemented yet. We'll get to that.
3
> wrap(12, 0);
0
> wrap(12, 12);
0
```

Remainder and `wrap` give different answers for negative numbers.

```javascript
> -3 % 12;
-3
> wrap(12, -3);
9
```

Why would we want `wrap(12, -3)` to equal 9?

## Tick tock. It's a clock.

The point of our `wrap` is to implement a simple 12-hour clock (the only unit of time is the hour).

It's 3 o'clock. What time will it be in 6 hours? 15 hours? What time was it 3 hours ago?

```javascript
> (3 + 6) % 12;
9
> (3 + 15) % 12;
6
> (3 - 6) % 12;
-3 // ?!!
```

```javascript
> wrap(12, 3 + 6);
9
> wrap(12, 3 + 15);
6
> wrap(12, 3 - 6);
9 // yay!
```

## Implementing `wrap`, first attempt

Implementing `wrap`, version 0.9, naive un-curried, un-partial

```javascript
// v0.9, naive
function wrap(m, x) {
  x = x || 0;
  var result = x % m;
  if (result < 0) {
    result += m;
  }
  return result;
}
```

Implementing `wrap`, version 1.0 (still naive)

```javascript
// v1.0, naive
function wrap(m, x) {
  x = x || 0;
  return ((x % m) + m) % m;
}
```

Are you sick of seeing all those 12s yet? What is the best way to handle that we're so often passing in 12? (DRY)

```javascript
wrap(12, 9);
wrap(12, 15);
wrap(12, -6);
```

## Currying to the rescue (actually partial function application)

Transform a function into another function with generally smaller arity.

```javascript
// v2.0, curried/partial
function wrap(m, x) {
  return function(x) {
    x = x || 0;
    return ((x % m) + m) % m;
  }
}
```

#### Aside

Since this example is hard-coded, you don't actually need to have the inner function's argument x in the outer function's argument list. (This somewhat muddies the idea of reducing the arity, but you can argue style/readability.)

```javascript
// v2.1, curried/partial, eliminate argument
function wrap(m) {
  return function(x) {
    x = x || 0;
    return ((x % m) + m) % m;
  }
}
```

## To the rescue (continued)

But how do we invoke this thing? Ugh, no, doesn't work:

```javascript
> wrap(12, 9);
function(x) {
  x = x || 0;
  return ((x % m) + m) % m;
}
```

Try again:

```javascript
> wrap(12, 9)();
0 // Wrong answer! Bonus point: why does it return zero?
```

Success (at least in terms of getting the right answer):
```javascript
> wrap(12)(9); // Officially, this is currying.
9
```

This gives the correct answer but doesn't address the problem we set out to solve -- to do something about repeatedly passing in 12.

## Success!

Invoke the function, binding the first argument, and store a reference to the returned function (partial function application).

```javascript
> var wrap12 = wrap(12);
> wrap12(9); // Officially, this is partial function application.
9
```

Console output helps us understand how this works. `wrap12` now refers to a function that takes a single parameter `x` and operates on `x` and `m`. The value of `m` in this case has been fixed to 12.

```javascript
> wrap
function wrap(m, x) {
  return function(x) {
    x = x || 0;
    return ((x % m) + m) % m;
  }
}
> wrap12
function(x) {
  x = x || 0;
  return ((x % m) + m) % m;
}
```

## Closure

Back to this 'fixed' variable `m`. How/why can inner function (which returns) access it? Is this valid JavaScript? Is there a closure involved? (JavaScript scoping rules. Yes! Yes!)

The argument `m` to function `wrap` is closed over by the function `wrap12`. Since we don't expose any way to change it, its value is fixed at the time of declaration.

```javascript
console.dir(wrap12);
```

* function anonymous (x)
  * < function scope >
    * Closure
      * m: 12

## More possibilities

```javascript
var wrap24 = wrap(24);
var wrap10 = wrap(10); // French Revolutionary Time
```

Actually our `wrap` is generic enough it could be used in other domains -- wrapping in a simple coordinate plane in a game, for example.

## ES2015

Arrow functions, default parameter:

```javascript
// v3.0, ES2015
const wrap = (m) => {
  return (x = 0) => {
    return ((x % m) + m) % m;
  }
}
```

Further stylistic choices: (curly brackets and `return` keyword can be dropped when function simply returns an expression)

```javascript
// v3.1, ES2015 with bonus style points
const wrap = (m) =>
  (x = 0) => ((x % m) + m) % m;
```

## When? Why?

* When you repeatedly call the same function with (at least some of) the same argument(s)

## Benefits/advantages

Why bother at all with this. Won't something as simple as the following work?

```javascript
// recall, v1.0
function wrap(m, x) {
  x = x || 0;  
  return ((x % m) + m) % m;
}

function wrap12(x) {
  return wrap(12, x);
}
```

The curried/partially applied version:
* Allows us to quickly create new functions, using simple function application.
* Keeps the complexity in a single place.

## Further

* This was a simple hard-coded example, single function deep.
* Generic, arbitrary depth, `bind`, `apply`, libraries...
