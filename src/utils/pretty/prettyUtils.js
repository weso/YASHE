function prettify(yashe){

    // Save the value before the prettify it
    let previousValue = yashe.getValue();

    //  Cursor and tokens
    let cursorPosition = getCursorPosition(yashe);
    let tokens = getTokens(yashe);

    //  Objects
    let initialComments = getFirstComments(tokens);
    let initialDirectivesAndStarts = getInitialDirectivesAndStarts(tokens);
    let shapes = getShapes(tokens);

    //  Strings
    let initialDirectivesAndStartsStr = getDirectivesAndStartsStr(initialDirectivesAndStarts);
    let shapesStr = getShapesStr(shapes);
    let prettified = initialComments+initialDirectivesAndStartsStr+shapesStr;

    // Is there any change?
    // It is true that without this check the user
    // wouldn't appreciate the difference but yashe
    // would be doing operations that would appear 
    // in the undo/redo stack
    if(previousValue!=prettified){
        yashe.setValue(prettified) ;
        prettifyComments();
        setCursor(yashe,cursorPosition);
    }
}

function getShapes(tokens){
    return getShapesTokens(tokens).reduce((acc,shapeTokens)=>{
        let nodes = getNodes(shapeTokens);
        let comments = getCommentsAfterShape(shapeTokens);
        let prefixes = getPrefixesAfterShape(shapeTokens);

        acc.push(new Shape(nodes,comments,prefixes));
        return acc;11

    },[])
}

function getPrefixesAfterShape(shapeTokens){
    return getDirectivesAndStartsStr(getDirectivesAndStarts(shapeTokens.reverse()));
}

function getNodes(shapeTokens){
    return getSlots(shapeTokens).reduce((acc,slot,index)=>{
            let constraints = getBeforeTriplesTokens(slot);
            let triples = getTriples(getTripleTokens(slot));
            let paranthesis = hasFinalParenthesis(slot);
            let emptyBrackets = isEmptyBrackets(slot,triples);

            let node = new Node(constraints,triples,'',emptyBrackets,[],paranthesis);
            acc.push(node);
            return acc;
    },[]);
}

function isEmptyBrackets(tokens,triples){
    let key = tokens.reduce((acc,t)=>{
        if(t.string==OPENING_CURLY_BRACKET)acc= true;
        return acc;
    },false);
    return key && triples.length==0;
}


function hasFinalParenthesis(slot){
    return slot[slot.length-1].string ==CLOSING_PARENTHESIS;
}

function getCommentsAfterShape(shapeTokens){
    let i = 0;
    return shapeTokens.reverse().reduce((acc,t,index)=>{

        if(t.type==COMMENT_TYPE && index == i){ //index == i is needed in order not to take comments after a differtent token (CLOSING_CURLY_BRACKET)
            if(!isDirective(shapeTokens[index+1])){//check that it's not a directive comment
                acc.push(t);
            }
            i++;
        }

         
        if(isDirective(t) || isStart(t,shapeTokens[index+1])){
            i++
        }

        return acc;
    },[]).reverse();
}

function getTriples(tokens) {
        let triples = [];
        let singleTriple = [];
        let start = false;
        let finish = true;
        let open = 0;
        let isStartWithComent = false;
        return tokens.reduce((acc,token,index)=>{

            if(token.skip) return acc; //Is a comment that is part of the previous triple
            singleTriple.push(token);     

            if(isFinishOfTriple(tokens,token,index,finish)){
                if(singleTriple.length>1){
                        let before = getBeforeTriplesTokens(singleTriple);
                        let tripleTokens = getTripleTokens(singleTriple);
                        let subTriples = getTriples(tripleTokens);
                        let after = getAfterTripleTokens(singleTriple);
                        let comment = getComentsAfterToken(token,tokens,index); //We want the tokens after the Triple
                        let emptyBrackets = start && subTriples.length==0;
              
                        acc.push(new Node(before,subTriples,comment,emptyBrackets,after));
                        start=false;
                }
                singleTriple = [];
            }

            if(token.string==OPENING_CURLY_BRACKET){
                open++;
                start = true;
                finish = false;
            }
                
            if(token.string==CLOSING_CURLY_BRACKET) open--;
            if(open==0 && start)finish=true;
     
            return acc;
        },[])
}

function getAfterTripleTokens(tokens){
    let start=false;
    let open = 0;
    return tokens.reduce((acc,t)=>{
        
        if(open == 0 && start){
            if(t.string  != SEMICOLON
             && t.string != CLOSING_CURLY_BRACKET)acc.push(t);
        }

        if(t.string==OPENING_CURLY_BRACKET){
            open++;
            start=true;
        }

        if(t.string==CLOSING_CURLY_BRACKET){
            open--;
        }

      
        return acc;
    },[])
}


