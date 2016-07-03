var http = require('http');

http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(9999, '127.0.0.1');

console.log('Server running at http://127.0.0.1:9999/');


var stuff = {
    does: {
        it: {
            go: {
                deep: 'You tell me'
            }
        }
    },
    hello: 'world',
    people: {
        jack: {
            '2014/07/31': 'worked',
            'frost': 'bob dylan'
        }
    },
    why: {
        date: '2014/07/31',
        resources: [{id: '123'}, {id: '543'}]
    },
    index: [
        {
            id: 'yo',
            name: 'shane',
            last: 'jackson',
            age: 33,
            birthday: '07/31/1980'
        },
        {
            id: 'nope',
            name: 'jack',
            last: 'jackson',
            age: 33,
            birthday: '09/06/1976'
        },
        {
            id: 'nice',
            name: 'zack',
            last: 'jackson',
            age: 21,
            birthday: '07/31/1980'
        }
    ],
    collection: [
        {
            id: 'yo',
            name: 'shane',
            last: 'jackson',
            age: 33,
            birthday: '07/31/1980'
        },
        {
            id: 'nope',
            name: 'jack',
            last: 'jackson',
            age: 33,
            birthday: '09/06/1976'
        },
        {
            id: 'nice',
            name: 'zack',
            last: 'jackson',
            age: 21,
            birthday: '07/31/1980'
        },
        {
            id: 'wha',
            name: 'henry',
            last: 'jackson',
            age: 102,
            birthday: '07/31/1980'
        },
        {
            id: 'wha',
            name: 'henry',
            last: 'jackson',
            age: 13,
            child: {
                age: 17,
                first: 'brandon',
                last: 'maple'
            },
            birthday: '07/31/1980'
        },
        {
            id: 'wha',
            name: 'henry',
            last: 'jackson',
            age: 19,
            child: {
                age: 12,
                first: 'sherry',
                last: 'simpson'
            },
            birthday: '07/31/1980'
        },
        {
            id: 'wha',
            name: 'henry',
            last: 'zach',
            age: 30,
            child: {
                age: 5,
                first: 'lanny',
                last: 'jackson'
            },
            birthday: '07/31/1980'
        },
        {
            id: 'wha',
            name: 'henry',
            last: 'simpson',
            age: 45,
            child: {
                age: 19,
                first: 'lanny',
                last: 'jackson'
            },
            birthday: '07/31/1980'
        },
        {
            id: 'wha',
            name: 'henry',
            last: 'anderson',
            child: {
                age: 24,
                first: 'shane',
                last: 'jackson'
            },
            age: 45,
            birthday: '07/31/1980'
        },
        {
            id: 'jack',
            name: 'black',
            last: 'piper',
            age: 98,
            child: {
                age: 33,
                first: 'brandon',
                last: 'maple'
            },
            birthday: '05/17/1980'
        },
        {
            id: 'mama',
            name: 'jennifer',
            last: 'jackson',
            age: 10,
            child: {
                age: 10,
                first: 'lydia',
                last: 'maple'
            },
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
console.log('Get the 3rd item in the collection array');
console.log(db.in('collection').get(3));


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
        last: 'jackson'
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
console.log(db.in('why.resources').findOne({
    id: '543'
}));


console.log('\n');
console.log('--------------');
console.log('Results in collection where child.age is less than 33, ordered by child.age, and limited to 5 results');
console.log(db.in('collection').where({
    child: {
        age: function(value){
            return value <= 50;
        }
    }
}).order('child.age').select(3));


console.log('\n');
console.log('--------------');
console.log('Results in collection where last is "jackson" and child.age is <= 20 and child.last is "maple" ordered by child.age, and limited to 5 results');
console.log(db.in('collection').where({
    last: 'jackson',
    child: {
        age: function(value){
            return value <= 20;
        },
        last: 'maple'
    }
}).order('child.age').select(5));



console.log('\n');
console.log('--------------');
console.log('TESTING');
console.log(db.in('collection').order('last').select());



console.log('\n');
console.log('-----------------------------------------------------------------------------------------');
console.log('Drill in "collection" where "age" is less than 50, ordered by child first, and limit to 5 results');
console.log(db.in('collection').where({
    child: {
        age: function(value){
            return value <= 50;
        }
    }
}).order('age').select());



console.log('\n');
console.log('---------------------------------------');
console.log('Drill in "people.jack" and get "frost"');
console.log(db.in('people.jack').get('frost'));



console.log('\n');
console.log('---------------------------------------');
console.log('Drill get "does.it.go.deep"');
console.log(db.get('does.it.go.deep'));

console.log('\n');
console.log('---------------------------------------');
console.log('Drill set "does.it.go.deep"');
db.set('does.it.go.deep', 'YES IT DOES!!!');

console.log(db.get('does.it.go.deep'));
console.log('Drill set "does.it.go.deep"');

db.in('does.it.go').set('deep', 'Even does like this yo!!!');
console.log(db.get('does.it.go.deep'));
