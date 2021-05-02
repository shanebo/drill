let _count, _limit;


const Drill = function(data) {
  this.data = data;
  return this;
}


Drill.prototype = {
  query: {},
  data: null,

  in: function (path) {
    this.query = {};
    this.query.path = path;
    return this;
  },

  where: function (terms) {
    this.query.terms = terms;
    return this;
  },

  order: function (key, direction) {
    this.query.order = {
      key: key,
      direction: direction || 'asc'
    };
    return this;
  },

  get: function (path) {
    if (this.query.path) {
      path = this.query.path + '.' + path;
      this.query = {};
    }
    var keys = path.split('.');
    return keys.length > 1
      ? dive(this.data, keys)
      : this.data[path];
  },

  set: function (path, value) {
    if (this.query.path) {
      path = this.query.path + '.' + path;
      this.query = {};
    }
    var keys = path.split('.');
    var obj = this.data;

    for (var i = 0; i < keys.length; i++) {
      if (i == keys.length - 1) {
        obj[keys[i]] = value;
      } else {
        obj = obj[keys[i]];
      }
    }

    return this;
  },

  find: function (terms) {
    const data = this.query.path
      ? dive(this.data, this.query.path.split('.'))
      : this.data;
    const type = getType(data);

    if (!this.query.order) this.query = {};

    switch (type) {
      case 'array':
      case 'object':
        return matchAll(data, terms);
      default:
        // in cases of strings, numbers, or booleans return data
        return data;
    }
  },

  findOne: function (terms) {
    _limit = 1;
    const results = this.find(terms);
    return results.length
      ? results[0]
      : null;
    // return this.find(terms)[0];
  },

  select: function (limit) {
    if (this.query.order) {
      const matches = this.find(this.query.terms);
      const ordered = orderBy(matches, this.query.order.key, this.query.order.direction);
      var results = sliceArr(ordered, limit);
    } else {
      _limit = limit;
      var results = this.find(this.query.terms);
    }

    this.query = {};
    return results;
  },

  delete: function () {
    const data = this.query.path
      ? dive(this.data, this.query.path.split('.'))
      : this.data;

    // console.log(data.length);

    // console.log(this.query.terms);

    const results = data.filter((item) => {
      return !check(this.query.terms, item);
      // return filterMatches(item, this.query.terms);
    });

    const path = this.query.path;
    this.query.path = null;
    this.query = {};

    this.set(path, results);
    // console.log(results);
    // console.log(results.length);
    // console.log(this.in(this.query.path).where(this.query.terms).select().length);

    return 'ok';
  }
}


const filterMatches = (obj, matcher) => {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      const value = obj[prop];

      if (check(matcher, value)) {
        return true;
        break;
      }
    }
  }

  return false;
}


const getType = (obj) => ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();


const check = (matcher, obj) => {
  for (const key in matcher) {
    if (!matcher.hasOwnProperty(key)) continue;

    const match = matcher[key];
    const value = obj[key];
    if (value === undefined) return false;
    const type = getType(match);

    switch (type) {
      case 'function':
        if (!match(value)) return false;
      case 'object':
        if (!check(match, value)) return false;
      case 'array':
        let len = match.length;
        while (len--) {
          if (!check(match[len], value[len])) return false;
        }
        break;
      default:
        // check strings, numbers, or booleans
        if (match !== value) return false;
    }
  }

  return true;
}


const matchAll = (obj, matcher) => {
  const arr = [];
  const indexes = [];
  let count = 0;

  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      const value = obj[prop];
      if (check(matcher, value)) {
        count += 1;
        arr.push(value);
        indexes.push(value);
        if (count === _limit) {
          _limit = false;
          return arr;
          break;
        }
      }
    }
  }

  return arr;
}


const orderBy = (arr, key, way) => {
  const keys = key.split('.');

  arr.sort((a, b) => {
    const aProp = dive(a, keys);
    const bProp = dive(b, keys);

    switch (way) {
      case 'desc':
        if (aProp > bProp) return -1;
        if (aProp < bProp) return 1;
        return 0;
      case 'asc':
      default:
        if (aProp < bProp) return -1;
        if (aProp > bProp) return 1;
        return 0;
    }
  });

  return arr;
}


const dive = (obj, keys) => keys.reduce((o, i) => o[i], obj);

// perf test between old and new
// const dive = (obj, keys) => {
//   let prop = obj;
//   for (var i = 0; i < keys.length; i++) prop = prop[keys[i]];
//   return prop;
// }


const sliceArr = (arr, count) => arr.slice(0, count);


if (typeof module !== 'undefined' && module.exports) {
  module.exports = Drill;
}
