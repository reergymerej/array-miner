'use strict';

var VERSION = '0.1.0';
var dataSource;
var cache;
var queries = [];
var lastResultPulledFromCache;

var OPTIONS = {
  dereferenceResults: false,
  maxCacheLength: undefined
};

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

var clonePOJO = function (pojo) {
  return JSON.parse(JSON.stringify(pojo));
};

var dereference = function (arr) {
  var result = [];
  var i, max;

  if (!OPTIONS.dereferenceResults) {
    result = arr;
  } else {
    for (i = 0, max = arr.length; i < max; i++) {
      result.push(clonePOJO(arr[i]));
    }
  }

  return result;
};

var lookup = function (query, arr) {
  var result;

  if (!arr) {
    result = cache[query];
    lastResultPulledFromCache = result !== undefined;

    if (!result) {
      arr = dataSource;
    }
  }

  if (!result) {
    result = arr.filter(function (element) {
      return isMatch(element, query);
    });
  }

  return result;
};

var updateCache = function (lastQuery, result) {
  var query;

  if (OPTIONS.maxCacheLength === undefined || OPTIONS.maxCacheLength > 0 ) {

    queries.push(lastQuery);

    if (lastResultPulledFromCache) {
      queries.splice(queries.indexOf(lastQuery), 1);

    } else {

      if (queries.length > OPTIONS.maxCacheLength) {
        query = queries.shift();
        cache[query] = null;
      }
    }

    if (!lastResultPulledFromCache) {
      cache[lastQuery] = result;
    }
  }
};

var find = function (arr, query) {
  var result;

  if (!Array.isArray(arr)) {
    // search loaded data, not provided in args
    query = arr;
    arr = null;
  }

  result = lookup(query, arr);

  updateCache(query, result);

  return dereference(result);
};

var add = function (data) {
  if (arguments.length > 1) {
    data = Array.prototype.slice.apply(arguments);
  }
  setDataSource(dataSource.concat(data));

  return this;
};

var count = function () {
  return dataSource.length;
};

var clear = function () {
  setDataSource([]);
  return this;
};

var data = function () {
  return dereference(dataSource);
};

var cacheLength = function (length) {
  OPTIONS.maxCacheLength = length;
  return this;
};

var setDereferenceOption = function (use) {
  deprecated('Use set(\'dereference\', ' + !!use + ') instead of dereference(' + !!use + ').');
  OPTIONS.dereferenceResults = !!use;
  return this;
};

var deprecated = function(message) {
  console.warn('Deprecation Warning: %s', message);
};

var options = function (option, value) {
  var result;
  if (arguments.length === 0) {
    result = getOptions();

  } else if (arguments.length === 1) {
    if (typeof option === 'object') {
      result = setOptions.apply(this, [option]);
    } else {
      result = OPTIONS[option];
    }

  } else {
    result = setOptions.apply(this, [option, value]);
  }

  return result;
};

var getOptions = function () {
  return clonePOJO(OPTIONS);
};

var setOptions = function (option, value) {
  var obj;

  if (typeof option === 'object') {
    obj = option;
    Object.keys(obj).forEach(function (option) {
      OPTIONS[option] = obj[option];
    });
  } else {
    OPTIONS[option] = value;
  }

  return this;
};

setDataSource([]);
setDereferenceOption(false);

module.exports = {
  add: add,
  cache: cacheLength,
  clear: clear,
  count: count,
  data: data,
  dereference: setDereferenceOption,
  find: find,
  options: options,
  version: VERSION,
};
