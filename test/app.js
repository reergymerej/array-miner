'use strict';

var will = require('willy').will;
var app = require('../app.js');

var generateData = function (count) {
  var data = [];

  while (count--) {
    data.push({
      id: data.length,
      time: Date.now(),
      rand: Math.random(),
      foo: count,
      num: count % 4
    });
  }

  return data;
};

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

describe('find', function () {
  var DATA = [
    { id: 1, color: 'red' },
    { id: 2, color: 'red' },
  ];

  beforeEach(function () {
    app.add(DATA);
  });

  afterEach(function () {
    app.clear();
  });

  it('should find any items that have a matching field value', function () {
    var result = app.find(2);
    will(result[0]).beLike(DATA[1]);
  });
});

describe('dereferencing', function () {
  var DATA = [
    { id: 1, color: 'red' },
    { id: 2, color: 'red' },
  ];

  before(function () {
    app.add(DATA);
    app.dereference(true);
  });

  after(function () {
    app.dereference(false);
    app.clear();
  });

  it('altering find result should not alter internal data', function () {
    var result1 = app.find(2)[0];
    var result2;

    result1.color = 'white';
    result2 = app.find(2)[0];
    will(result2.color).not.be('white');
  });

  it('should not affect the data when the returned stuff is messed with', function () {
    var data = app.data();
    var length = data.length;
    data.splice(0, length);
    will(app.data().length).be(length);
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
});

describe('caching', function () {
  before(function () {
    app.dereference(false);
    app.add(generateData(10000));
  });

  after(function () {
    app.dereference(true);
    app.clear();
  });

  it('should cache lookups', function () {
    var start, first, second;

    start = process.hrtime();
    app.find(3);
    first = process.hrtime(start);

    start = process.hrtime();
    app.find(3);
    second = process.hrtime(start);

    second = (second[0] * 1e9 + second[1]);
    first = (first[0] * 1e9 + first[1]);
    // console.log(first, second);

    will(second).beLessThan(first);
  });
});

describe('ad hoc searching', function () {
  it('should allow searching an array provided in the params', function () {
    var arr = generateData(100);
    var result = app.find(arr, 4);
    will(result.length).beMoreThan(0);
  });
});

describe('chaining', function () {
  it('should work for add', function () {
    will(app.add()).be(app);
  });

  it('should work for cache', function () {
    will(app.cache()).be(app);
  });

  it('should work for clear', function () {
    will(app.clear()).be(app);
  });

  it('should work for dereference', function () {
    will(app.dereference()).be(app);
  });
});

describe('options', function () {
  describe('getting', function () {
    it('should return all options when no args', function () {
      will(app.options()).have('dereferenceResults');
    });

    it('should return the current value when passed one string', function () {
      will(app.options('dereferenceResults')).be(false);
    });
  });

  describe('setting', function () {
    it('should set the option when two args', function () {
      will(app.options('dereferenceResults', true).options('dereferenceResults')).be(true);
      app.options('dereferenceResults', false);
    });

    it('should set several options when passed a single object', function () {
      var opts = { foo: 1, bar: 2 };
      will(app.options(opts).options()).have('foo', 'bar');
    });
  });
});