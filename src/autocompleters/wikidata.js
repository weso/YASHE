"use strict";
var $ = require("jquery");
module.exports = function(yashe, name) {
  return {
    isValidCompletionPosition: function() {
      return module.exports.isValidCompletionPosition(yashe);
    },
    get: function(token, callback) {
      console.log(token.string)
        var entities = []
        $.get(
            {
          
              url: 'https://www.wikidata.org/w/api.php?action=wbsearchentities&search='+token.string+'&language=en&continue=0&limit=50&format=json',
              dataType: 'jsonp',
          
            }).done( function( data ) {
             
              console.log(data)
                for(var entity in data.search){
                    entities.push(data.search[entity].label)
                   
                }
                entities.sort()
                callback(entities)
            })
        
          
    },
    async: true,
    bulk: false,
    autoShow: false
  };
};

module.exports.isValidCompletionPosition = function(yashe) {
 
  return true; 
  
  //Check previous token!!

  var token = yashe.getCompleteToken();
  if(token.type == 'string-2') return true

  return false;
  
};
