var $ = require("jquery")  
var themeUtils = require('./utils/themeUtils')

var rdfShape 
var wikiShape 
var japanShape 

var exSelector = document.getElementById('exSelector')
var themeSelector = document.getElementById('themeSelector')


var startListeners = function(){

    $.get('./src/shapes/rdfBookShape.txt', function(data) {
    rdfShape = data
    }, 'text');

    $.get('./src/shapes/wikidataShape.txt', function(data) {
    wikiShape = data
    }, 'text');

    $.get('./src/shapes/jps.txt', function(data) {
    japanShape = data
    }, 'text');


    //Example Listener
    exSelector.addEventListener('change', function(e) {
        if(exSelector.value == "rdf"){
        yashe.setValue(rdfShape)
        yashe.setSize(null,"300")   
        }
        if(exSelector.value == "wiki"){
        yashe.setValue(wikiShape)
       // yashe.setSize(null,"600")

        }
        if(exSelector.value == "japan"){
        yashe.setValue(japanShape)
       // yashe.setSize(null,"600")
        }   

        themeUtils.clearTheme()
        themeUtils.setTheme(themeSelector.value)
        
    })

    //Theme Listener
    themeSelector.addEventListener('change', function(e) {
    

     yashe.setOption("theme","dark")
     console.log(yashe.options.shex)  
    //themeUtils.clearTheme()
    //themeUtils.setTheme(themeSelector.value)

    
    })

}





module.exports = {
    startListeners:startListeners,
    themeSelector:themeSelector
}