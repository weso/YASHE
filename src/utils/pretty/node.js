let {getSeparatorIfNeeded,
    getLongestTConstraint,
    getValueSetSize,
    getIndent} = require('./printUtils.js')

class Node{

    constructor(constraints,triples,comment='',emptyBrackets,afterTriples=[],finalParenthesis=''){
        this.constraints = constraints;
        this.triples = triples;
        this.comment = comment; //Comment at the end
        this.emptyBrackets = emptyBrackets; //ej: schema:name    {};
        this.afterTriples= afterTriples; // Whatever after {}
        this.finalParenthesis = finalParenthesis;  //Is an
    }

    toString(longest,isTriple,indent=1,isLastTriple='false'){
        let {tripleComent,str}=this.getConstraintsString(longest);
        str+=this.getTriplesString(indent,tripleComent,isTriple,isLastTriple);
       
        return str;
    }

    getConstraintsString(longest){
        let valueSetSize = getValueSetSize(this.constraints);
        let forceSeparator = false;
        let valueSet = false;
        return this.constraints.reduce((acc,token,index)=>{
            let nexToken = this.constraints[index+1];
            let separator = getSeparatorIfNeeded(index,token,nexToken,this.triples.length,longest,this.constraints,this.emptyBrackets);

            if(token.type=='comment'){
            
                if(index==0){//If it's a comment before the constraints skip it
                    forceSeparator = true;
                }else{ //If not, add it to the finish of the line

                    //Only if the first token wasn't a comment. 
                    if(!forceSeparator) //Because it could be more after the first one 
                        acc.tripleComent+=token.string;
                }
                
            }else{
                if(forceSeparator)index--;
                if(nexToken && nexToken.string=='[' && valueSetSize>2){
                    separator = " ";
                }

                if(token.type=='valueSet' && valueSetSize>2){
                    valueSet = true;    
                    acc.str+='\n'+getIndent(indent);
                }

                let lower = token.string.toLowerCase();
                if( lower == 'and' || lower == 'or'){
                    acc.str+=' ';
                }

               
                acc.str+=token.string+separator;
                
                if(nexToken && nexToken.string==']' && valueSet){
                    acc.str+='\n'+getIndent(indent-1);
                }
            }
            return acc;
        },{
            str:'',
            tripleComent:''
        });
    }


    getTriplesString(indent,tripleComent,isTriple,isLastTriple){
        let str='';
        if(this.triples.length>0){
            let breakLine = "\n";
            if(isTriple && this.triples.length==1){
                if(tripleComent==''){// If there is any comment after '{' we need to force the breakline
                    breakLine = "";
                    indent--;
                }
            } 
            str+=this.getSubTriplesStr(indent,tripleComent,breakLine);  
        }

        str+= this.getEmptyBracketsIfNeeded();
        str+= this.getAfterTriplesStr();
        str+= this.getSemicolonIfNeeded(isTriple,isLastTriple,tripleComent);

        if(this.finalParenthesis)str+=')';
        return str;
    }


    getSubTriplesStr(indent,tripleComent,breakLine){
        let str='{'+tripleComent+breakLine;
        this.triples.map((t,index)=>{
            let currentLongest = getLongestTConstraint(this.triples);
            str+= getIndent(indent);
            str+= t.toString(currentLongest,true,indent+1,this.isLastTriple(index));
            str+=" "+t.comment +breakLine;
        })
        return str + getIndent(indent-1)+"}";
    }


    getAfterTriplesStr(){
        let str='';
        if(this.afterTriples.length>0)str+=' ';
        return this.afterTriples.reduce((acc,a)=>{
            return acc+=a.string+' ';
        },str);
    }

    getSemicolonIfNeeded(isTriple,isLastTriple,tripleComent){
        let str='';
        if(isTriple){
            if(!isLastTriple)str+=';';
            str+=tripleComent;
        }
        return str;
    }

    getEmptyBracketsIfNeeded(){
        if(this.emptyBrackets && this.triples.length<=0)return '{}';
        return '';
    }

    isLastTriple(index){
        return index==this.triples.length-1;
    }




}
module.exports = Node;