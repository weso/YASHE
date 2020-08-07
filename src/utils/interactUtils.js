let yutils = require("yasgui-utils");
let imgs = require("./imgs.js");
let wikiNotification = $("<div class='notification wikiFormatNotification'></div>");

var showErrAlertMsg = function(yashe){
  wikiNotification
      .show()
      .text("I can't do that...Fix the errors before")
      .appendTo($(yashe.getWrapperElement()));
    
    setTimeout(() => {
      wikiNotification.hide()
    }, 3000);
}

var startWikiFormat = function(yashe){
  yashe.wikiFormatInProgress = true;
  $('#wikiBtn').attr("title", "STOP");
  $('#wikiBtn').empty();
  $('#wikiBtn').append($(yutils.svg.getElement(imgs.stop)));
  $('#wikiBtn').removeClass("yashe_wikiBtn");
  $('#wikiBtn').removeClass("yashe_wikiBtnAfter");
  $('#wikiBtn').addClass("yashe_stopBtn");
  wikiNotification.show().text("Adding Wikidata Comments").appendTo($(yashe.getWrapperElement()));
}

var stopWikiFormat = function(yashe,history){
  yashe.wikiFormatInProgress = false;
  setTimeout(() => { //Just to wait until the last comment is setted
    $('#wikiBtn').attr("title", "Generate Wikidata Comments");
    $('#wikiBtn').empty();
    $('#wikiBtn').removeClass("yashe_stopBtn");
    $('#wikiBtn').addClass("yashe_wikiBtnAfter");
    $('#wikiBtn').append($(yutils.svg.getElement(imgs.tag)));
    wikiNotification.hide();
    yashe.prettify();
    enableEditor(yashe,history);
  }, 400);
}

var disableEditor = function(yashe){
  yashe.setOption('readOnly',true);
  return yashe.getHistory();
}
var enableEditor = function(yashe,history){
  yashe.setHistory(history);
  yashe.setOption('readOnly',false);
}



module.exports ={
  startWikiFormat:startWikiFormat,
  stopWikiFormat:stopWikiFormat,
  enableEditor:enableEditor,
  disableEditor:disableEditor,
  showErrAlertMsg:showErrAlertMsg

}