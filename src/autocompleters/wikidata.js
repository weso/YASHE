"use strict";
var $ = require("jquery"),
tooltipUtils = require('../utils/tooltipUtils.js')

module.exports = function(yashe, name) {
  return {
    isValidCompletionPosition: function() {
      return module.exports.isValidCompletionPosition(yashe);
    },
    get: function(token, callback) {
     
      console.log(token)
        var possibleEntity = token.split(':')[1]
        var entities = []


        var list = [ {
          text: 'Q1234',
          displayText: 'Persona (Q12312) Me lasdjasdijlaksdj'
        } ];

        return list

        /*
        $.get(
            {
          
              url: 'https://www.wikidata.org/w/api.php?action=wbsearchentities&search='+possibleEntity+'&language=en&continue=0&limit=50&format=json',
              dataType: 'jsonp',
          
            }).done( function( data ) {
             
                var label,id,description
                for(var entity in data.search){

                    label = data.search[entity].label
                    id = data.search[entity].id
                    description = data.search[entity].description

                    var list = [ {
                      text: id,
                      displayText: label + " (" + id + ") \n " + description
                    } ];

      
                    entities.push(hintObject)
                   
                }
                entities.sort()
                callback(entities)
            })
            */
        
          
    },
    async: false,
    bulk: false,
    autoShow: false
  };
};

module.exports.isValidCompletionPosition = function(yashe) {

  
  //Check previous token!!

  var token = yashe.getCompleteToken();
  
  var prefixName = token.string.split(':')[0]


  if(token.type == 'string-2' 
  && tooltipUtils.isWikidataPrefix(prefixName))return true

 
  return false;
  
};
