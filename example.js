var http = require('http');

http.createServer(function(req, res){
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
}).listen(9999, '127.0.0.1');

console.log('Server running at http://127.0.0.1:9999/');


var stuff = {
	'hello': 'world',
	'why': {
		date: '2014/07/31',
		resources: [{id: '123'}, {id: '543'}]
	},
	collection: [
		{
			id: 'yo',
			name: 'shane',
			age: 33,
			birthday: '07/31/1980'
		},
		{
			id: 'nice',
			name: 'zack',
			age: 21,
			birthday: '07/31/1980'
		},
		{
			id: 'wha',
			name: 'henry',
			age: 102,
			birthday: '07/31/1980'
		},
		{
			id: 'wha',
			name: 'henry',
			age: 13,
			birthday: '07/31/1980'
		},
		{
			id: 'wha',
			name: 'henry',
			age: 19,
			child: {
				age: 12,
				first: 'chyrese',
				last: 'thacker'
			},
			birthday: '07/31/1980'
		},
		{
			id: 'wha',
			name: 'henry',
			age: 30,
			child: {
				age: 5,
				first: 'lanny',
				last: 'thacker'
			},
			birthday: '07/31/1980'
		},
		{
			id: 'wha',
			name: 'henry',
			age: 45,
			child: {
				age: 33,
				first: 'lanny',
				last: 'thacker'
			},
			birthday: '07/31/1980'
		},
		{
			id: 'wha',
			name: 'henry',
			child: {
				age: 35,
				first: 'shane',
				last: 'thacker'
			},
			age: 45,
			birthday: '07/31/1980'
		},
		{
			id: 'jack',
			name: 'black',
			age: 98,
			birthday: '05/17/1980'
		},
		{
			id: 'mama',
			name: 'thacker',
			age: 10,
			birthday: '01/02/1949'
		}
	],
	'2014/02/14': {
		date: '2014/02/14',
		resources: [{id: 'yo'}, {id: 'mama'}]
	}
};


var Drill = require('drill');
var db = new Drill(stuff);


console.log('\n');
console.log('--------------');
console.log('Results properties right at root');
console.log(db.get('hello'));


console.log('\n');
console.log('--------------');
console.log('Results in a property with get a property');
console.log(db.in('2014/02/14').get('date'));


console.log('\n');
console.log('--------------');
console.log('findOne within a collection');
console.log(db.in('collection').findOne({age: 33}));


console.log('\n');
console.log('--------------');
console.log('Results within collection');
console.log(db.in('collection').find({age: 33}));


console.log('\n');
console.log('--------------');
console.log('Results found at root with id of wha');
console.log(db.find({id: 'wha'}));


console.log('\n');
console.log('--------------');
console.log('Results for passing in a function');
console.log(db.in('collection').where({
	age: function(value){
		return value <= 19;
	}
}).order('age').select(5));


console.log('\n');
console.log('--------------');
console.log('Results in collection where birthday is 07/31/1980 ordered by age and limited to 5 results');
console.log(db.in('collection').where({birthday: '07/31/1980'}).order('age').select(5));


console.log('\n');
console.log('--------------');
console.log('Results in collection where birthday is 07/31/1980 ordered by age and limited to 5 results');
console.log(db.in('collection').where({
	child: {
//		first: 'lanny',
		last: 'thacker'
	}
}).order('last').select());


console.log('\n');
console.log('-----------------------------------------------------------------------------------------');
console.log('Drill in "collection" where "age" is less than 50, ordered by child first, and limit to 5 results');
console.log(db.in('collection').where({
	child: {
		age: function(value){
			return value <= 50;
		}
	}
}).order('child.first').select(5));


console.log('\n');
console.log('--------------');
console.log('Results in collection where child.age is less than 33, ordered by child.age, and limited to 5 results');
console.log(db.in('collection').where({
	child: {
		age: function(value){
			return value <= 50;
		}
	}
}).order('child.age').select(5));


console.log('\n');
console.log('--------------');
console.log('Results in collection where child.age is less than 33, ordered by child.age, and limited to 5 results');
console.log(db.in('why.resources').findOne({
	id: '543'
}));