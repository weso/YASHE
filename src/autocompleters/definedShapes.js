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
    
      return yashe.shapes.reduce((acc,s)=>{
          acc.push({
                text: '@'+s,
                displayText: '@'+s
            });
          return acc;
      },[]);

    },
    async: false,
    bulk: false,
    autoShow: false/* ,
    callbacks: {
      validPosition: yashe.autocompleters.notifications.show,
      invalidPosition: yashe.autocompleters.notifications.hide
    } */
  };
};

module.exports.isValidCompletionPosition = function(yashe) {
    var cur = yashe.getCursor(), token = yashe.getTokenAt(cur);
    if(token.type=='punc' && token.string == '@')return true;
    if(token.type=='shapeRef')return true;

    return false;
};





