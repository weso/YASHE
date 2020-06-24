function getSeparator(size){
    let space = ' ';
    let separator = '  ';
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
    let indent = "";
    for(let i=0;i<tab;i++){
        indent+="  ";
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
        if(token.type=='string-2'){
            if(token.string.length>acc){
                acc = token.string.length;
            }
        }
        return acc;
    },0)
}

function needsSeparator(index,token,nexToken,triplesLenght,constraints,emptyBrackets){
  if(triplesLenght==1 || emptyBrackets)return true;
  return   index==0 
        && token.type!='shape' 
        && token.string!='and'
        && token.string!='or' 
        && token.string!='('
        && token.string!='$'
        && token.string!='&'
        && nexToken
        && nexToken.string!='{' 
        && hasConstraints(constraints) ;
}

function hasConstraints(constraints) {
   
    return constraints.reduce((acc,c)=>{
        if(c.type!="string-2" 
        && c.type!='variable-3'
        && c.type!='comment')acc=true;
        return acc;
    },false)
}


function getSeparatorIfNeeded(index,token,nexToken,triplesLenght,longest,constraints,emptyBrackets){
    let separator = " ";
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
        if(t.string == ']')stop=true;
        if(start && !stop && t.type=='valueSet')acc.push(t);
        if(t.string == '[')start=true;
        
        return acc;
    },[]).length;
}

module.exports ={
    getSeparator:getSeparator,
    getLongestPrefix:getLongestPrefix,
    getLongestTConstraint:getLongestTConstraint,
    getSeparatorIfNeeded:getSeparatorIfNeeded,
    getValueSetSize:getValueSetSize,
    getIndent:getIndent
}