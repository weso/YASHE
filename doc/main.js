var $ = jQuery = require("jquery");
require("../node_modules/bootstrap-sass/assets/javascripts/bootstrap/affix.js");
require("../node_modules/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js");


$(document).ready(function() {
  
    var rdfShape,wikiShape,japanShape
    
    var exSelector = document.getElementById('exSelector')
    var themeSlider = document.getElementById('themeSlider')


    //Parse Shapes
    $.get('./doc/shapes/rdfBookShape.txt', function(data) {
        rdfShape = data
    }, 'text');

    $.get('./doc/shapes/wikidataShape.txt', function(data) {
        wikiShape = data
    }, 'text');

    $.get('./doc/shapes/jps.txt', function(data) {
        japanShape = data
    }, 'text');


    //Examples Listener
    exSelector.addEventListener('change', function(e) {

        switch(exSelector.value){

            case "rdf":
                yashe.setValue(rdfShape)
                break

            case "wiki":
                yashe.setValue(wikiShape)
                break

            case "japan":
                yashe.setValue(japanShape)
                break

        }
        
    })

    //Theme Listener
    themeSlider.addEventListener('change', function(e) {
        
        if(this.checked) {
            yashe.setOption("theme","dark")
        } else {
            yashe.setOption("theme","wiki")
        }
        yashe.drawButtons()
    })


});

