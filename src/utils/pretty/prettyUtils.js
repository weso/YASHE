let Shape = require('./shape.js');
let Node = require('./node.js');
let {getLongestPrefix,getSeparator} = require('./printUtils.js');


const PREFIX_KEYWORD = 'PREFIX ';
const BASE_KEYWORD = 'BASE   ';
const IMPORT_KEYWORD = 'IMPORT ';


function prettify(yashe){

    //  Cursor and tokens
    let cursorPosition = getCursorPosition(yashe);
    let tokens = getTokens(yashe);

    //  Objects
    let firstComments = getFirstComments(tokens);
    let directivesAndStarts = getDirectivesAndStarts(tokens);
    let shapes = getShapes(tokens);

    //  Strings
    let directivesStr = getDirectivesAndStartsStr(directivesAndStarts);
    let shapesStr = getShapesStr(shapes);

    yashe.setValue(firstComments+directivesStr+shapesStr) ;
    setCursor(yashe,cursorPosition);
}

function getShapes(tokens){
    return getShapesTokens(tokens).reduce((acc,shapeTokens)=>{
        let nodes = getNodes(shapeTokens);
        let comments = getCommentsAfterShape(shapeTokens);
        
        acc.push(new Shape(nodes,comments));
        return acc;

    },[])
}

function getNodes(shapeTokens){
    return getSlots(shapeTokens).reduce((acc,slot,index)=>{
            let constraints = getBeforeTriplesTokens(slot);
            let triples = getTriples(getTripleTokens(slot));
            let paranthesis = hasFinalParenthesis(slot);
            let node = new Node(constraints,triples,'',null,[],paranthesis);
            acc.push(node);
            return acc;
    },[]);
}

function hasFinalParenthesis(slot){
    return slot[slot.length-1].string ==')';
}

function getCommentsAfterShape(shapeTokens){
    let i = 0;
    return shapeTokens.reverse().reduce((acc,t,index)=>{
        if(t.type=='comment' && index == i){ //index == i is needed in order not to take comments after a differtent token ('}')
            acc.push(t);
            i++;
        }

        if(isDirective(t) || isStart(t,shapeTokens[index+1])){
            i++;
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

                        acc.push(new Node(before,subTriples,comment,start,after));
                        start=false;
                }
                singleTriple = [];
            }

            if(token.string=='{'){
                open++;
                start = true;
                finish = false;
            }
                
            if(token.string=='}') open--;
            if(open==0 && start)finish=true;
     
            return acc;
        },[])
}

function getAfterTripleTokens(tokens){
    let start=false;
    let open = 0;
    return tokens.reduce((acc,t)=>{
        
        if(open == 0 && start){
            if(t.string  != ';'
             && t.string != '}')acc.push(t);
        }

        if(t.string=='{'){
            open++;
            start=true;
        }

        if(t.string=='}'){
            open--;
        }

      
        return acc;
    },[])
}



function isFinishOfTriple(tokens,token,index,finish){
    return (token.string == ';' && finish) || index == tokens.length-1;
}

function getBeforeTriplesTokens(tokens){
    let start=true;
    return tokens.reduce((acc,t,index)=>{
        
        if(t.string=='{' && start){ //Break condition 1
            //We want the comments after the '{'
            let comment = getComentsAfterToken(t,tokens,index);
            acc.push({type:'comment',string:comment});
            start = false;
        }

        if(index == tokens.length-1 && t.string!='.')start=false; //Break condition 2

        if(start){
            acc.push(t);
        }else{
            if(t.type!='punc' && t.type!='comment' && index == tokens.length-1 )acc.push(t); // This is needed when a slot doesn't have any triple
        }
       
        return acc;
    },[])
}


