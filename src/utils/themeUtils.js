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
  
    if(theme == "dark"){
      
      //Editor
      $('.CodeMirror').css('background','#212121')
      $('.CodeMirror-gutters').css('background-color','#212121')
  
      //Tokens
      $('.cm-logical').css('color','#B271FF')
      $('.cm-punc').css('color','#FFFFFF')
      $('.cm-variable-2').css('color','#68BEEB')
      $('.cm-variable-3').css('color','#68BEEB')
      $('.cm-directive').css('color','#FC4C46')
      $('.cm-string-2').css('color','#7DB647')
      $('.cm-number').css('color','#E5F439')
      $('.cm-at').css('color','#68BEEB')
  
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