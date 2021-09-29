"use strict";
var $ = require("jquery"),
rdfUtils = require('../utils/rdfUtils.js')

var API_ENDPOINT = 'https://www.wikidata.org/w/';
var QUERY = {

  action:'wbsearchentities',
  language:(navigator.language || navigator.userLanguage).split("-")[0],
  continue:0,
  limit:50,
  format: 'json',
}

module.exports = function(yashe, name) {
  return {
    isValidCompletionPosition: function() {
      return module.exports.isValidCompletionPosition(yashe);
    },
    get: function(token, callback) {
     
        var possibleEntity = token.string.split(':')[1]
        var prefix = token.string.split(':')[0]

        var query = QUERY
        query.search=possibleEntity

        //Add extra param if it is a property
        if(rdfUtils.isWikidataPropertiesPrefix(yashe,prefix)){
          query.type='property';
        }else{
          delete query.type;
        }

        let endpoint = rdfUtils.getEndPoint(yashe,prefix);
        if(endpoint!=null){
          API_ENDPOINT = endpoint;
        }

        getEntities(API_ENDPOINT,query)
          .done((data)=>setHints(data,callback))
          .fail(
              ()=>getEntities(API_ENDPOINT.replace('/w/','/wiki/'),query)
              .done((data)=>setHints(data,callback))
          )
            
        
    },
    async: true,
    bulk: false,
    autoShow: false
  };
};


var getEntities = function(endpoint,query){
  return $.get(
              {
          
              url: endpoint + 'api.php?' + $.param(query),
              dataType: 'jsonp',
          
              });
}

var setHints = function( data,callback ) {

  var list =[]
  
  //This condition is for an empty search
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
}

module.exports.isValidCompletionPosition = function(yashe) {


  
  var token = yashe.getCompleteToken();
  var cur = yashe.getCursor()

  //The cursor should stay at the end of the token
  if(token.end!=cur.ch)return false

  var prefixName = token.string.split(':')[0]
  var previousToken = yashe.getPreviousNonWsToken(cur.line, token);

  //This line avoid the autocomplete in the prefix definition
  if(previousToken.string.toUpperCase() == 'PREFIX')return false

  if(token.type == 'shape' || token.type=='string-2' || token.type=='constraint' || token.type=='valueSet'){
    if(rdfUtils.isWikidataEntitiesPrefix(yashe,prefixName) 
      || rdfUtils.isWikidataPropertiesPrefix(yashe,prefixName)
      || rdfUtils.getEndPoint(yashe,prefixName)!=null){
        return true
    }
  }

  return false;
};