function getTripleTokens(tokens){
    let start=false;
    let open = 0;
    return tokens.reduce((acc,t,index)=>{
        
        if(start)acc.push(t);
        
        if(t.string=='{'){
            open++;
            start=true;
        }

        if(t.string=='}'){
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
   
        if(t.string=='{'){
            open++;
            start=true;
        }

        if(t.string=='}'){
            open--;
        }

        if(open == 0 && start)start=false;


        if((t.string.toLowerCase() =='and' || t.string.toLowerCase() =='or')&& !start){
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


/**
Sorry Acebal
 */
function getDirectivesAndStarts(tokens){
    let prefix = {};
    let base = {};
    let importt = {};
    let prefixCont = 0;
    let baseCont = 0;
    let importCont = 0;
    let startCont = 0;
    return tokens.reduce((acc,t,index)=>{
        if(t.string.toLowerCase()=='prefix'){
            prefix = {};
            prefix.comments = getComentsAfterToken(t,tokens,index); 
            acc.prefixes[prefixCont]=prefix;
            prefixCont++;
        }else if(t.string.toLowerCase()=='base'){
            base = {};
            base.comments = getComentsAfterToken(t,tokens,index); 
            acc.bases[baseCont]=base;
            baseCont++;
        }else if(t.string.toLowerCase()=='import'){
            importt = {};
            importt.comments = getComentsAfterToken(t,tokens,index); 
            acc.imports[importCont]=importt;
            importCont++;
        }else if(t.string.toLowerCase()=='start'){
            let str = t.string+" = "+tokens[index+2].string+getComentsAfterToken(tokens[index+2],tokens,index+2);
            acc.starts[importCont]=str;
            startCont++;
        }else{    

            if(t.type == 'prefixDelcAlias'){
                prefix.alias= t;
                prefix.comments += getComentsAfterToken(t,tokens,index); 
            }

            if(t.type == 'prefixDelcIRI'){
                prefix.iri= t;
                prefix.comments += getComentsAfterToken(t,tokens,index); 
            }

            if(t.type=='baseDecl'){
                base.token= t;
                base.comments += getComentsAfterToken(t,tokens,index); 
            }

            if(t.type=='importDecl'){
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

        if(t.type == 'shape'){
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
    while(tokens[index+i] && tokens[index+i].type=='comment'){
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
    while(tokens[i] && tokens[i].type=='comment'){
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
    if( token.string.toLowerCase()=='prefix'
        || token.string.toLowerCase()=='base'
        || token.string.toLowerCase()=='import'
        || token.type =='prefixDelcAlias' 
        || token.type =='prefixDelcIRI'
        || token.type =='baseDecl'
        || token.type =='importDecl'){
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
            if(token.type!='ws'){
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
            if(token.type!='ws')currentPostion++;
            if(position==currentPostion){
                yashe.setCursor({line:l,ch:token.end})
                return;
            }
        }
    }
}

function isCursorToken(token1,token2,line){
    return  token1.start == token2.start 
            && token1.end == token2.end
            && token1.string == token2.string
            && token1.type == token2.type
            && line == token2.line;
}

function isStart(token,previousToken) {
    if((token.string.toLowerCase()=='start'&& token.type =='keyword')
    || (token.string=='=' && token.type =='punc')
    || (token.type =='shapeRef' && previousToken &&  previousToken.string == '=')) return true;
    return false;
}



function getPrefixesStr(prefixes,keyword){
    return prefixes.reduce((acc,p)=>{
        let dif = getLongestPrefix(prefixes) - p.alias.string.length;
        return acc+= keyword+p.alias.string+getSeparator(dif)+p.iri.string+p.comments+'\n';
    },'');
}


function getDirectivesAndStartsStr(directives) {
    let prefixesStr = getPrefixesStr(directives.prefixes,PREFIX_KEYWORD);
    let basesStr = getConcreteDirectiveStr(directives.bases,BASE_KEYWORD);
    let importsStr = getConcreteDirectiveStr(directives.imports,IMPORT_KEYWORD);
    let startsStr = getStartsStr(directives.starts); 
    return prefixesStr+basesStr+importsStr+'\n'+startsStr;
}



function getConcreteDirectiveStr(directives,keyword) {
    return directives.reduce((acc,d)=>{
        return acc+=keyword+d.token.string+d.comments+'\n';
    },'');
}

function getStartsStr(starts) {
    return starts.reduce((acc,s)=>{
        return acc+=s+"\n";
    },"")+'\n';
}

function getShapesStr(shapes) {
    return shapes.reduce((acc,s)=>{
        return acc+=s.toString()+"\n\n";
    },'');
}


function getNonWsTokens(tokens){
    return tokens.filter(function(obj){
        return obj.type != 'ws';
    })
}


module.exports = {
    prettify:prettify,
}