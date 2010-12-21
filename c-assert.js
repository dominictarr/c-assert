//c-assert

function m(message, diff,opp){
  var r = 
    (message || '')
  + [ diff.left.message
    , opp
    , diff.right.message].join(' ')
  return r    
}

var assert = require('assert')
  , equals = require('traverser/equals')
  , style = require('style')
exports.equal = function (actual,expected,message){
  var r = equals.string(expected,actual)
  if(!r.eq)
    assert.fail(actual, expected, m(message,r,'=='),'==',exports.equal)
}

exports.notEqual = function (actual,expected,message){
  var r = equals.string(expected,actual)
  if(r.eq)
    assert.fail(actual, expected, m(message,r,'!='),'!=',exports.notEqual)
}

exports.ok = function (actual,message){
  if(!!actual)
    return
  var r = equals.string(true,actual)
  if(!r.eq)
    assert.fail(actual, true, m(message,r,'=='),'==',exports.ok)
}

exports.throws = assert.throws
exports.doesNotThrow = assert.doesNotThrow
exports.ifError = assert.ifError

exports.AssertionError = assert.AssertionError

exports.strictEqual = function (actual,expected,message){
  if(actual !== expected){
    message = (message || '')
      + [ style(JSON.stringify(expected)).green.to_s
        , '==='
        , style(JSON.stringify(actual)).red.to_s].join(' ')
    assert.fail(actual, expected, message,'===',exports.strictEqual)
  }
}
exports.notStrictEqual = function (actual,expected,message){
  if(actual === expected){
    message = (message || '')
      + [ style(JSON.stringify(expected)).green.to_s
        , '!=='
        , style(JSON.stringify(actual)).red.to_s ].join(' ')
    assert.fail(actual, expected, message,'!==',exports.notStrictEqual)
  }
}

exports.deepEqual = function (actual,expected,message){
  var r = equals.deep(expected,actual)
  if(!r.eq)
    assert.fail(actual, expected, m(message,r,'deepEqual'),'deepEqual',exports.deepEqual)
}
exports.notDeepEqual = function (actual,expected,message){
  var r = equals.deep(expected,actual)
  if(r.eq)
    assert.fail(actual, expected, m(message,r,'notDeepEqual'),'notDeepEqual',exports.notDeepEqual)
}
