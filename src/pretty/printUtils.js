

function getSeparator(size){
    let space = ' ';
    let separator = '     ';
    for(let i=0;i<size;i++){
        separator+=space;
    }
    return separator;
}   


function getLongestPrefix(prefixes){
    return prefixes.reduce((acc,p) =>{
        if(p.prefixName.length>acc)acc=p.prefixName.length;
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

function needsSeparator(index,token,nexToken,constraints){
  return    index==0 
        && token.type!='shape' 
        && token.string!='and'
        && token.string!='or' 
        && token.string!='('
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


function getSeparatorIfNeeded(index,token,nexToken,longest,constraints){
    let separator = " ";
    if(needsSeparator(index,token,nexToken,constraints)){
        let actual = token.string.length;
        let diference = longest - actual;
        separator=getSeparator(diference);
    }
    return separator;
}

module.exports ={
    getSeparator:getSeparator,
    getLongestPrefix:getLongestPrefix,
    getLongestTConstraint:getLongestTConstraint,
    getSeparatorIfNeeded:getSeparatorIfNeeded
}