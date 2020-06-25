const VALUESET_LINE_LIMIT = 2; // Sets the máximun number of values inside a valueSet

// Symbols
const LINE_BREAK = '\n';
const WHITE_SPACE = ' ';
const DOUBLE_WHITE_SPACE = '  ';
const EMPTY_STRING = '';
const EMPTY_BRACKETS = '{}';
const OPENING_PARENTHESIS = '(';
const FINAL_PARENTHESIS = ')';
const OPENING_CURLY_BRACKET= '{';
const CLOSING_CURLY_BRACKET= '}';
const OPENING_SQUARE_BRACKET= '[';
const CLOSING_SQUARE_BRACKET= ']';
const SEMICOLON=';';
const DOLLAR = '$';
const AMPERSAND = '&';

// Types
const SHAPE_TYPE = 'shape'
const COMMENT_TYPE = 'comment';
const VALUESET_TYPE = 'valueSet';
const PREFIXED_IRI = 'string-2';
const IRI = 'variable-3';

// Keywords
const AND_KEYWORD = 'and';
const OR_KEYWORD = 'or';




function getSeparator(size){
    let space = WHITE_SPACE;
    let separator = DOUBLE_WHITE_SPACE;
    for(let i=0;i<size;i++){
        separator+=space;
    }
    return separator;
}

/**
* It's not exactly the same as getSeparator
* Probably there is a way to do everything 
* with just one method but at this momment
* I have better things to do
* */
function getIndent(tab) {
    let indent = EMPTY_STRING;
    for(let i=0;i<tab;i++){
        indent+=DOUBLE_WHITE_SPACE;
    }
    return indent;
}


function getLongestPrefix(prefixes){
    return prefixes.reduce((acc,p) =>{
        if(p.alias.string.length>acc)acc=p.alias.string.length;
        return acc;
    },0);
}


function getLongestTConstraint(triples){
    return triples.reduce((acc,t)=>{   
        let token = t.constraints[0];
        if(token.type==PREFIXED_IRI || token.type==IRI){
            if(token.string.length>acc){
                acc = token.string.length;
            }
        }
        return acc;
    },0)
}


function needsSeparator(index,token,nexToken,triplesLenght,constraints,emptyBrackets){
  if(isJustEmptyBrackets(triplesLenght,emptyBrackets,constraints))return true;
  return   index==0 
        && token.type!= SHAPE_TYPE 
        && token.string!= AND_KEYWORD
        && token.string!= OR_KEYWORD
        && token.string!= OPENING_PARENTHESIS
        && token.string!= DOLLAR
        && token.string!= AMPERSAND
        && nexToken
        && nexToken.string!=OPENING_CURLY_BRACKET 
        && hasConstraints(constraints) ;
}

function isJustEmptyBrackets(triplesLenght,emptyBrackets,constraints){
    if(triplesLenght==1 || emptyBrackets){
        return constraints && constraints.length<=2;
    }
    return false; 
}

function hasConstraints(constraints) {
    return constraints.reduce((acc,c)=>{
        if(c.type!=PREFIXED_IRI && c.type!=IRI && c.type!=COMMENT_TYPE)
            acc=true;
        return acc;
    },false)
}


function getSeparatorIfNeeded(index,token,nexToken,triplesLenght,longest,constraints,emptyBrackets){
    let separator = WHITE_SPACE;
    if(needsSeparator(index,token,nexToken,triplesLenght,constraints,emptyBrackets)){
        let actual = token.string.length;
        let diference = longest - actual;
        separator=getSeparator(diference);
    }
    return separator;
}


function getValueSetSize(tokens){
    let start = false;
    let stop = false;
    return tokens.reduce((acc,t)=>{
        if(t.string == CLOSING_SQUARE_BRACKET)stop=true;
        if(start && !stop && t.type==VALUESET_TYPE)acc.push(t);
        if(t.string == OPENING_SQUARE_BRACKET)start=true;
        
        return acc;
    },[]).length;
}

module.exports ={
    getSeparator:getSeparator,
    getLongestPrefix:getLongestPrefix,
    getLongestTConstraint:getLongestTConstraint,
    getSeparatorIfNeeded:getSeparatorIfNeeded,
    getValueSetSize:getValueSetSize,
    getIndent:getIndent,
    VALUESET_LINE_LIMIT:VALUESET_LINE_LIMIT,
    LINE_BREAK:LINE_BREAK,
    WHITE_SPACE:WHITE_SPACE,
    EMPTY_STRING:EMPTY_STRING,
    EMPTY_BRACKETS:EMPTY_BRACKETS,
    FINAL_PARENTHESIS:FINAL_PARENTHESIS,
    OPENING_CURLY_BRACKET:OPENING_CURLY_BRACKET,
    CLOSING_CURLY_BRACKET:CLOSING_CURLY_BRACKET,
    OPENING_SQUARE_BRACKET:OPENING_SQUARE_BRACKET,
    CLOSING_SQUARE_BRACKET:CLOSING_SQUARE_BRACKET,
    SEMICOLON:SEMICOLON,
    COMMENT_TYPE:COMMENT_TYPE,
    VALUESET_TYPE:VALUESET_TYPE,
    AND_KEYWORD:AND_KEYWORD,
    OR_KEYWORD:OR_KEYWORD
}