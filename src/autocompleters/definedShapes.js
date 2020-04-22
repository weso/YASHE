"use strict";
var $ = require("jquery")
var yashe = require('../main.js')
var syntaxUtils = require('../utils/syntaxUtils.js')
var Trie = require('../../lib/trie.js')

module.exports = function(yashe, name) {

  
  return {
    isValidCompletionPosition: function() {
      return module.exports.isValidCompletionPosition(yashe);
    },
    get: function(token) {
    
        let completions = [];
        //Object.keys(tokenOb.state.defShapes)
        yashe.defShapes.map(s=>{
            completions.push({
                text: '@'+s,
                displayText: '@'+s
            })
        })

    


      return completions;

    },
    async: false,
    bulk: false,
    autoShow: false
  };
};

module.exports.isValidCompletionPosition = function(yashe) {
    var cur = yashe.getCursor(), token = yashe.getTokenAt(cur);
    if(token.type=='punc' && token.string == '@')return true;
    if(token.type=='shapeRef')return true;

    return false;
};





