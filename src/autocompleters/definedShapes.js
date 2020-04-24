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

             for (var l = 0; l < yashe.lineCount(); ++l) {
                let lineTokens = yashe.getLineTokens(l);
                //Get all the defined prefixes and all the used prefixes
                //Get all the defined shapes and all the used shapes
                for(let t in lineTokens){
                  let token = lineTokens[t];
                  console.log(token)
                }

             }
        console.log(yashe.defShapes)
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





