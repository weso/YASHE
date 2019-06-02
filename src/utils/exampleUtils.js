var rdfShape 
var wikiShape 
var japanShape 

var exSelector = document.getElementById('exSelector')
var themeSelector = document.getElementById('themeSelector')

$.get('./src/shapes/rdfBookShape.txt', function(data) {
  rdfShape = data
 }, 'text');

 $.get('./src/shapes/wikidataShape.txt', function(data) {
  wikiShape = data
 }, 'text');

 $.get('./src/shapes/jps.txt', function(data) {
  japanShape = data
 }, 'text');


 exSelector.addEventListener('click', function(e) {
    if(exSelector.value == "rdf"){
      yashe.setValue(rdfShape)
      yashe.setSize(null,"300")   
    }
    if(exSelector.value == "wiki"){
      yashe.setValue(wikiShape)
      yashe.setSize(null,"600")

    }
    if(exSelector.value == "japan"){
      yashe.setValue(japanShape)
      yashe.setSize(null,"600")
    }   

    root.clearTheme()
    root.setTheme(themeSelector.value)
    
})

themeSelector.addEventListener('click', function(e) {
  
  root.clearTheme()
  root.setTheme(themeSelector.value)

  
})