"use strict";
var $ = require("jquery")
var yashe = require('../main.js')

module.exports = function(yashe, name) {

  
  return {
    isValidCompletionPosition: function() {
      return module.exports.isValidCompletionPosition(yashe);
    },
    get: function(token) {
     return KEYWORDS
    },
    async: false,
    bulk: true,
    autoShow: false
  };
};

module.exports.isValidCompletionPosition = function(yashe) {
  return true
};


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
