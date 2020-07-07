var CodeMirror = require("codemirror")
const $ = require('jquery')

"use strict";
var commentLines = function(yashe) {
    var startLine = yashe.getCursor(true).line;
    var endLine = yashe.getCursor(false).line;
    var min = Math.min(startLine, endLine);
    var max = Math.max(startLine, endLine);
  
    // if all lines start with #, remove this char. Otherwise add this char
    var linesAreCommented = true;
    for (var i = min; i <= max; i++) {
      var line = yashe.getLine(i);
      if (line.length == 0 || line.substring(0, 1) != "#") {
        linesAreCommented = false;
        break;
      }
    }
    for (var i = min; i <= max; i++) {
      if (linesAreCommented) {
        // lines are commented, so remove comments
        yashe.replaceRange(
          "",
          {
            line: i,
            ch: 0
          },
          {
            line: i,
            ch: 1
          }
        );
      } else {
        // Not all lines are commented, so add comments
        yashe.replaceRange("#", {
          line: i,
          ch: 0
        });
      }
    }
  };

var copyLineUp = function(yashe) {
    var cursor = yashe.getCursor();
    var lineCount = yashe.lineCount();
    // First create new empty line at end of text
    yashe.replaceRange("\n", {
      line: lineCount - 1,
      ch: yashe.getLine(lineCount - 1).length
    });
    // Copy all lines to their next line
    for (var i = lineCount; i > cursor.line; i--) {
      var line = yashe.getLine(i - 1);
      yashe.replaceRange(
        line,
        {
          line: i,
          ch: 0
        },
        {
          line: i,
          ch: yashe.getLine(i).length
        }
      );
    }
  };

var copyLineDown = function(yashe) {
    copyLineUp(yashe);
    // Make sure cursor goes one down (we are copying downwards)
    var cursor = yashe.getCursor();
    cursor.line++;
    yashe.setCursor(cursor);
  };

  var doAutoFormat = function(yashe) {
    if (!yashe.somethingSelected()) yashe.execCommand("selectAll");
    var to = {
      line: yashe.getCursor(false).line,
      ch: yashe.getSelection().length
    };
    autoFormatRange(yashe, yashe.getCursor(true), to);
  };
  
  var autoFormatRange = function(yashe, from, to) {
    var absStart = yashe.indexFromPos(from);
    var absEnd = yashe.indexFromPos(to);
    // Insert additional line breaks where necessary according to the
    // mode's syntax
    var res = autoFormatLineBreaks(yashe.getValue(), absStart, absEnd);
  
    // Replace and auto-indent the range
    yashe.operation(function() {
      yashe.replaceRange(res, from, to);
      var startLine = yashe.posFromIndex(absStart).line;
      var endLine = yashe.posFromIndex(absStart + res.length).line;
      for (var i = startLine; i <= endLine; i++) {
        yashe.indentLine(i, "smart");
      }
    });
  };
  
  var autoFormatLineBreaks = function(text, start, end) {
    text = text.substring(start, end);
    var breakAfterArray = [
      ["keyword", "ws", "prefixed", "ws", "uri"], // i.e. prefix declaration
      ["keyword", "ws", "uri"] // i.e. base
    ];
    var breakAfterCharacters = ["{", ".", ";"];
    var breakBeforeCharacters = ["}"];
    var getBreakType = function(stringVal, type) {
      for (var i = 0; i < breakAfterArray.length; i++) {
        if (stackTrace.valueOf().toString() == breakAfterArray[i].valueOf().toString()) {
          return 1;
        }
      }
      for (var i = 0; i < breakAfterCharacters.length; i++) {
        if (stringVal == breakAfterCharacters[i]) {
          return 1;
        }
      }
      for (var i = 0; i < breakBeforeCharacters.length; i++) {
        // don't want to issue 'breakbefore' AND 'breakafter', so check
        // current line
        if ($.trim(currentLine) != "" && stringVal == breakBeforeCharacters[i]) {
          return -1;
        }
      }
      return 0;
    };
    var formattedQuery = "";
    var currentLine = "";
    var stackTrace = [];
    CodeMirror.runMode(text, "shex", function(stringVal, type) {
      stackTrace.push(type);
      var breakType = getBreakType(stringVal, type);
      if (breakType != 0) {
        if (breakType == 1) {
          formattedQuery += stringVal + "\n";
          currentLine = "";
        } else {
          // (-1)
          formattedQuery += "\n" + stringVal;
          currentLine = stringVal;
        }
        stackTrace = [];
      } else {
        currentLine += stringVal;
        formattedQuery += stringVal;
      }
      if (stackTrace.length == 1 && stackTrace[0] == "sp-ws") stackTrace = [];
    });
    return $.trim(formattedQuery.replace(/\n\s*\n/g, "\n"));
  };

