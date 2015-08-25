'use strict';

var VERSION = '0.0.3';
var dataSource;
var cache;
var maxCacheLength;
var queries = [];
var useDereferencing;

var setDataSource = function (data) {
  dataSource = data;
  cache = {};
  queries = [];
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
  var result = [];
  var i, max;

  if (!useDereferencing) {
    result = arr;
  } else {
    for (i = 0, max = arr.length; i < max; i++) {
      result.push(JSON.parse(JSON.stringify(arr[i])));
    }
  }

  return result;
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

var updateCache = function (lastQuery, result) {
  var query;

  if (maxCacheLength === undefined || maxCacheLength > 0 ) {
    if (queries.push(lastQuery) > maxCacheLength) {
      query = queries.shift();
      cache[query] = null;
    }

    cache[query] = result;
  }
};

var find = function (query) {
  var result = lookup(query);

  updateCache(query);

  return dereference(result);
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

var cacheLength = function (length) {
  maxCacheLength = length;
};

var setDereferenceOption = function (use) {
  useDereferencing = !!use;
};

setDataSource([]);
setDereferenceOption(true);

module.exports = {
  add: add,
  cache: cacheLength,
  clear: clear,
  count: count,
  data: data,
  dereference: setDereferenceOption,
  find: find,
  version: VERSION,
};