function getBeforeTriplesTokens(tokens){
    let start=true;
    return tokens.reduce((acc,t,index)=>{
        
        if(t.string==OPENING_CURLY_BRACKET && start){ //Break condition 1
            //We want the comments after the '{'
            let comment = getComentsAfterToken(t,tokens,index);
            acc.push({type:COMMENT_TYPE,string:comment});
            start = false;
        }

        if(index == tokens.length-1 && t.string!='.')start=false; //Break condition 2

        if(start){
            acc.push(t);
        }else{
            if(t.type!=PUNC_TYPE && t.type!=COMMENT_TYPE && index == tokens.length-1 )acc.push(t); // This is needed when a slot doesn't have any triple
        }
       
        return acc;
    },[])
}


function getTripleTokens(tokens){
    let start=false;
    let open = 0;
    return tokens.reduce((acc,t,index)=>{
        
        if(start)acc.push(t);
        
        if(t.string==OPENING_CURLY_BRACKET){
            open++;
            start=true;
        }

        if(t.string==CLOSING_CURLY_BRACKET){
            open--;
        }

        if(open == 0 && start){
            start=false;
        }
        return acc;
    },[])
}

function getSlots(tokens){
     let slot = [];
     let isMulti = false;
     let start=false;
     let open = 0;
     return tokens.reduce((acc,t,index)=>{
   
        if(t.string==OPENING_CURLY_BRACKET){
            open++;
            start=true;
        }

        if(t.string==CLOSING_CURLY_BRACKET){
            open--;
        }

        if(open == 0 && start)start=false;


        if((t.string.toUpperCase() == AND_KEYWORD || t.string.toUpperCase() == OR_KEYWORD)&& !start){
            isMulti = true;
            acc.push(slot);
            slot = [];
        }
        
        //If there is any directive or start after the Shape we don't want it
        if(!isDirective(t) && !isStart(t,tokens[index-1])){
            slot.push(t);
        }
       
        if(index == tokens.length-1){
            acc.push(slot);
        }

         return acc;
     },[])
}



