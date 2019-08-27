//get the ShEx examples
var rdfBookEx,wikiEx,japanEx
var exSelector = document.getElementById('exSelector')

//Parse Shapes
$.get('/doc/examples/rdfBookEx.txt', function(data) {
    rdfBookEx = data
}, 'text');

$.get('/doc/examples/wikidataEx.txt', function(data) {
    wikiEx = data
}, 'text');

$.get('/doc/examples/japanEx.txt', function(data) {
    japanEx = data
}, 'text');


//Examples Listener
exSelector.addEventListener('change', function(e) {

    switch(exSelector.value){

        case "rdf":
            yashe.setValue(rdfBookEx)
            break

        case "wiki":
            yashe.setValue(wikiEx)
            break

        case "japan":
            yashe.setValue(japanEx)
            break

    }
    
})

