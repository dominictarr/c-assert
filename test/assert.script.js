var assert = require('c-assert/c-assert')

var truthy = [true,1]
, falsey = [0,'',[]]
, ok = [true,1,2,100,-1,"true",{},[],new Error()]
, notOk = [false,0,null,undefined,""]
, inspect = require('util').inspect
function shouldPass(values,func){
  values.forEach(function (e){
    assert[func](e)
  })
}
function shouldThrow(values,func,errorType){
  values.forEach(function (e){
    try{
      assert[func](e)
    } catch (e){
      if(errorType && ! (e instanceof errorType))
        throw new Error("error " + e + "was not instanceof " + errorType.name)
      return
    }
  })
}

/*  fail: [Function: fail],
  ok: [Function: ok],
  equal: [Function: equal],
  notEqual: [Function: notEqual],
  deepEqual: [Function: deepEqual],
  notDeepEqual: [Function: notDeepEqual],
  strictEqual: [Function: strictEqual],
  notStrictEqual: [Function: notStrictEqual],
  throws: [Function],
  doesNotThrow: [Function],
  ifError: [Function] }*/

console.log('test: ok')

shouldPass(truthy,'ok',assert.AssertionError)
shouldThrow(falsey,'ok',assert.AssertionError)
shouldPass(ok,'ok',assert.AssertionError)
shouldThrow(notOk,'ok',assert.AssertionError)

console.log('test: throws, doesNotThrow')

var throwable = [new Error('throw me'),"thrown",7,null,undefined,[],{}]
  
throwable.forEach(function (t) {
  assert.throws(function(){
    throw t
  });
});
throwable.forEach(function (t) {
  assert.doesNotThrow(function(){
    return t
  });
});

throwable.forEach(function (t) {
  assert.throws(function(){
    process.emit('error', t)
  });
});

console.log('test: comparison methods')

function comparison(test,method,a,b) {
  test[method](a,b,"expected : " + method + "( " + inspect(a) + " ,  " + inspect(b) + " );")
}

  var c1 = [1,2,3]
  , c2 = [1,2,3]
  
    c1.push(c1);
    c2.push(c2);
    c3 = [1,2,3,c1]
  /*
    put a bunch of example comparisons in a hash by method name, 
    then iterate and apply the method  
  */
  var comparisons = {
  equal: [
      [1,1]
    , [2,2]
    , [2,2.0]
    , ['hello',"hello"]
    , ['36',36]
    , ['36.0',36]
    , ['3.6e1',36]
    , ['.36e2',36]
    , [null,undefined]
    , [c1,c1]
    , [Array,Array]
    , [true,1] // 'truthy' values
    , [false,0]//falsey
    , [false,'']
    , [false,[]]
    ]
  , notEqual: [
      [1,0]
    , ['hello',"Hello"]
    , [[],[]]
    , [{},{}]
    , [c1,c2]
    , [c1,c3]
    , [function(){},function(){}]
    , [function(){},'function(){}']
    , [true,2]
    , [true,'true']
    , [false,null]
    , [false,undefined]    
    , [false,'false']
    , [false,true]
    , [false,{}]
    ]
  , strictEqual: [
      [1,1]
    , ['hello','hello']
    , [c1,c1]
    , [Array,Array]
    , [true,true]
    , [false,false]
    , [assert,assert]
    ]
  , notStrictEqual: [
      [1,'1']
    , [null,undefined]
    , [true,1]  // 'truthy' values
    , [false,0] // falsey
    , [false,'']
    , [false,[]]
    , [new assert.AssertionError(''),new assert.AssertionError('')]//not stict equal unless same object
    ]
  , deepEqual: [
    , [[],[]]
    , [{},{}]
    , [[1,2,3],[1,2,3]]
    , [[1,2,3],['1','2.0','.3e1']]
    , [{hello:'hi',goodbye:'bye'},{hello:'hi',goodbye:'bye'}]
    , [[1,2,3,{}],[1,2,3,{}]]
    , [c1,c1]
  //, [c1,c2] // this causes stackoverflow.
    , [c1,c3] //but this passes, since c1[3] === c1 and c3[3] === c1
    , [[1,2,3,[],4],[1,2,3,[],4]]
    , [[1,2,3,{},4],[1,2,3,{},4]]
    , [[1,[2,3],[],4],[1,[2,3],[],4]]
    , [new assert.AssertionError(''),new assert.AssertionError('')]//most new objects of same type should be equal
    ]
  , notDeepEqual: [
    , [new Error(),new Error()]//when a error is created it stack trace gets set, and the message will differ by column number somewhere.
  ]
  }  

  for (method in comparisons) {
    console.log('      - ' + method)
    comparisons[method].forEach(function(e){
      comparison(assert,method,e[0],e[1])   
    });
  }

console.log('testing ifError')

shouldPass(notOk,'ifError')
shouldThrow(ok,'ifError')

