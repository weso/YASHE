let {getSeparatorIfNeeded,getLongestTConstraint} = require('./printUtils.js')

class Node{

    constructor(constraints,triples,comment='',emptyBrackets,afterTriples=[]){
        this.constraints = constraints;
        this.triples = triples;
        this.comment = comment;
        this.emptyBrackets = emptyBrackets; //ej: schema:name    {};
        this.afterTriples= afterTriples;
    }

    toString(longest,isTriple,indent=1,isLastTriple='false'){
        let str = "";
        let tripleComent = "";
        let forceSeparator = false;
        this.constraints.map((token,index)=>{
            if(token.type=='comment'){
            
                if(index==0){//If it's a comment before the constraints skip it
                    forceSeparator = true;
                }else{ //If not, add it to the finish of the line

                    //Only if the first token wasn't a comment. 
                    if(!forceSeparator) //Because it could be more after the first one 
                        tripleComent+=token.string;
                }
                
            }else{
                if(forceSeparator)index--;
                let nexToken = this.constraints[index+1];
                str+=token.string+getSeparatorIfNeeded(index,token,nexToken,longest,this.constraints);
            }
        });

        

        if(this.triples.length>0){
            let breakLine = "\n";
            if(isTriple && this.triples.length==1)breakLine = "";
            str+='{ '+tripleComent+breakLine;
            this.triples.map((t,index)=>{
                let currentLongest = getLongestTConstraint(this.triples);
                let isLastTriple = false;
                if(index==this.triples.length-1)isLastTriple = true;
                str+=this.getIndent(indent)+t.toString(currentLongest,true,indent+1,isLastTriple);
                str+=" "+t.comment +breakLine;
            })

            str+=this.getIndent(indent-1)+"}";
            if(this.afterTriples.length>0)str+=" ";
            this.afterTriples.map(a=>{
                str+=a.string+" ";
            })
            if(isTriple && !isLastTriple)str+=";";
        }else{

            if(this.emptyBrackets)str+='{}';
           
            if(isTriple){
                if(!isLastTriple)str+=';';
                str+=tripleComent;
            }
        }

        
        
        return str;
    }


    getIndent(tab) {
        let indent = "";
        for(let i=0;i<tab;i++){
            indent+="  ";
        }
        return indent;
    }


}
module.exports = Node;