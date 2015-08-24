[![Build Status](https://travis-ci.org/reergymerej/array-miner.svg)](https://travis-ci.org/reergymerej/array-miner)

Search through an array of objects easily and efficiently.

## Quick Start

```js
var arrayMiner = require('array-miner');

arrayMiner.add([
  { id: 1, color: 'red', type: 'foo' },
  { id: 2, color: 'white', type: 'foo' },
  { id: 3, type: 'bar' }
]);

arrayMiner.find('foo');
// [ { id: 1, color: 'red', type: 'foo' },
//   { id: 2, color: 'white', type: 'foo' } ]
```

## API

### add
```js
arrayMiner.add([
  { foo: 123, bar: 1 },
  { apply: 1, pie: 1 },
  { 123: 'foo', 'some-key': 4 }
]);

arrayMiner.add({ id: 'unique' }, { foo: 4 }, { monkey: 'foo' });
```
Add items as an array or as individual parameters.


### clear
```js
arrayMiner.clear();
```
Clears out all items previously added.


### count
```js
arrayMiner.count();
```
Returns the length of the current data.  You could use `.data().length`, but this is faster.


### data
```js
arrayMiner.data();
```
Returns all the loaded data, dereferenced.


### find
```js
arrayMiner.find('fountain of youth');
```
Any object in the array with a matching property value will be returned in the results.  Results are dereferenced to prevent accidental side-effects and cached to speed up subsequent searches.


### version
```js
arrayMiner.version;
```
Check the current version.