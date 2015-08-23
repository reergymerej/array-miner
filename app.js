'use strict';

var cache = {};
var dataSource = [];

var isMatch = function (element, query) {
  var found = false;
  var compare = function (value) {
    if (typeof value === 'string') {
      value = value.toLowerCase();
    }

    return value === query;
  };

  if (typeof query === 'string') {
    query = query.toLowerCase();
  }

  Object.keys(element).every(function (key) {
    found = compare(element[key]);
    return !found;
  });
  return found;
};

var lookup = function (query) {
  var result = cache[query];
  var matches;
  
  if (!result) {
    matches = dataSource.filter(function (element) {
      return isMatch(element, query);
    });

    if (matches.length === 1) {
      result = matches[0];
    } else if (matches.length > 1) {
      result = matches;
    }
  }

  return (cache[query] = result);
};

var add = function (data) {
  if (arguments.length > 1) {
    data = Array.prototype.slice.apply(arguments);
  }
  dataSource = dataSource.concat(data);
};

var count = function () {
  return dataSource.length;
};

var clear = function () {
  dataSource = [];
};

var data = function () {
  return dataSource.slice();
};

module.exports = {
  version: '0.0.1',
  add: add,
  find: lookup,
  count: count,
  clear: clear,
  data: data
};
