var ENTITY_TYPES = {
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

var NAMESPACE_SHORTCUTS = {
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


var  VALID_TOOLTIP_PREFIXES = [
    'http://www.wikidata.org/prop/direct/',
    'http://www.wikidata.org/prop/direct-normalized/',
    'http://www.wikidata.org/prop/',
    'http://www.wikidata.org/prop/novalue/',
    'http://www.wikidata.org/prop/statement/',
    'http://www.wikidata.org/prop/statement/value/',
    'http://www.wikidata.org/prop/statement/value-normalized/',
    'http://www.wikidata.org/prop/qualifier/',
    'http://www.wikidata.org/prop/qualifier/value/',
    'http://www.wikidata.org/prop/qualifier/value-normalized/',
    'http://www.wikidata.org/prop/reference/',
    'http://www.wikidata.org/prop/reference/value/',
    'http://www.wikidata.org/prop/reference/value-normalized/',
    'http://www.wikidata.org/wiki/Special:EntityData/',
    'http://www.wikidata.org/entity/'
]


module.exports = {

    entityTypes:ENTITY_TYPES,
    namespaceShortCuts: NAMESPACE_SHORTCUTS,
    validTootlipPrefixes:VALID_TOOLTIP_PREFIXES

}