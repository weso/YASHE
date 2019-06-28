var $ = require("jquery")  

var setTheme = function(theme){

    /*
    if(theme == "default"){
     
      //Editor
      $('.CodeMirror').css('background','363130')
      $('.CodeMirror-gutters').css('background-color','363130')
  
      //Tokens
      $('.cm-logical').css('color','B271FF')
      $('.cm-punc').css('color','FFFFFF')
      $('.cm-variable-2').css('color','68BEEB')
      $('.cm-directive').css('color','FC4C46')
      $('.cm-string-2').css('color','7DB647')
      $('.cm-number').css('color','FFFFFF')
  
  
    }
    */
  
    if(theme == "wiki"){
    
      //Editor
      $('.CodeMirror').css('background','white')
      $('.CodeMirror-gutters').css('background-color','white')
  
      //Tokens
      $('.cm-logical').css('color','#f00')
      $('.cm-punc').css('color','black')
      $('.cm-variable-2').css('color','#0F7A50')
      $('.cm-variable-3').css('color','#05a')
      $('.cm-directive').css('color','#f00')
      $('.cm-string-2').css('color','#05a')
      $('.cm-number').css('color','#085')
      $('.cm-at').css('color','#0F7A50')

    }
  
    if(theme == "dark"){
      

      //Editor
      $('.CodeMirror').css('background','#212121')
      $('.CodeMirror-gutters').css('background-color','#212121')
  
      //Tokens
      $('.cm-logical').css('color','#B271FF')
      $('.cm-punc').css('color','#')
      $('.cm-variable-2').css('color','#')
      $('.cm-variable-3').css('color','#')
      $('.cm-directive').css('color','#')
      $('.cm-string-2').css('color','#')
      $('.cm-number').css('color','#')
      $('.cm-at').css('color','#')


    }
  
  }



var clearTheme = function(){

    $('.cm-logical').css('color','')
    $('.cm-punc').css('color','')
    $('.cm-variable-2').css('color','')
    $('.cm-variable-3').css('color','')
    $('.cm-directive').css('color','')
    $('.cm-string-2').css('color','')
    $('.cm-number').css('color','')
  
  }

module.exports = {

    setTheme:setTheme,
    clearTheme:clearTheme

}