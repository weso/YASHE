let Prefix = require('./prefix.js');
let Shape = require('./shape.js');
let Node = require('./node.js');
let {getLongestPrefix,getSeparator} = require('./printUtils.js');


const BASE_KEYWORD = 'BASE   ';
const IMPORT_KEYWORD = 'IMPORT ';


function prettify(yashe){

    let tokens = getTokens(yashe);
    let directives = getDirectives(tokens);
    let starts = getStarts(tokens);
    let comments = getComments(tokens);
    //console.log(comments);
    let shapes = getShapes(tokens);

    let directivesStr = getDirectivesStr(directives);
    let startsStr = getStartsStr(starts);
    let shapesStr = getShapesStr(shapes);

    yashe.setValue(directivesStr+startsStr+shapesStr) ;

}


function getShapes(tokens){
    return getShapesTokens(tokens).reduce((acc,shapeTokens)=>{
        let nodes = getNodes(shapeTokens);
        let comments = getCommentsAfterShape(shapeTokens);
        
        acc.push(new Shape(nodes));
        return acc;

    },[])
}

function getNodes(shapeTokens){
    return getSlots(shapeTokens).reduce((acc,slot,index)=>{
            let constraints = getBeforeTriplesTokens(slot);
            let triples = getTriples(getTripleTokens(slot));

            let node = new Node(constraints,triples);
            acc.push(node);
            return acc;
    },[]);
}

function getCommentsAfterShape(shapeTokens){
    let i = 0;
    return shapeTokens.reverse().reduce((acc,t,index)=>{
        if(t.type=='comment' && index == i){ //index == i is needed in order not to take comments after a differtent token ('}')
            acc.push(t);
            i++;
        }
        return acc;
    },[])
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
        if(t.string=='{'){ //Break condition 1
            //We want the comments after the '{'
            let comment = getComentsAfterToken(t,tokens,index);
            acc.push({type:'comment',string:comment});
            start = false;
        }
        if(index == tokens.length-1)start=false; //Break condition 2

        if(start){
            acc.push(t);
        }else{
            if(t.type!='punc' && index == tokens.length-1 )acc.push(t); // This is needed when a slot doesn't have any triple
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

function getDirectives(tokens){
    let prefix = []; 
    let prefixCont= 0;
    let baseCont= 0;
    let importCont= 0; 
    return tokens.reduce((acc,token)=>{
        
        if(token.type=='prefixDelcAlias'){ 
            prefix.push(token);
        }

        if(token.type=='prefixDelcIRI'){
            prefix.push(token);
            acc.prefixes[prefixCont]=prefix;
            prefixCont++;
            prefix = []; 
        }

        if(token.type=='baseDecl'){
            acc.bases[baseCont]=token;
            baseCont++;  
        }

        if(token.type=='importDecl'){
            acc.imports[importCont]=token;
            importCont++;
        }

        return acc;

    },{
        prefixes:[],
        bases:[],
        imports:[]
    });
}

function getStarts(tokens){
    return tokens.reduce((acc,t,index)=>{
        if(t.type == 'keyword' && t.string.toLowerCase()=='start'){
            let str = t.string+" = ";
            str+=tokens[index+2].string
            acc.push(str);
        }
        return acc;
    },[])
    
}

function getComments(tokens) {
    let open = 0;
    return tokens.reduce((acc,t)=>{
        if(t.string=='{'){
            open++;
        }

        if(t.string=='}'){
            open--;
        }

        if(open == 0 && t.type=='comment'){
            acc.push(t);
        }
        return acc;
    },[])
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
    let comments=[];
    while(tokens[index+i] && tokens[index+i].type=='comment'){
        comments.push(tokens[index+i]);
        i++;
    }

    comments.map(c=>{
        if(c.start < token.start){
            comment+="\n  ";
        }
        comment+=" "+c.string;
        c.skip = true;
    })
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

function isStart(token,previousToken) {
    if((token.string.toLowerCase()=='start'&& token.type =='keyword')
    || (token.string=='=' && token.type =='punc')
    || (token.type =='shapeRef' && previousToken.string == '=')) return true;
    return false;
}


function getPrefixes(tokens){
    return tokens.reduce((acc,prefix)=>{
        acc.push(new Prefix(prefix[0].string,prefix[1].string));
        return acc;
    },[]);
}

function getPrefixesStr(prefixes){
    return prefixes.reduce((acc,p)=>{
        let dif = getLongestPrefix(prefixes) - p.prefixName.length;
        return acc+='PREFIX '+p.prefixName+getSeparator(dif)+p.prefixValue+'\n';
    },'');
}


function getDirectivesStr(directives) {
    let prefixesStr = getPrefixesStr(getPrefixes(directives.prefixes));
    let basesStr = getConcreteDirectiveStr(directives.bases,BASE_KEYWORD);
    let importsStr = getConcreteDirectiveStr(directives.imports,IMPORT_KEYWORD);
    return prefixesStr+basesStr+importsStr+'\n';
}

function getConcreteDirectiveStr(directives,keyword) {
    return directives.reduce((acc,d)=>{
        return acc+=keyword+d.string+'\n';
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