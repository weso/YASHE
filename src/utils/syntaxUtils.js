"use strict";
var $ = require("jquery"),
  yutils = require("yasgui-utils"),
  imgs = require("./imgs.js");


var checkSyntax = function(yashe) {
    yashe.queryValid = true;
    yashe.clearGutter("gutterErrorBar");

    resetValues(yashe);
    
    var state = null;
    let openTokensCounter = 0;
    let closedTokensCounter = 0;
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

      let lineTokens = yashe.getLineTokens(l);
      for(let t in lineTokens){
        let token = lineTokens[t];
        //This is only necessary to verify the if the last '}' is missing  (See #104)
        if(token.string=='{'){
          openTokensCounter++;
        }
        if(token.string=='}'){
          closedTokensCounter++;
        }
      }
    
      updateShapesAndPrefixes(yashe,l);
    }

    //Is last '}' missing?  (See #104)
    if(openTokensCounter != closedTokensCounter){
      setError(yashe.lastLine(),"This line is invalid. Expected: '}'",yashe)
      yashe.queryValid = false;
      return false;
    }

    
    
    if(!checkPrefixes(yashe))return false;
    if(!checkShapes(yashe))return false;

    yashe.shapes = Object.assign([],yashe.defShapes);
  
    yashe.prevQueryValid = yashe.queryValid;
    return true;
  };

  var resetValues = function(yashe){
    yashe.defPrefixes = [];
    yashe.usedPrefixes = [];
    yashe.defShapes = [];
    yashe.shapeRefs = [];
  }


  var updateShapesAndPrefixes = function(yashe,l) {
    let lineTokens = yashe.getLineTokens(l);
    //Get all the defined prefixes and all the used prefixes
    //Get all the defined shapes and all the used shapes
    for(let t in lineTokens){
      let token = lineTokens[t];
  

      if(token.type=='string-2' || 
        token.type=='constraint'){
        yashe.usedPrefixes.push({
            alias:token.string.split(":")[0]+':',
            line:l });
      }

      if(token.type=='valueSet'){
        if(token.string.includes(":") && !token.string.startsWith("<")){
            yashe.usedPrefixes.push({
                alias:token.string.split(":")[0]+':',
                line:l });
        }  
      }


      if(token.type=='prefixDelcAlias'){
        yashe.defPrefixes.push(token.string);
      }

      if(token.type=='shape'){
        yashe.defShapes.push(token.string);
        if(!token.string.startsWith("<") && !token.string.startsWith("_:")){
          yashe.usedPrefixes.push({
            alias:token.string.split(":")[0]+':',
            line:l });
        }  

      }

      if(token.type=='shapeRef'){
        yashe.shapeRefs.push({
            ref:token.string.slice(1,token.string.length),
            line:l });
      }

      //Necesary when the ShapeRef is "@:"
      if(token.string=='@'){
        yashe.shapeRefs.push({
            ref:'@:',
            line:l });
      }
    
    }

  }

  

/**
  * Check if the ShapeRefs are defined
 */
  var checkShapes = function(yashe){
    let defShapes = yashe.defShapes;
    let shapeRefs = yashe.shapeRefs;
    for(let r in shapeRefs){
      let err=true;
      for(let s in defShapes){
        if(defShapes[s]==shapeRefs[r].ref)err=false;
      }
      if(err){
        setError(shapeRefs[r].line,"Shape '" + shapeRefs[r].ref + "' is not defined",yashe);
        yashe.queryValid = false;
        return false;
      } 
    }
    return true;
  }

/**
  * Check if the Prefixes are defined
 */
  var checkPrefixes = function(yashe){
    let defPrefixes = yashe.defPrefixes;
    let usedPrefixes = yashe.usedPrefixes;
    for(let p in usedPrefixes){
      let err=true;
      for(let d in defPrefixes){
        if(defPrefixes[d]==usedPrefixes[p].alias)err=false;
      }
      if(err){
        setError(usedPrefixes[p].line,"Prefix '" + usedPrefixes[p].alias + "' is not defined",yashe);
        yashe.queryValid = false;
        return false;
      } 
    }
    return true;
  }

  var setError= function(line,errMsg,yashe) {
     var warningEl = yutils.svg.getElement(imgs.warning);
      require("./tooltipUtils.js").grammarTootlip(yashe, warningEl, function() {
        return errMsg;
      });   
      warningEl.style.marginTop = "2px";
      warningEl.style.marginLeft = "2px";
      warningEl.className = "parseErrorIcon";
      yashe.setGutterMarker(line, "gutterErrorBar", warningEl);
  }


  var reCheckSyntax =  function(yashe){
    setTimeout(() => {
      checkSyntax(yashe);
    }, 380);
  }

  module.exports = {
    checkSyntax:checkSyntax,
    reCheckSyntax:reCheckSyntax
  };
