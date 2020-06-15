let Node = require('./node.js');

function prettify(yashe){
    editor = yashe;
    let tokens = getTokens(yashe);

    let pTokens = getPrefixesTokens(tokens);
    let starts = getStarts(tokens);
    let sTokens = getShapesTokens(tokens);

    let shapes = getShapes(sTokens);

    console.log(shapes)

    yashe.setValue(shapes.reduce((acc,s)=>{
        console.log(s.toString())
        return acc+=s.toString();
    },""));
}

function getShapes(sTokens){
    references = [];
    return sTokens.reduce((acc,shape)=>{
        let id  = acc.length;
        let shapeDef = shape[0].string;
        let sTokens = getBeforeTriplesTokens(shape);

        let tTokens = getTripleTokens(shape);
        let triples = getTriples(id,tTokens);

        let s = new Node(sTokens,triples);
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
        return tokens.reduce((acc,token,index)=>{
            singleTriple.push(token);             
            if(isFinishOfTriple(tokens,token,index,finish)){
                if(singleTriple.length>1){
                        let before = getBeforeTriplesTokens(singleTriple);
                        let after = getTripleTokens(singleTriple);
                        let subTriples = getTriples(acc.length,after);
                        let triple = new Node(before,subTriples);
                        acc.push(triple);
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

function isFinishOfTriple(tokens,token,index,finish){
    return (token.string == ';' && finish) || index == tokens.length-1;
}

function getBeforeTriplesTokens(tokens){
    let start=true;
    return tokens.reduce((acc,t,index)=>{
        if(t.string=='{' || index == tokens.length-1)start=false;
        if(start)acc.push(t);
        return acc;
    },[])
}


function getTripleTokens(tokens){
    let start=false;
    let open = 0;
    return tokens.reduce((acc,t)=>{
        if(start)acc.push(t);
        if(t.string=='{'){
            open++;
            start=true;
        }

        if(t.string=='}'){
            open--;
        }

        if(open == 0 && start==true)start=false;
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

function getNonWsTokens(tokens){
    return tokens.filter(function(obj){
        return obj.type != 'ws';
    })
}


module.exports = {
    prettify:prettify,
}