const chai = require('chai');
const { expect } = chai;
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);


const expectToEqual = (actual, expected) => expect(actual).to.deep.equal(expected);

const Drill = require('../drill');

const stuff = {
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
    resources: [{ id: '123' }, { id: '543' }]
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
    resources: [{ id: 'yo' }, { id: 'mama' }]
  }
};

const db = new Drill(stuff);



describe('Lookup', () => {

  it('Get root level key', () => {
    const actual = db.get('hello');
    expectToEqual(actual, 'world');
  });

  it('Get the 3rd item in the collection array', () => {
    const actual = db.in('collection').get(3);
    expectToEqual(actual, { id: 'wha',
      name: 'henry',
      last: 'jackson',
      age: 102,
      birthday: '07/31/1980'
    });
  });

  it('Results in a property with get a property', () => {
    const actual = db.in('2014/02/14').get('date');
    expectToEqual(actual, '2014/02/14');
  });

  it('findOne within a collection', () => {
    const actual = db.in('collection').findOne({
      age: 33
    });
    expectToEqual(actual, {
      id: 'yo',
      name: 'shane',
      last: 'jackson',
      age: 33,
      birthday: '07/31/1980'
    });
  });

  it('Results within collection', () => {
    const actual = db.in('collection').find({
      age: 33
    });
    expectToEqual(actual, [{
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
      }
    ]);
  });

  it('Results found at root with id of wha', () => {
    const actual = db.find({ id: 'wha' });
    expectToEqual(actual, []);
  });

  it('Results for passing in a function', () => {
    const actual = db.in('collection').where({
      age: value => value <= 19
    }).order('age').select(5);
    expectToEqual(actual, [{
        "age": 10,
        "birthday": "01/02/1949",
        "child": {
          "age": 10,
          "first": "lydia",
          "last": "maple"
        },
        "id": "mama",
        "last": "jackson",
        "name": "jennifer"
      },
      {
        "age": 13,
        "birthday": "07/31/1980",
        "child": {
          "age": 17,
          "first": "brandon",
          "last": "maple"
        },
        "id": "wha",
        "last": "jackson",
        "name": "henry"
      },
      {
        "age": 19,
        "birthday": "07/31/1980",
        "child": {
          "age": 12,
          "first": "sherry",
          "last": "simpson"
        },
        "id": "wha",
        "last": "jackson",
        "name": "henry"
      }
    ]);
  });

  it('Results in collection where birthday is 07/31/1980 ordered by age and limited to 5 results', () => {
    const actual = db.in('collection').where({
      birthday: '07/31/1980'
    }).order('age').select(5);
    expectToEqual(actual, [{
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
        id: 'nice',
        name: 'zack',
        last: 'jackson',
        age: 21,
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
        id: 'yo',
        name: 'shane',
        last: 'jackson',
        age: 33,
        birthday: '07/31/1980'
      }
    ]);
  });

  it('Results in collection where child last is jackson order by last', () => {
    const actual = db.in('collection').where({
      child: {
        last: 'jackson'
      }
    }).order('last').select();
    expectToEqual(actual, [{
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
        last: 'zach',
        age: 30,
        child: {
          age: 5,
          first: 'lanny',
          last: 'jackson'
        },
        birthday: '07/31/1980'
      }
    ]);
  });

  it('Drill in "collection" where "age" is less than 50, ordered by child first, and limit to 5 results', () => {
    const actual = db.in('collection').where({
      child: {
        age: value => value <= 50
      }
    }).order('child.first').select(5);
    expectToEqual(actual, [{
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
    ]);
  });

  it('Results in collection where child.age is less than 33, ordered by child.age, and limited to 5 results', () => {
    const actual = db.in('why.resources').findOne({
      id: '543'
    });
    expectToEqual(actual, { id: '543' });
  });

  it('Results in collection where child.age is less than 33, ordered by child.age, and limited to 5 results', () => {
    const actual = db.in('collection').where({
      child: {
        age: value => value <= 50
      }
    }).order('child.age').select(3);
    expectToEqual(actual, [{
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
      }
    ]);
  });

  it('Results in collection where last is "jackson" and child.age is <= 20 and child.last is "maple" ordered by child.age, and limited to 5 results', () => {
    const actual = db.in('collection').where({
      last: 'jackson',
      child: {
        age: value => value <= 20,
        last: 'maple'
      }
    }).order('child.age').select(5);
    expectToEqual(actual, [{
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
      }
    ]);
  });

  it('Orders collection by last name in asc order and returns 2 results', () => {
    const actual = db
      .in('collection')
      .order('last', 'asc')
      .select(2);

    expect(actual).to.containSubset([
      {
        last: 'anderson',
      },
      {
        last: 'jackson',
      }
    ]);
  });

  it('Orders collection by last name in desc order and returns 2 results', () => {
    const actual = db
      .in('collection')
      .order('last', 'desc')
      .select(2);

    expect(actual).to.containSubset([
      {
        last: 'zach',
      },
      {
        last: 'simpson',
      }
    ]);
  });

  it('Drill in "collection" where "age" is less than 50, ordered by child first, and limit to 5 results', () => {
    const actual = db.in('collection').where({
      child: {
        age: (value) => value <= 50
      }
    }).order('age').select();
    expectToEqual(actual, [{
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
      }
    ]);
  });

  it.only('deletes every person with age 33 in "collection"', () => {
    const original = db
      .in('collection')
      .where({
        age: 33
      })
      .select();

    db
      .in('collection')
      .where({
        age: 33
      })
      .delete();

    const after = db
      .in('collection')
      .where({
        age: 33
      })
      .select();

    console.log(original.length);
    console.log(after.length);

    expectToEqual(original, true);
  });

  it('Drill in "people.jack" and get "frost"', () => {
    const actual = db.in('people.jack').get('frost');
    expectToEqual(actual, 'bob dylan');
  });

  it('Drill get "does.it.go.deep"', () => {
    const actual = db.get('does.it.go.deep');
    expectToEqual(actual, 'You tell me');
  });

  it('Drill get "does.it.go.deep"', () => {
    const actual = db.get('does.it.go.deep');
    expectToEqual(actual, 'You tell me');
  });

});




// console.log('\n');
// console.log('---------------------------------------');
// console.log('Drill get "does.it.go.deep"');
// console.log(db.get('does.it.go.deep'));

// console.log('\n');
// console.log('---------------------------------------');
// console.log('Drill set "does.it.go.deep"');
// db.set('does.it.go.deep', 'YES IT DOES!!!');

// console.log(db.get('does.it.go.deep'));
// console.log('Drill set "does.it.go.deep"');

// db.in('does.it.go').set('deep', 'Even does like this yo!!!');
// console.log(db.get('does.it.go.deep'));
