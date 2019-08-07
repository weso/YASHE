"use strict";
var $ = require("jquery")


module.exports = function(yashe, name) {
  return {
    isValidCompletionPosition: function() {
      return module.exports.isValidCompletionPosition(yashe);
    },
    get: function(token) {
     
      
     var list = ['PREFIX','BASE']
     return list
            
    },
    async: false,
    bulk: true,
    autoShow: false
  };
};

module.exports.isValidCompletionPosition = function(yashe) {

return true
  
  var token = yashe.getCompleteToken();
  var cur = yashe.getCursor()

  var previousToken = yashe.getPreviousNonWsToken(cur.line, token);

  
};
