"use strict";
var $ = require("jquery"),
rdfUtils = require('../utils/rdfUtils.js')


module.exports = function(yashe, name) {
  return {
    isValidCompletionPosition: function() {
      return module.exports.isValidCompletionPosition(yashe);
    },
    get: function(token, callback) {
     
        console.log(token)
        var possibleEntity = token.string.split(':')[1]
      
        $.get(
            {
          
              url: 'https://www.wikidata.org/w/api.php?action=wbsearchentities&search='+possibleEntity+'&language=en&continue=0&limit=50&format=json',
              dataType: 'jsonp',
          
            }).done( function( data ) {
             
              var list =[]
              if(data.error){
                list = [ {
                  text: '',
                  displayText: 'Type to search for an entity'
                } ];
                callback(list)
    
              }else{

                var entities = []

                var label,id,description,entities
                for(var entity in data.search){

                    label = data.search[entity].label
                    id = data.search[entity].id
                    description = data.search[entity].description

                    
                    list =  {
                      text: id,
                      displayText: label + " (" + id + ") \n " + description
                    } ;

                    entities.push(list)
                   
                }
                entities.sort()
                callback(entities)
              }
            })
            
        
    },
    async: true,
    bulk: false,
    autoShow: false
  };
};

module.exports.isValidCompletionPosition = function(yashe) {


  
  var token = yashe.getCompleteToken();
  var cur = yashe.getCursor()

  //The cursor should stay at the end of the token
  if(token.end!=cur.ch)return false

  var prefixName = token.string.split(':')[0]
  var previousToken = yashe.getPreviousNonWsToken(cur.line, token);

  //This line avoid the autocomplete in the prefix definition
  if(previousToken.string.toUpperCase() == 'PREFIX')return false

  
  if(token.type == 'string-2' && rdfUtils.isWikidataEntitiesPrefix(prefixName))return true

 
  return false;
  
};
