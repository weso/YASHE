"use strict";
var $ = require("jquery");
module.exports = function(yashe, name) {
  return {
    isValidCompletionPosition: function() {
      return module.exports.isValidCompletionPosition(yashe);
    },
    get: function(token, callback) {
        var entities = []
        $.get(
            {
          
              url: 'https://www.wikidata.org/w/api.php?action=wbsearchentities&search=ins&language=en&continue=0&limit=50&format=json',
              dataType: 'jsonp',
          
            }).done( function( data ) {
             
                for(var entity in data.search){
                    entities.push(data.search[entity].id)
                   
                }
                callback(entities)
            })
        
          
    },
    async: true,
    bulk: true,
    autoShow: true
  };
};

module.exports.isValidCompletionPosition = function(yashe) {
 
    
    /*
  var token = yashe.getCompleteToken();
  console.log(token)
  if(token.type == 'string-2') return true

  */
  return true;
  
};
