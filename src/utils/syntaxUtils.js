"use strict";
var $ = require("jquery"),
  yutils = require("yasgui-utils"),
  imgs = require("./imgs.js");



var checkSyntax = function(yashe) {

    let shapes = [];
    let shapeRefs = [];
    yashe.queryValid = true;
    yashe.clearGutter("gutterErrorBar");
  
    var state = null;
    let openTokensCounter = 0;
    let closeTokensCounter = 0;
    for (var l = 0; l < yashe.lineCount(); ++l) {

      var precise = false;
      if (!yashe.prevQueryValid) {
        // we don't want cached information in this case, otherwise the
        // previous error sign might still show up,
        // even though the syntax error might be gone already
        precise = true;
      }
  
      var token = yashe.getTokenAt(
        {
          line: l,
          ch: yashe.getLine(l).length
        },
        precise
      );
  
      
  
      var state = token.state;
  
      if (state.OK == false) {
        if (!yashe.options.syntaxErrorCheck) {
          //the library we use already marks everything as being an error. Overwrite this class attribute.
          $(yashe.getWrapperElement()).find(".sp-error").css("color", "black");
          //we don't want to gutter error, so return
          return;
        }
  
  
        var warningEl = yutils.svg.getElement(imgs.warning);
        if (state.errorMsg) {
          require("./tooltipUtils.js").grammarTootlip(yashe, warningEl, function() {
            return $("<div/>").text(token.state.errorMsg).html();
          });
        } else if (state.possibleCurrent && state.possibleCurrent.length > 0) {
          //				warningEl.style.zIndex = "99999999";
          require("./tooltipUtils.js").grammarTootlip(yashe, warningEl, function() {
            var expectedEncoded = [];
            state.possibleCurrent.forEach(function(expected) {
              expectedEncoded.push(
                "<strong style='text-decoration:underline'>" + $("<div/>").text(expected).html() + "</strong>"
              );
            });
            return "This line is invalid. Expected: " + expectedEncoded.join(", ");
          });
        }
        warningEl.style.marginTop = "2px";
        warningEl.style.marginLeft = "2px";
        warningEl.className = "parseErrorIcon";
        yashe.setGutterMarker(l, "gutterErrorBar", warningEl);
  
        yashe.queryValid = false;
        return false;
      }

      //This is only necessary to verify the if the last '}' is missing  (See #104)
      let lineTokens = yashe.getLineTokens(l)
      //console.log(lineTokens)
      for(let t in lineTokens){
        if(lineTokens[t].string=='{'){
          openTokensCounter++;
        }
        if(lineTokens[t].string=='}'){
          closeTokensCounter++;
        }

        if(lineTokens[t].type=='shape'){
          shapes.push(lineTokens[t].string)
        }

        if(lineTokens[t].type=='ATPNAME_LN'){
          shapeRefs.push({
              ref:lineTokens[t].string.slice(1,lineTokens[t].string.length),
              line:l });
        }
      
      }

     
    }

    for(let r in shapeRefs){
      let err=true;
      for(let s in shapes){
        if(shapes[s]==shapeRefs[r].ref)err=false;
      }
      if(err){
        var warningEl = yutils.svg.getElement(imgs.warning);
        require("./tooltipUtils.js").grammarTootlip(yashe, warningEl, function() {
          return "Shape '" + shapeRefs[r].ref + "' is not defined";;
        });   
        warningEl.style.marginTop = "2px";
        warningEl.style.marginLeft = "2px";
        warningEl.className = "parseErrorIcon";
        yashe.setGutterMarker(shapeRefs[r].line, "gutterErrorBar", warningEl);
        
        yashe.queryValid = false;
        return false;
      } 
    }



  
    // Is last '}' missing?  (See #104)
    if(openTokensCounter != closeTokensCounter){
      
      var warningEl = yutils.svg.getElement(imgs.warning);
      require("./tooltipUtils.js").grammarTootlip(yashe, warningEl, function() {
        return "This line is invalid. Expected: '}'";
      });   
      warningEl.style.marginTop = "2px";
      warningEl.style.marginLeft = "2px";
      warningEl.className = "parseErrorIcon";
      yashe.setGutterMarker(l, "gutterErrorBar", warningEl);
      
      yashe.queryValid = false;
      return false;
    }
    /*
    console.log(nonWSGlobalTokens[lastToken-1].string)
    if(nonWSGlobalTokens[lastToken-1].string!='}'){
      console.log('entra')
        var warningEl = yutils.svg.getElement(imgs.warning);
        
        warningEl.style.marginTop = "2px";
        warningEl.style.marginLeft = "2px";
        warningEl.className = "parseErrorIcon";
        yashe.setGutterMarker(l, "gutterErrorBar", warningEl);
        yashe.queryValid = false;
        return false;
    }
    */


    yashe.prevQueryValid = yashe.queryValid;
    return true;
  };

  module.exports = {
    checkSyntax:checkSyntax
  };
  