function getTokens(){
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


function getInitialDirectivesAndStarts(tokens){
    return getDirectivesAndStarts(tokens,SHAPE_TYPE);
}


/**
Sorry Acebal
 */
function getDirectivesAndStarts(tokens,breakCondition){
    let prefix = {};
    let base = {};
    let importt = {};
    let prefixCont = 0;
    let baseCont = 0;
    let importCont = 0;
    let startCont = 0;
    let stop = false;
    return tokens.reduce((acc,t,index)=>{

        if(stop)return acc;
        if(t.type == breakCondition)stop=true;


        if(t.string.toUpperCase()==PREFIX_KEYWORD){
            prefix = {};
            prefix.comments = getComentsAfterToken(t,tokens,index); 
            acc.prefixes[prefixCont]=prefix;
            prefixCont++;
        }else if(t.string.toUpperCase()==BASE_KEYWORD){
            base = {};
            base.comments = getComentsAfterToken(t,tokens,index); 
            acc.bases[baseCont]=base;
            baseCont++;
        }else if(t.string.toUpperCase()==IMPORT_KEYWORD){
            importt = {};
            importt.comments = getComentsAfterToken(t,tokens,index); 
            acc.imports[importCont]=importt;
            importCont++;
        }else if(t.string.toUpperCase()==START_KEYWORD){
            let str = t.string+" = "+tokens[index+2].string+getComentsAfterToken(tokens[index+2],tokens,index+2);
            acc.starts[importCont]=str;
            startCont++;
        }else{    

            if(t.type == PREFIX_ALIAS_TYPE){
                prefix.alias= t;
                prefix.comments += getComentsAfterToken(t,tokens,index); 
            }

            if(t.type == PREFIX_IRI_TYPE){
                prefix.iri= t;
                prefix.comments += getComentsAfterToken(t,tokens,index); 
            }

            if(t.type==BASE_TYPE){
                base.token= t;
                base.comments += getComentsAfterToken(t,tokens,index); 
            }

            if(t.type==IMPORT_TYPE){
                importt.token= t;
                importt.comments += getComentsAfterToken(t,tokens,index); 
            }
        }
        return acc;
    },{
        prefixes:[],
        bases:[],
        imports:[],
        starts:[]
    })
}



/**
*   Split the tokens into Shapes
*   @param {Array} Tokens
*   @return {Array} Defined Shapes (Array of Token's arrays)
*
 */
function getShapesTokens(tokens){
    let shape = []
    let shapeCont = 0;
    let hasTripleStarted = false;
    //Separate shapes in arrays
    return tokens.reduce((acc,t)=>{

        if(t.type == SHAPE_TYPE){
            shape = [];
            
            shape.push(t)
            acc[shapeCont]=shape;
            shapeCont++;
        }else{    
            shape.push(t);
        }

        return acc;

    },[]);
}

/**
*  Gets the comments after a token
* */
function getComentsAfterToken(token,tokens,index) {
    let i =1;
    let comment = "";
    while(tokens[index+i] && tokens[index+i].type==COMMENT_TYPE){
        if(tokens[index+i].start < token.start){
            comment+="\n";
        }
        comment+=" "+tokens[index+i].string;
        tokens[index+i].skip = true;
        i++;
    }

    return comment;
}

/**
* Comments at the beginning of the file if exists
*/
function getFirstComments(tokens){    
    let i =0;
    let comment = "";
    while(tokens[i] && tokens[i].type==COMMENT_TYPE){
        if(tokens[i].string.startsWith('#') && i>0){
            comment+="\n";
        }
        comment+=tokens[i].string;
        i++;
    }

    if(comment!='')comment+='\n\n';
    return comment;
}

function isDirective(token) {
    if(!token)return false;
    if( token.string.toUpperCase()==PREFIX_KEYWORD
        || token.string.toUpperCase()==BASE_KEYWORD
        || token.string.toUpperCase()==IMPORT_KEYWORD
        || token.type == PREFIX_ALIAS_TYPE 
        || token.type == PREFIX_IRI_TYPE
        || token.type == BASE_TYPE
        || token.type == IMPORT_TYPE){
            return true;
    }
    return false;
}


function getCursorPosition(yashe){
    let cursor = yashe.getCursor();
    let cursorToken = yashe.getTokenAt({line:cursor.line,ch:cursor.ch})
    cursorToken.line = cursor.line;

    let position = 0;
    for (var l = 0; l <= cursor.line; ++l) {
        let lineTokens = yashe.getLineTokens(l);
        for(let t in lineTokens){
            let token = lineTokens[t];
            if(token.type!=WS_TYPE){
                position++;
            }

            if(isCursorToken(token,cursorToken,l)){
                return position;
            }
        }
     }
     return position;
}

function setCursor(yashe,position){
    let currentPostion =0;
    for (var l = 0; l < yashe.lineCount(); ++l) {
        let lineTokens = yashe.getLineTokens(l);
        for(let t in lineTokens){
            let token = lineTokens[t];
            if(token.type!=WS_TYPE)currentPostion++;
            if(position==currentPostion){
                yashe.setCursor({line:l,ch:token.end})
                return;
            }
        }
    }
}


function prettifyComments(){
    let longest = getLongestCommentedLine();
    for (var l = 0; l < yashe.lineCount(); ++l) {
        let lineTokens = formatUtils.getNonWsLineTokens(yashe.getLineTokens(l));
        if(!hasOnlyComments(lineTokens)){
            lineTokens.map(t=>{
                if(t.type == 'comment') {
                    yashe.replaceRange(printUtils.getSeparator(longest-t.start)+t.string,{line:l,ch:t.start},{line:l,ch:t.end})
                }
            });
        }
    }
}

function getLongestCommentedLine(){
    let longest = 0;
    for (var l = 0; l < yashe.lineCount(); ++l) {
        let lineTokens = formatUtils.getNonWsLineTokens(yashe.getLineTokens(l));
        let lastLineToken = lineTokens[lineTokens.length-1];
        if(lastLineToken)
            if(lastLineToken.start>longest)
                longest = lastLineToken.start;
    }
    return longest;
}

/**
 * Returns true if the line has onlyComments
 */
function hasOnlyComments(lineTokens){
    return lineTokens.reduce((acc,t)=>{
        if(t.type!='comment')acc=false;
        return acc;
    },true);
}


function isCursorToken(token1,token2,line){
    return  token1.start == token2.start 
            && token1.end == token2.end
            && token1.string == token2.string
            && token1.type == token2.type
            && line == token2.line;
}

function isStart(token,previousToken) {
    if((token.string.toUpperCase()==START_KEYWORD && token.type == KEYWORD_TYPE)
    || (token.string== EQUALS && token.type == PUNC_TYPE)
    || (token.type == SHAPE_REF_TYPE && previousToken &&  previousToken.string == EQUALS)) return true;
    return false;
}

function isFinishOfTriple(tokens,token,index,finish){
    return (token.string == SEMICOLON && finish) || index == tokens.length-1;
}

function getNonWsTokens(tokens){
    return tokens.filter(function(obj){
        return obj.type != WS_TYPE;
    })
}


module.exports = {
    prettify:prettify,
}


let Shape = require('./shape.js');
let Node = require('./node.js');
let formatUtils = require('../formatUtils.js');
let {
    getLongestPrefix,
    getSeparator,
    getDirectivesAndStartsStr,
    getShapesStr
} = require('./printUtils.js');
let {
    OPENING_CURLY_BRACKET,
    CLOSING_CURLY_BRACKET,
    CLOSING_PARENTHESIS,
    SEMICOLON,
    EQUALS,

    SHAPE_TYPE,
    COMMENT_TYPE,
    WS_TYPE,
    PREFIX_ALIAS_TYPE,
    PREFIX_IRI_TYPE,
    BASE_TYPE,
    IMPORT_TYPE,
    PUNC_TYPE,
    KEYWORD_TYPE,
    SHAPE_REF_TYPE,

    PREFIX_KEYWORD,
    BASE_KEYWORD,
    IMPORT_KEYWORD,
    AND_KEYWORD,
    OR_KEYWORD,
    START_KEYWORD
} = require('../constUtils.js');
const printUtils = require('./printUtils.js');
