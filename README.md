# array-miner 0.0.3

Search through an array of objects easily and efficiently.

[![Build Status](https://travis-ci.org/reergymerej/array-miner.svg)](https://travis-ci.org/reergymerej/array-miner)

## Quick Start

```js
var arrayMiner = require('array-miner');

var data = [
  { id: 1, color: 'red', type: 'foo' },
  { id: 2, color: 'white', type: 'foo' },
  { id: 3, type: 'bar' }
];

arrayMiner.find(data , 'foo');
// [ { id: 1, color: 'red', type: 'foo' },
//   { id: 2, color: 'white', type: 'foo' } ]
```

If you plan on searching through the data repeatedly, load it with `add`.
```js
arrayMiner.add(data).find('foo');
// [ { id: 1, color: 'red', type: 'foo' },
//   { id: 2, color: 'white', type: 'foo' } ]

```


## API

### add
Add items as an array or as individual parameters.
```js
arrayMiner.add([
  { foo: 123, bar: 1 },
  { apply: 1, pie: 1 },
  { 123: 'foo', 'some-key': 4 }
]);

arrayMiner.add({ id: 'unique' }, { foo: 4 }, { monkey: 'foo' });
```


### cache
Set the number if query results to cache.  By default, this is `undefined`, which caches everything (until the cache is invalidated by another operation).
```js
arrayMiner.cache(10);
```


### clear
Clears out all items previously added.
```js
arrayMiner.clear();
```


### count
Returns the length of the current data.  You could use `.data().length`, but this is faster.
```js
arrayMiner.count();
```


### data
Returns all the loaded data, dereferenced.
```js
arrayMiner.data();
```


### dereference
Turn dereferencing on/off.  When off, queries are faster, but results are returned by reference.  By default, dereferencing is off.
```js
arrayMiner.dereference(true);
```


### find
Any object in the array with a matching property value will be returned in the results.  Comparison is done with `===`.
```js
arrayMiner.find('fountain of youth');
```


### version
Check the current version.
```js
arrayMiner.version;
```