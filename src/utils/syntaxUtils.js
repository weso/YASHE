"use strict";
var $ = require("jquery"),
  yutils = require("yasgui-utils"),
  imgs = require("./imgs.js");



var checkSyntax = function(yashe) {

    let defPrefixes = [];
    let prefixes = []
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
      for(let t in lineTokens){
        let token = lineTokens[t];
        if(token.string=='{'){
          openTokensCounter++;
        }
        if(token.string=='}'){
          closeTokensCounter++;
        }

        if(token.type=='string-2' || 
           token.type=='constraint' ||
           token.type=='valueSet' ){
          prefixes.push({
              alias:token.string.split(":")[0]+':',
              line:l });
        }


        if(token.type=='prefixDelcAlias'){
          defPrefixes.push(token.string);
        }

        if(token.type=='shape'){
          shapes.push(token.string)
        }

        if(token.type=='shapeRef'){
          shapeRefs.push({
              ref:token.string.slice(1,token.string.length),
              line:l });
        }

        if(token.string=='@'){
          shapeRefs.push({
              ref:'@:',
              line:l });
        }
      
      }

     
    }


    for(let p in prefixes){
      let err=true;
      for(let d in defPrefixes){
        if(defPrefixes[d]==prefixes[p].alias)err=false;
      }
      if(err){
        setError(prefixes[p].line,"Prefix '" + prefixes[p].alias + "' is not defined");
        yashe.queryValid = false;
        return false;
      } 
    }

    //Check ShapeRefs are defined
    for(let r in shapeRefs){
      let err=true;
      for(let s in shapes){
        if(shapes[s]==shapeRefs[r].ref)err=false;
      }
      if(err){
        setError(shapeRefs[r].line,"Shape '" + shapeRefs[r].ref + "' is not defined");
        yashe.queryValid = false;
        return false;
      } 
    }
  
    // Is last '}' missing?  (See #104)
    if(openTokensCounter != closeTokensCounter){
      setError(l,"This line is invalid. Expected: '}'");
      yashe.queryValid = false;
      return false;
    }

    yashe.prevQueryValid = yashe.queryValid;
    return true;
  };


  var setError= function(line,errMsg) {
     var warningEl = yutils.svg.getElement(imgs.warning);
      require("./tooltipUtils.js").grammarTootlip(yashe, warningEl, function() {
        return errMsg;
      });   
      warningEl.style.marginTop = "2px";
      warningEl.style.marginLeft = "2px";
      warningEl.className = "parseErrorIcon";
      yashe.setGutterMarker(line, "gutterErrorBar", warningEl);
  }

  module.exports = {
    checkSyntax:checkSyntax
  };
  