function getTokens(yashe){
    let tokens =[];
    if(yashe!=undefined){
        for (var l = 0; l < yashe.lineCount(); ++l) {
            let lineTokens = getNonWsTokens(yashe.getLineTokens(l));
            lineTokens.forEach(token =>{
                tokens.push(token);
            })

        }
    }
    return tokens;
}


function getNonWsTokens(tokens){
    return tokens.filter(function(obj){
        return obj.type != 'ws';
    })
}

  var wikiFormat = async function(yashe){
    yashe.prettify();
    /* $('.CodeMirror-lines').hide();

     $('.CodeMirror-lines').parent().append(
       $('<div class="showLoader"><div class="loader"></div></div>')
     )

    let tks = getTokens(yashe)
    let str = '';
    for(let token in tks){
      if(tks[token].string.split(':')[0]=='wd' || tks[token].string.split(':')[0]=='wdt'  && tks[token].string.split(':')[1]!='' ){
            let entity = tks[token].string.split(':')[1].toUpperCase();
            let language = (navigator.language || navigator.userLanguage).split("-")[0];
            var API_ENDPOINT = 'https://www.wikidata.org/w/';
            var QUERY_ID = {
                    action:'wbgetentities',
                    ids:entity,
                    format: 'json', 
            }

            let result = await $.get({
                    url: API_ENDPOINT + 'api.php?' + $.param(QUERY_ID),
                    dataType: 'jsonp',
            })
            //+result.entities[entity].labels[language].value+"
              
            if(result.entities){
              str+=' '+ tks[token].string+" #"+result.entities[entity].labels[language].value+"\n";
            }else{
              str+=' '+ tks[token].string+' ';
            }
            //
      }else{
        
        str+=' '+tks[token].string;
        if(tks[token].type=='comment')str+="\n"
      }
    }

    
    //yashe.refresh();

     $('.showLoader').hide();
    $('.CodeMirror-lines').show();

    yashe.setValue(str);
    yashe.prettify(); */

    
    for (var l = 1; l < yashe.lineCount(); ++l) {
      let lineTokens = yashe.getLineTokens(l);
      let nonWs = getNonWsLineTokens(lineTokens)
        for(let t in nonWs){
          let token = nonWs[t];
          //console.log(next)
          if(token.string.split(':')[0]=='wd' || token.string.split(':')[0]=='wdt' && token.string.split(':')[1]!='' ){
            let entity = token.string.split(':')[1].toUpperCase();
            let language = (navigator.language || navigator.userLanguage).split("-")[0];
            var API_ENDPOINT = 'https://www.wikidata.org/w/';
            var QUERY_ID = {
                    action:'wbgetentities',
                    ids:entity,
                    format: 'json', 
            }

            let result = await $.get({
                    url: API_ENDPOINT + 'api.php?' + $.param(QUERY_ID),
                    dataType: 'jsonp',
            })
            
                 // console.log(result.entities[entity].labels[language])
                 console.log('')
          if(result.entities){
                yashe.replaceRange(token.string+" #"+result.entities[entity].labels[language].value+" \n",{line:l,ch:token.start},{line:l,ch:token.end})
                yashe.prettify();
          }
          
      
            
          }
          
        }
    }

    
  }

  var getNonWsLineTokens = function(lineTokens){
    return lineTokens.reduce((acc,t)=>{
      if(t.type!='ws')acc.push(t);
      return acc;
    },[]);
  }

  var getNextNonWSLineToken = function(yashe,lineTokens,lineIndex){
      let i = 1;
      let token = lineTokens[lineIndex+i];
      //console.log(token)
      while(token && token.type=='ws'){
        i++;
        token = lineTokens[lineIndex+i];
      }
      return token;
  }


  module.exports = {
    commentLines:commentLines,
    copyLineUp: copyLineUp,
    copyLineDown: copyLineDown,
    doAutoFormat:doAutoFormat,
    wikiFormat:wikiFormat
  };
  