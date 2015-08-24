'use strict';

var dataSource;
var cache;

var setDataSource = function (data) {
  dataSource = data;
  cache = {};
};

var isMatch = function (element, query) {
  var found = false;
  var key;
  var compare = function (value) {
    if (typeof value === 'string') {
      value = value.toLowerCase();
    }

    return value === query;
  };

  if (typeof query === 'string') {
    query = query.toLowerCase();
  }

  for (key in element) {
    // Checking hasOwnProp slows down significantly AND
    // we don't care when searching for values.
    if ((found = compare(element[key]))) {
      break;
    }
  }

  return found;
};

var dereference = function (arr) {
  var clean = [];
  var i, max;

  for (i = 0, max = arr.length; i < max; i++) {
    clean.push(JSON.parse(JSON.stringify(arr[i])));
  }

  return clean;
};

var lookup = function (query) {
  var result = cache[query];

  if (!result) {
    result = dataSource.filter(function (element) {
      return isMatch(element, query);
    });
  }

  return result;
};

var find = function (query) {
  var result = lookup(query);

  cache[query] = dereference(result);

  return result;
};

var add = function (data) {
  if (arguments.length > 1) {
    data = Array.prototype.slice.apply(arguments);
  }
  setDataSource(dataSource.concat(data));
};

var count = function () {
  return dataSource.length;
};

var clear = function () {
  setDataSource([]);
};

var data = function () {
  return dereference(dataSource);
};

setDataSource([]);

module.exports = {
  add: add,
  clear: clear,
  count: count,
  data: data,
  find: find,
  version: '0.0.2',
};
