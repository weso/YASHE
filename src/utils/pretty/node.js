class Node{

    constructor(constraints,triples,comment='',emptyBrackets,afterTriples=[],finalParenthesis=''){
        this.constraints = constraints;
        this.triples = triples;
        this.comment = comment;                     //Comment at the end
        this.emptyBrackets = emptyBrackets;         //ej: schema:name    {};
        this.afterTriples= afterTriples;            // Whatever after {}
        this.finalParenthesis = finalParenthesis;  
        this.hasAleardyAComment = false;            //This is used in the methor getSemicolonIfNeeded due not to set the comment again if it has been already seted 
    }

    toString(longest=0,isTriple,indent=1,isLastTriple=false){
        let str = EMPTY_STRING;
        let constraints=this.getConstraints(this.constraints,longest,indent);
        str+=constraints.str;
        str+=this.getTriplesString(indent,constraints.tripleComment,isTriple,isLastTriple);
       
        return str;
    }

    //This method could be prettier
    getConstraints(constraints,longest,indent){
        let valueSetSize = getValueSetSize(constraints);
        let forceSeparator = false;
        let valueSet = false;
        let previousToken;
        return constraints.reduce((acc,token,index)=>{
       
            if(token.skip)return acc;
            
            let nexToken = constraints[index+1];
            let separator = getSeparatorIfNeeded(index,token,nexToken,this.triples.length,longest,constraints,this.emptyBrackets);

            if(token.type==COMMENT_TYPE){
               //console.log({previousToken:previousToken.string,token:token.string,nexToken:nexToken})
                if(previousToken.string=='[' && valueSetSize>2){
                    acc.str+= token.string;
                }else if(nexToken && nexToken.string=='[' && valueSetSize>2){
                    acc.str+= '[ '+token.string;
                    nexToken.skip = true;
                }else if(valueSet){
             
                    acc.str+= token.string;
                    acc.str+= this.getClosingValueSetIfNeeded(nexToken,valueSet,indent);
                }else{
                    forceSeparator = this.startsWithComment(index);//If it's a comment before the constraints skip it
                    acc.tripleComment = this.getTripleComment(forceSeparator,token) + acc.tripleComment ; //If not, add it to the finish of the line
                }
                
                

            }else{
                
                index     = this.decrementIndexIfNeeded(forceSeparator);
                separator = this.modifySeparatorIfNeeded(separator,nexToken,valueSetSize);
                valueSet  = this.isValueSet(token,valueSetSize);
                acc.str  += this.getOpeningValueSetIfNeeded(valueSet,indent,nexToken);
                acc.str  += this.getWhiteSpaceIfNeeded(token);
                acc.str  += this.getTokenString(token,separator);
                acc.str  += this.getClosingValueSetIfNeeded(nexToken,valueSet,indent);
                
            }

            previousToken = token;
            return acc;
        },{
            str:EMPTY_STRING,
            tripleComment:EMPTY_STRING
        });
    }
    


    getTriplesString(indent,tripleComment,isTriple,isLastTriple){
        let str = EMPTY_STRING;
        str += this.getSubTriplesStrIfNeeded(indent,tripleComment,isTriple);
        str += this.getEmptyBracketsIfNeeded();
        str += this.getAfterTriplesStr(indent);
        str += this.getSemicolonIfNeeded(isTriple,isLastTriple,tripleComment);
        str += this.getFinalParenthesisIfNeeded();
    
        return str;
    }


    getSubTriplesStrIfNeeded(indent,tripleComment,isTriple){
        let str = EMPTY_STRING;
        if(this.triples.length>0){
            let linebreak = LINE_BREAK;
            // This is off at this moment
            /* if(isTriple){
                if(this.triples.length==1) { 
                    console.log('p')
                    // If there isn't any comment after '{' don't force the breakline
                    if(tripleComment==EMPTY_STRING && !this.hasComments(this.triples[0])){
                        linebreak = EMPTY_STRING;
                        indent--;
                    }
                }
            } */
            
            str+=this.getSubTriplesStr(indent,tripleComment,linebreak);  
        }
        return str;
    }


    getSubTriplesStr(indent,tripleComment,linebreak){
        this.hasAleardyAComment=true;
        let str=OPENING_CURLY_BRACKET+tripleComment+linebreak;
        if(tripleComment!='')tripleComment='';
        this.triples.map((t,index)=>{
            let currentLongest = getLongestTConstraint(this.triples);
            str+= getIndent(indent);
            str+= t.toString(currentLongest,true,indent+1,this.isLastTriple(index));
            str+= WHITE_SPACE + t.comment +linebreak;
        })
        return str + getIndent(indent-1)+CLOSING_CURLY_BRACKET;
    }


    getAfterTriplesStr(indent){
        let str = EMPTY_STRING;
        if(this.afterTriples.length>0){
            str+=WHITE_SPACE;
        }else{
            return '';
        }
        let constraints = this.getConstraints(this.afterTriples,0,indent);
        return constraints.str+constraints.tripleComment;
    }



    getSemicolonIfNeeded(isTriple,isLastTriple,tripleComment){
        let str = EMPTY_STRING;
        if(isTriple){
            if(!isLastTriple)str+=SEMICOLON;
            if(!this.hasAleardyAComment)str+=tripleComment;
        }
        return str;
    }

    getEmptyBracketsIfNeeded(){
        if(this.emptyBrackets && this.triples.length<=0)
            return EMPTY_BRACKETS;
        return EMPTY_STRING;
    }

    getFinalParenthesisIfNeeded(){
        if(this.finalParenthesis)
            return CLOSING_PARENTHESIS;
        return EMPTY_STRING;
    }

    isLastTriple(index){
        return index==this.triples.length-1;
    }

    startsWithComment(index){
        return index==0;
    }

    getTripleComment(forceSeparator,token){
        //Only if the first token wasn't a comment. 
        if(!forceSeparator) //Because it could be more after the first one 
            return token.string;
        return EMPTY_STRING;
    }

    getTokenString(token,separator){
        return token.string+separator;
    }

    isValueSet(token,valueSetSize){
        return token.type==VALUESET_TYPE && valueSetSize>VALUESET_LINE_LIMIT;
    }

    decrementIndexIfNeeded(index,forceSeparator){
        if(forceSeparator)
            return index-1;
        return index;
    }

    getOpeningValueSetIfNeeded(valueSet,indent,nexToken){
        if(valueSet)
            return LINE_BREAK+getIndent(indent);
        return EMPTY_STRING;
    }

    modifySeparatorIfNeeded(separator,nexToken,valueSetSize){
        if(nexToken && nexToken.string==OPENING_SQUARE_BRACKET && valueSetSize>VALUESET_LINE_LIMIT){
            return WHITE_SPACE;
        }
        return separator;
    }
    
    getWhiteSpaceIfNeeded(token){
        let upper = token.string.toUpperCase();
        if( upper == AND_KEYWORD || upper == OR_KEYWORD)
            return WHITE_SPACE;
        return EMPTY_STRING
    }

    getClosingValueSetIfNeeded(nexToken,valueSet,indent){
        if(nexToken && nexToken.string==CLOSING_SQUARE_BRACKET && valueSet)
            return LINE_BREAK+getIndent(indent-1);
        return EMPTY_STRING;
    }


    hasComments(triple){
        return triple.constraints.reduce((acc,c)=>{
            if(c.type=='comment' && c.start)acc = true; //c.start just to check it's a real comment token
            return acc;
        },false)
    }

   

}

module.exports = Node;

let {
    getSeparatorIfNeeded,
    getLongestTConstraint,
    getValueSetSize,
    getIndent,
    LINE_BREAK,
    WHITE_SPACE,
    EMPTY_STRING,
    VALUESET_LINE_LIMIT,
    EMPTY_BRACKETS
} = require('./printUtils.js');

let {
    CLOSING_PARENTHESIS,
    OPENING_CURLY_BRACKET,
    CLOSING_CURLY_BRACKET,
    OPENING_SQUARE_BRACKET,
    CLOSING_SQUARE_BRACKET,
    SEMICOLON,
    COMMENT_TYPE,
    VALUESET_TYPE,
    AND_KEYWORD,
    OR_KEYWORD
} = require('../constUtils.js');