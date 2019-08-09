"use strict";
var $ = require("jquery")
var yashe = require('../main.js')
var Trie = require('../../lib/trie.js')

module.exports = function(yashe, name) {

  
  return {
    isValidCompletionPosition: function() {
      return module.exports.isValidCompletionPosition(yashe);
    },
    get: function(token) {
      
  
     var trie = new Trie()
     var prefixes = module.exports.PREFIXES
     for(var prefix in prefixes){
        trie.insert(prefix+":");
     }
     for(var key in KEYWORDS){
      trie.insert(KEYWORDS[key]);
     }
    
     return trie.autoComplete(token)

    },
    async: false,
    bulk: false,
    autoShow: false
  };
};

module.exports.isValidCompletionPosition = function(yashe) {
  module.exports.PREFIXES = yashe.getDefinedPrefixes()

  /*
  var token = yashe.getCompleteToken();
  var possibleNext  = token.state.possibleNext
  console.log(possibleNext)
  for(var possibility in possibleNext){
    if(possibleNext[possibility] == 'PREFIX')return false
  }
*/
  return true
};

module.exports.PREFIXES = []


var KEYWORDS = [
  'BASE',
  'PREFIX',
  'EXTERNAL',
  'OR',
  'AND',
  'NOT"',
  'IRI',
  'BNODE',
  'NONLITERAL',
  'LENGTH',
  'MINLENGTH',
  'MAXLENGTH',
  'MININCLUSIVE',
  'MINEXCLUSIVE',
  'MAXINCLUSIVE',
  'MAXEXCLUSIVE',
  'TOTALDIGITS',
  'FRACTIONDIGITS',
  'CLOSED',
  'EXTRA'
  ]