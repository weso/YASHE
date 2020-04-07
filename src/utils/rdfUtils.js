const ENTITY_TYPES = {
    'http://www.wikidata.org/prop/direct/': 'property',
    'http://www.wikidata.org/prop/direct-normalized/': 'property',
    'http://www.wikidata.org/prop/': 'property',
    'http://www.wikidata.org/prop/novalue/': 'property',
    'http://www.wikidata.org/prop/statement/': 'property',
    'http://www.wikidata.org/prop/statement/value/': 'property',
    'http://www.wikidata.org/prop/statement/value-normalized/': 'property',
    'http://www.wikidata.org/prop/qualifier/': 'property',
    'http://www.wikidata.org/prop/qualifier/value/': 'property',
    'http://www.wikidata.org/prop/qualifier/value-normalized/': 'property',
    'http://www.wikidata.org/prop/reference/': 'property',
    'http://www.wikidata.org/prop/reference/value/': 'property',
    'http://www.wikidata.org/prop/reference/value-normalized/': 'property',
    'http://www.wikidata.org/wiki/Special:EntityData/': 'item',
    'http://www.wikidata.org/entity/': 'item'
};

const NAMESPACE_SHORTCUTS = {
        wikibase: 'http://wikiba.se/ontology#',
        wd: 'http://www.wikidata.org/entity/',
        wdt: 'http://www.wikidata.org/prop/direct/',
        wdtn: 'http://www.wikidata.org/prop/direct-normalized/',
        wds: 'http://www.wikidata.org/entity/statement/',
        p: 'http://www.wikidata.org/prop/',
        wdref: 'http://www.wikidata.org/reference/',
        wdv: 'http://www.wikidata.org/value/',
        ps: 'http://www.wikidata.org/prop/statement/',
        psv: 'http://www.wikidata.org/prop/statement/value/',
        psn: 'http://www.wikidata.org/prop/statement/value-normalized/',
        pq: 'http://www.wikidata.org/prop/qualifier/',
        pqv: 'http://www.wikidata.org/prop/qualifier/value/',
        pqn: 'http://www.wikidata.org/prop/qualifier/value-normalized/',
        pr: 'http://www.wikidata.org/prop/reference/',
        prv: 'http://www.wikidata.org/prop/reference/value/',
        prn: 'http://www.wikidata.org/prop/reference/value-normalized/',
        wdno: 'http://www.wikidata.org/prop/novalue/',
        wdata: 'http://www.wikidata.org/wiki/Special:EntityData/'
    }

const WIKIDATA_ENDPOINT= 'https://www.wikidata.org/w/'



var getEndPoint = function(yashe,prefixName){

    let definedPrefixex = yashe.getDefinedPrefixes();
    let endpoint = null;
    Object.keys(definedPrefixex).map(p =>{
      if(p==prefixName){
        if(definedPrefixex[p].includes('/wiki/Item:')){
           endpoint = definedPrefixex[p].replace('http://','https://').split('/wiki/')[0]+'/w/';
        }else{
          Object.keys(ENTITY_TYPES).map(pref=>{
            if(pref === definedPrefixex[p]){
              endpoint =  WIKIDATA_ENDPOINT;
            }
          });
        }
      }
    })

  return endpoint;
}


var isWikidataEntitiesPrefix = function(yashe,prefixName){

    var definedPrefixex = yashe.getDefinedPrefixes()
    var iriPrefix
    
    //Gets de IRI of the prefix from the defined
    for (const prop in definedPrefixex) {
      if(prop === prefixName)
        iriPrefix = definedPrefixex[prop]
    }

    
    //Compare iriPrefix with the valid wikidata entities prefixes
    for(const pref in ENTITY_TYPES){
        if(ENTITY_TYPES[pref] === 'item' && pref == iriPrefix)
          return true
      }
    return false
}

var isWikidataPropertiesPrefix = function(yashe,prefixName){

    var definedPrefixex = yashe.getDefinedPrefixes()
    var iriPrefix
    
    //Gets de IRI of the prefix from the defined
    for (const prop in definedPrefixex) {
      if(prop === prefixName)
        iriPrefix = definedPrefixex[prop]
    }

    //Compare iriPrefix with the valid wikidata properties prefixes
    for(const pref in ENTITY_TYPES){
        if(ENTITY_TYPES[pref] === 'property' && pref == iriPrefix)
          return true
      }
    return false
}


module.exports = {

    entityTypes:ENTITY_TYPES,
    namespaceShortCuts: NAMESPACE_SHORTCUTS,
    getEndPoint:getEndPoint,
    isWikidataEntitiesPrefix:isWikidataEntitiesPrefix,
    isWikidataPropertiesPrefix:isWikidataPropertiesPrefix

}