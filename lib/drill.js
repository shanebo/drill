

var getType = function(obj){
//	var type = typeof data;
//	if (data instanceof Array) type = 'array';
	return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

var check = function(matcher, obj) {
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

	for (var prop in obj) {
		var value = obj[prop];
		if (check(matcher, value)) arr.push(value);
	}

	return arr;
}

var orderBy = function(arr, key, way){
	var keys = key.split('.');

	arr.sort(function compare(a, b){
		var a_prop = getProperty(a, keys);
		var b_prop = getProperty(b, keys);
	
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

var getProperty = function(obj, keys){
	var prop = obj;
	for (var i = 0; i < keys.length; i++) prop = prop[keys[i]];
	return prop;
}





var Drill = function(data){
	this.data = data;
	return this;
}


Drill.prototype = {

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
		if (this.query && this.query.path) path = this.query.path + '.' + path;
		var keys = path.split('.');
		if (keys.length > 1) return getProperty(this.data, keys);
		delete this.query;
		return this.data[path];
	},

	find: function(terms){
		var data = (this.query && this.query.path) ? getProperty(this.data, this.query.path.split('.')) : this.data;
		var type = getType(data);

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
		return this.find(terms)[0];
	},

	select: function(limit){
		var matches = this.find(this.query.terms);
		matches = limit ? this.limit(matches, limit) : matches;
		return this.query.order ? orderBy(matches, this.query.order.key, this.query.order.direction) : matches;
	}

};


if (typeof module !== 'undefined' && module.exports) {
	module.exports = Drill;
//	module.exports = function(object){
//		return new Drill(object);
//	}
}