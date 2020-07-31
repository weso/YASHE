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
     for(var key in KEYWORDS){
      trie.insert(KEYWORDS[key]);
     }

     var completions = trie.autoComplete(token.toLowerCase())
     var final = []
     var list={}
     for(var c in completions){

        var text = completions[c]
        var displayText = completions[c];

        list =  {
          text: text,
          displayText: displayText
        } 

        final.push(list)
      }
    

      return final

    },
    async: false,
    bulk: false,
    autoShow: true
  };
};

module.exports.isValidCompletionPosition = function(yashe) {
  let token = yashe.getCompleteToken();
  for(let k in KEYWORDS){
    if(token.string==KEYWORDS[k])return false;
  }
  if(token.string.length>1)return true;
  return false;
};


var KEYWORDS = [
  'base',
  'prefix',
  'import',
  'external',
  'iri',
  'bnode',
  'literal',
  'nonliteral',
  'length',
  'minlength',
  'maxlength',
  'mininclusive',
  'minexclusive',
  'maxinclusive',
  'maxexclusive',
  'totaldigits',
  'fractiondigits',
  'closed',
  'extra'
  ]