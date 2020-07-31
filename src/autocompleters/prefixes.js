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

     var completions = trie.autoComplete(token.toLowerCase())
     var final = []
     var list={}
     for(var c in completions){

        var text = completions[c]
        var displayText = completions[c]

        if(!module.exports.isInPrefixList(completions[c])){
          text = text.toUpperCase()
        }

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
  module.exports.PREFIXES = yashe.getDefinedPrefixes();
  let token = yashe.getCompleteToken();
  if(token.string.length>0 
    && token.type != 'ws' 
    && token.type != 'punc' 
    && !token.string.includes(':'))return true;
  return false
};



module.exports.isInPrefixList = function(completion){

  for(var prefix in module.exports.PREFIXES){
      if(completion == prefix+":")return true
  }
  return false

}

module.exports.PREFIXES = []

