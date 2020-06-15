function getSeparators(triple,longest){
    let typeLength = triple.type.toString().length;
    let constLength = triple.constraint.toString().length;
    let facetLength = getFacetsString(triple.facets).length;
    let refLength = triple.shapeRef.toString().length;
    let cardLength;
    if(triple.cardinality)cardLength = triple.cardinality.toString().length;
    let bodyLength = constLength+facetLength+refLength;
    if(triple.constraint.toString()=='.')bodyLength-=2;

    let typeDiference = longest.type - typeLength;
    let bodyDiference = longest.body - bodyLength;
    let cardDiference = longest.card - cardLength;

       
    return{
        type:getSeparator(typeDiference),
        body:getSeparator(bodyDiference),
        card:getSeparator(cardDiference),
    }
}

function getLongestElements(triples){
    let longestType = getLongestElement(triples,'type');
    let longestConstraint = getLongestElement(triples,'constraint');
    let longestFacet = getLongestFacet(triples,'facet');
    let longestRef = getLongestElement(triples,'shapeRef');
    let longestCard = getLongestElement(triples,'cardinality');
    let longestBody = getLongestBody(triples);

    return {
        type:longestType,
        body:longestBody,
        card:longestCard
    }
}


function getLongestElement(triples,element){
      let size=0;
      triples.forEach(triple => {
          let value;
          if(triple[element])value = triple[element].toString().length;
          if(value>size)size = value;
      });
      return size;
}

function getLongestFacet(triples){
    let size=0;
    triples.forEach(triple => {
        let value = getFacetsString(triple.facets).length;
        if(value>size)size = value;
    });
    return size;
}

function getFacetsString(facets){
    return facets.reduce((acc,f)=>{
        return acc+=f.toString()+' ';
    },'')+' ';
}

function getLongestBody(triples){
    return triples.reduce((acc,t)=>{
        let cValue = t.constraint.toString().length;
        let fValue = getFacetsString(t.facets).length;
        let rValue = t.shapeRef.toString().length;
        let value = cValue+fValue+rValue;
        if(value>acc)acc = value;
        return acc;
    },0);
}


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

module.exports ={
    getSeparators:getSeparators,
    getLongestElements:getLongestElements,
    getSeparator:getSeparator,
    getLongestPrefix:getLongestPrefix

}