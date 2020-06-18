let Prefix = require('./prefix.js');
let Shape = require('./shape.js');
let Node = require('./node.js');
let {getLongestPrefix,getSeparator} = require('./printUtils.js');


function prettify(yashe){

    let tokens = getTokens(yashe);

    let pTokens = getPrefixesTokens(tokens);
    let prefixes = getPrefixes(pTokens);

    let starts = getStarts(tokens);
    let sTokens = getShapesTokens(tokens);

    

    let shapes = getShapes(sTokens);

    //console.log(shapes)

    let str = getPrefixesStr(prefixes)+"\n";
    str+=starts.reduce((acc,s)=>{
        return acc+=s+"\n";
    },"");

    str+='\n';

    yashe.setValue(shapes.reduce((acc,s)=>{
        return acc+=s.toString()+"\n\n";
    },str));


}



function getShapes(sTokens){
    return sTokens.reduce((acc,shape)=>{
        let id  = acc.length;
        let shapeDef = shape[0].string;
        let slots = getSlots(shape);
        let nodes = slots.reduce((acc,slot)=>{
            let constraints = getBeforeTriplesTokens(slot);
            let tTokens = getTripleTokens(slot);
            let triples = getTriples(id,tTokens);
            let node = new Node(constraints,triples);
            acc.push(node);
            return acc;
        },[]);

        let s = new Shape(nodes);
        acc.push(s);

        return acc;

    },[])
}

function getTriples(shapeId,tokens) {
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
                        let subTriples = getTriples(acc.length,tripleTokens);
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
        
        if(open == 0 && start==true){
            if(t.string != ';')acc.push(t);
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
    let isFirstToken=false;
    let open = 0;
    return tokens.reduce((acc,t,index)=>{
        
        if(start)acc.push(t);
        
        if(t.string=='{'){
            open++;
            start=true;
            isFirstToken = true;
        }

        if(t.string=='}'){
            open--;
        }

        if(open == 0 && start==true){
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

        if(open == 0 && start==true)start=false;


        if((t.string.toLowerCase() =='and' || t.string.toLowerCase() =='or')&& !start){
            isMulti = true;
            acc.push(slot);
            slot = [];
        }
        
        slot.push(t);
        


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

function getPrefixesTokens(tokens){
    let prefix = [];
    let prefixCont = 0;
    return tokens.reduce((acc,element)=>{
        if(element.type == 'keyword' && element.string.toLowerCase()=='prefix'){
            prefix = [];
            prefix.push(element)
            acc[prefixCont]=prefix;
            prefixCont++;
        }else{

            if(element.type=='prefixDelcAlias' || element.type=='prefixDelcIRI'){
                prefix.push(element);
            }
            
        }

        return acc;

    },[]);
}

function getStarts(tokens){
    let starts=[];
    for(let i=0;i<tokens.length;i++){
        if(tokens[i].type == 'keyword' && tokens[i].string.toLowerCase()=='start'){
            let str = tokens[i].string;
            str+=" = ";
            i++;
            i++;
            str+=tokens[i].string
            starts.push(str);
        }
    }
    return starts;
}



/**
*   Split the tokens into Shapes
*   @param {Array} Tokens
*   @return {Array} Defined Shapes (Array of Token's arrays)
*
 */
function getShapesTokens(tokens){
    let shape = []
    let brackets=0
    let shapeCont = 0;
    let hasTripleStarted = false;
    //Separate shapes in arrays
    return tokens.reduce((acc,element)=>{

        if(element.type == 'shape'){
            shape = [];
            shape.push(element)
            acc[shapeCont]=shape;
            shapeCont++;
        }else{
            shape.push(element);
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


function getPrefixes(pTokens){
    return pTokens.reduce((acc,prefix)=>{
        acc.push(new Prefix(prefix[1].string,prefix[2].string));
        return acc;
    },[]);
}

function getPrefixesStr(prefixes){
    return prefixes.reduce((acc,p)=>{
        let dif = getLongestPrefix(prefixes) - p.prefixName.length;
        return acc+='PREFIX '+p.prefixName+getSeparator(dif)+p.prefixValue+'\n';
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