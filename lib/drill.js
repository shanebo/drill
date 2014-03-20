

var _count, _limit;


var getType = function(obj){
//	var type = typeof data;
//	if (data instanceof Array) type = 'array';
	return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

var check = function(matcher, obj){
	for (var key in matcher) {
		if (!matcher.hasOwnProperty(key)) continue;

		var match = matcher[key];
		var value = obj[key];
		if (value === undefined) return false;
		var type = getType(match);

		switch (type) {
			case 'function':
				if (!match(value)) return false;
			case 'object':
				if (!check(match, value)) return false;
			case 'array':
				var len = match.length;
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

var match = function(obj, matcher){
	for (var prop in obj) {
		var value = obj[prop];
		if (check(matcher, value)) return value;
	}

	return false;
}

var matchAll = function(obj, matcher){
	var arr = [];
	_count = 0;

	for (var prop in obj) {
		var value = obj[prop];
		if (check(matcher, value)) {
			_count += 1;
			arr.push(value);
			if (_count === _limit) {
				_limit = false;
				return arr;
				break;
			}
		}
	}

	return arr;
}

var orderBy = function(arr, key, way){
	var keys = key.split('.');

	arr.sort(function compare(a, b){
		var a_prop = dive(a, keys);
		var b_prop = dive(b, keys);
	
		switch (way) {
			case 'dec':
				if (a_prop > b_prop) return -1;
				if (a_prop < b_prop) return 1;
				return 0;
			case 'asc':
			default:
				if (a_prop < b_prop) return -1;
				if (a_prop > b_prop) return 1;
				return 0;
		}
	}.bind(this));

	return arr;
}

var dive = function(obj, keys){
	var prop = obj;
	for (var i = 0; i < keys.length; i++) prop = prop[keys[i]];
	return prop;
}


var Drill = function(data){
	this.data = data;
	return this;
}


Drill.prototype = {
	
	query: {},
	data: null,
	
	in: function(path){
		this.query = {};
		this.query.path = path;
		return this;
	},

	where: function(terms){
		this.query.terms = terms;
		return this;
	},

	order: function(key, direction){
		this.query.order = { key: key, direction: direction || 'asc' };
		return this;
	},

	limit: function(arr, count){
		return arr.slice(0, count);
	},

	get: function(path){
		if (this.query.path) {
			path = this.query.path + '.' + path;
			this.query = {};
		}
		var keys = path.split('.');
		return keys.length > 1 ? dive(this.data, keys) : this.data[path];
	},

	find: function(terms){
		var data = (this.query.path) ? dive(this.data, this.query.path.split('.')) : this.data;
		var type = getType(data);

		if (!this.query.order) this.query = {};

		switch (type) {
			case 'array':
				return matchAll(data, terms);
			case 'object':
				return match(data, terms);
			default:
				// in cases of strings, numbers, or booleans return data
				return data;
		}
	},

	findOne: function(terms){
		_limit = 1;
		return this.find(terms)[0];
	},

	select: function(limit){
		if (this.query.order) {
			var matches = this.find(this.query.terms);
			var ordered = orderBy(matches, this.query.order.key, this.query.order.direction);
			var results = this.limit(ordered, limit);
		} else {
			_limit = limit;
			var results = this.find(this.query.terms);
		}

		this.query = {};
		return results;
	}

};


if (typeof module !== 'undefined' && module.exports) {
	module.exports = Drill;
}