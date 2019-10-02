"use strict";
/**
 * @param yashe {doc}
 * @return token {object}
 * @method YASHE.getCompleteToken
 */
var getCompleteToken = function(yashe) {

  let cur = yashe.getCursor();
  let token = yashe.getTokenAt(cur);
  
  return token;

};
var getPreviousNonWsToken = function(yashe, line, token) {
  var previousToken = yashe.getTokenAt({
    line: line,
    ch: token.start
  });
  if (previousToken != null && previousToken.type == "ws") {
    previousToken = getPreviousNonWsToken(yashe, line, previousToken);
  }
  return previousToken;
};
var getNextNonWsToken = function(yashe, lineNumber, charNumber) {
  if (charNumber == undefined) charNumber = 1;
  var token = yashe.getTokenAt({
    line: lineNumber,
    ch: charNumber
  });
  if (token == null || token == undefined || token.end < charNumber) {
    return null;
  }
  if (token.type == "ws") {
    return getNextNonWsToken(yashe, lineNumber, token.end + 1);
  }
  return token;
};

module.exports = {
  getPreviousNonWsToken: getPreviousNonWsToken,
  getCompleteToken: getCompleteToken,
  getNextNonWsToken: getNextNonWsToken
};
