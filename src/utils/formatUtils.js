const CodeMirror = require("codemirror")
const $ = require('jquery')
const wikiUtils = require('../utils/wikiUtils.js')

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


  var wikiFormat = async function(yashe){
    if(yashe.hasErrors())return;
    yashe.prettify();
    let history = yashe.getHistory();
    yashe.setOption('readOnly',true);
    
    for (var l = 0; l < yashe.lineCount(); ++l) {
      let lineTokens = getNonWsLineTokens(yashe.getLineTokens(l));
      let valueSetSize = getValueSetSizeIfClosed(lineTokens);
      let comments = '';
        for(let t in lineTokens){
          let token = lineTokens[t];
          if(wikiUtils.isWikidataPrefix(yashe,token)){
            let entity = token.string.split(':')[1].toUpperCase();
            let result = await wikiUtils.getEntity(entity,wikiUtils.wikidataEndpoint);
            if(result.entities){
              let entityData = wikiUtils.getEntityData(entity,result);
              if(entityData){
                comments +=' # '+entityData.title;
                valueSetSize--;
              }
            }
          }else{
            if(token.type=='valueSet')valueSetSize--;
          }

          if(valueSetSize<0){ 
            yashe.replaceRange(token.string+comments+" \n",{line:l,ch:token.start},{line:l,ch:token.end})
            //For some reason I'm not able to make codemirror scroll methods work, so I'm forcing the scroll with the cursor
            yashe.setCursor({line:l+10,ch:token.start}); 
            yashe.prettify();
            valueSetSize = 0;
            comments = '';
          }
          
        }

    }

    yashe.setHistory(history);
    yashe.setOption('readOnly',false);

  }


  /**
   *  Gets an array of linetokens. If the line closes the valueSet ']' return its size, otherwise 0
   * @param {Array} lineTokens 
   */
  var getValueSetSizeIfClosed = function(lineTokens){
    let open = false;
    let close = false;
    let size = lineTokens.reduce((acc,t)=>{
      console.log(t)
      if(t.string=='[')open=true;
      if(t.string==']')close=true;
      if(t.type=='valueSet')acc++;
      return acc;
    },0)

    if(open && close)return size;
    return 0;
  }


  var getNonWsLineTokens = function(lineTokens){
    return lineTokens.reduce((acc,t)=>{
      if(t.type!='ws')acc.push(t);
      return acc;
    },[]);
  }


  module.exports = {
    commentLines:commentLines,
    copyLineUp: copyLineUp,
    copyLineDown: copyLineDown,
    doAutoFormat:doAutoFormat,
    getNonWsLineTokens:getNonWsLineTokens,
    wikiFormat:wikiFormat,
  };
  