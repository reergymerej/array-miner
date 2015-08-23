'use strict';

var will = require('willy').will;
var app = require('../app.js');

describe('sanity', function () {
  it('should load', function () {
    will(app).exist();
  });

  it('should show a version', function () {
    will(app.version).exist();
  });
});

describe('loading data', function () {
  afterEach(function () {
    app.clear();
  });

  it('should accept an array', function () {
    app.add([{}, {}, {}]);
    will(app.count()).be(3);
  });

  it('should accept individul objects', function () {
    app.add({}, {}, {});
    will(app.count()).be(3);
  });

  it('should keep a count of the items in the data set', function () {
    app.add({}, {});
    app.add({}, {});
    will(app.count()).be(4);
  });
});

describe('clearing data', function () {
  it('should clear data with `clear`', function () {
    app.add({});
    will(app.count()).be(1);
    app.clear();
    will(app.count()).be(0);
  });
});

describe('getting raw data', function () {
  var items = [{a: 1}, {b: 2}, {a: 99}];
  
  beforeEach(function () {
    app.add(items);
  });

  afterEach(function () {
    app.clear();
  });

  it('should expose the underlying data when requested', function () {
    will(app.data()).beLike(items);
  });

  it('should not affect the data when the returned stuff is messed with', function () {
    var data = app.data();
    var length = data.length;
    data.splice(0, length);
    will(app.data().length).be(length);
  });
});

xdescribe('caching', function () {
  it('should cache lookups', function () {
    var start, first, second;

    start = process.hrtime()[1];
    app(3);
    first = process.hrtime()[1] - start;

    start = process.hrtime()[1];
    app(3);
    second = process.hrtime()[1] - start;

    will(second).beLessThan(first);
  });
});