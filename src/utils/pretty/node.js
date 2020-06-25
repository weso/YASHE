let {
    getSeparatorIfNeeded,
    getLongestTConstraint,
    getValueSetSize,
    getIndent,
    LINE_BREAK,
    WHITE_SPACE,
    EMPTY_STRING,
    VALUESET_LINE_LIMIT,
    EMPTY_BRACKETS,
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

class Node{

    constructor(constraints,triples,comment='',emptyBrackets,afterTriples=[],finalParenthesis=''){
        this.constraints = constraints;
        this.triples = triples;
        this.comment = comment; //Comment at the end
        this.emptyBrackets = emptyBrackets; //ej: schema:name    {};
        this.afterTriples= afterTriples; // Whatever after {}
        this.finalParenthesis = finalParenthesis;  //Is an
    }

    toString(longest,isTriple,indent=1,isLastTriple=false){
        let str = EMPTY_STRING;
        let constraints=this.getConstraints(longest,indent);
        str+=constraints.str;
        str+=this.getTriplesString(indent,constraints.tripleComment,isTriple,isLastTriple);
       
        return str;
    }

    //This method could be prettier
    getConstraints(longest,indent){
        let valueSetSize = getValueSetSize(this.constraints);
        let forceSeparator = false;
        let valueSet = false;
        return this.constraints.reduce((acc,token,index)=>{
            let nexToken = this.constraints[index+1];
            let separator = getSeparatorIfNeeded(index,token,nexToken,this.triples.length,longest,this.constraints,this.emptyBrackets);

            if(token.type==COMMENT_TYPE){
            
                forceSeparator = this.startsWithComment(index);//If it's a comment before the constraints skip it
                acc.tripleComment+= this.getTripleComment(forceSeparator,token); //If not, add it to the finish of the line


            }else{
                
                index     = this.decrementIndexIfNeeded(forceSeparator);
                separator = this.modifySeparatorIfNeeded(separator,nexToken,valueSetSize);
                valueSet  = this.isLongValueSet(token,valueSetSize);
                acc.str  += this.getOpeningValueSetIfNeeded(valueSet,indent);
                acc.str  += this.getWhiteSpaceIfNeeded(token);
                acc.str  += this.getTokenString(token,separator);
                acc.str  += this.getClosingValueSetIfNeeded(nexToken,valueSet,indent);
                
            }
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
        str += this.getAfterTriplesStr();
        str += this.getSemicolonIfNeeded(isTriple,isLastTriple,tripleComment);
        str += this.getFinalParenthesisIfNeeded();
    
        return str;
    }


    getSubTriplesStrIfNeeded(indent,tripleComment,isTriple){
        let str = EMPTY_STRING;
        if(this.triples.length>0){
            let linebreak = LINE_BREAK;
            if(isTriple && this.triples.length==1){
                if(tripleComment==EMPTY_STRING){// If there is any comment after '{' we need to force the breakline
                    linebreak = EMPTY_STRING;
                    indent--;
                }
            } 
            str+=this.getSubTriplesStr(indent,tripleComment,linebreak);  
        }
        return str;
    }


    getSubTriplesStr(indent,tripleComment,linebreak){
        let str=OPENING_CURLY_BRACKET+tripleComment+linebreak;
        this.triples.map((t,index)=>{
            let currentLongest = getLongestTConstraint(this.triples);
            str+= getIndent(indent);
            str+= t.toString(currentLongest,true,indent+1,this.isLastTriple(index));
            str+= WHITE_SPACE+t.comment +linebreak;
        })
        return str + getIndent(indent-1)+CLOSING_CURLY_BRACKET;
    }


    getAfterTriplesStr(){
        let str = EMPTY_STRING;
        if(this.afterTriples.length>0)str+=WHITE_SPACE;
        return this.afterTriples.reduce((acc,a)=>{
            return acc+=a.string+WHITE_SPACE;
        },str);
    }

    getSemicolonIfNeeded(isTriple,isLastTriple,tripleComment){
        let str = EMPTY_STRING;
        if(isTriple){
            if(!isLastTriple)str+=SEMICOLON;
            str+=tripleComment;
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

    isLongValueSet(token,valueSetSize){
        return token.type==VALUESET_TYPE && valueSetSize>VALUESET_LINE_LIMIT;
    }

    decrementIndexIfNeeded(index,forceSeparator){
        if(forceSeparator)
            return index-1;
        return index;
    }

    getOpeningValueSetIfNeeded(valueSet,indent){
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




}
module.exports = Node;