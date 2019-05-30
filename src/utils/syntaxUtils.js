"use strict";
var $ = require("jquery"),
  yutils = require("yasgui-utils"),
  imgs = require("./imgsUtils.js");

var checkSyntax = function(yashe, deepcheck) {
    yashe.queryValid = true;
  
    yashe.clearGutter("gutterErrorBar");
  
    var state = null;
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
  
      //console.log(token)
  
      var state = token.state;
      yashe.queryType = state.queryType;
  
      if (state.OK == false) {
        if (!yashe.options.syntaxErrorCheck) {
          //the library we use already marks everything as being an error. Overwrite this class attribute.
          $(yashe.getWrapperElement()).find(".sp-error").css("color", "black");
          //we don't want to gutter error, so return
          return;
        }
  
  
        var warningEl = yutils.svg.getElement(imgs.warning);
        if (state.errorMsg) {
          require("./tooltipUtils.js").sintaxTootlip(yashe, warningEl, function() {
            return $("<div/>").text(token.state.errorMsg).html();
          });
        } else if (state.possibleCurrent && state.possibleCurrent.length > 0) {
          //				warningEl.style.zIndex = "99999999";
          require("./tooltipUtils.js").sintaxTootlip(yashe, warningEl, function() {
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
        break;
      }
    }
    yashe.prevQueryValid = yashe.queryValid;
    if (deepcheck) {
      if (state != null && state.stack != undefined) {
        var stack = state.stack, len = state.stack.length;
        // Because incremental parser doesn't receive end-of-input
        // it can't clear stack, so we have to check that whatever
        // is left on the stack is nillable
        if (len > 1) yashe.queryValid = false;
        else if (len == 1) {
          if (stack[0] != "solutionModifier" && stack[0] != "?limitOffsetClauses" && stack[0] != "?offsetClause")
            yashe.queryValid = false;
        }
      }
    }
  };

  module.exports = {
    checkSyntax:checkSyntax
  };
  