let {getSeparatorIfNeeded,getLongestTConstraint} = require('./printUtils.js')

class Node{

    constructor(constraints,triples,comment='',emptyBrackets,afterConstraints=[]){
        this.constraints = constraints;
        this.triples = triples;
        this.comment = comment;
        this.emptyBrackets = emptyBrackets; //ej: schema:name    {};
        this.afterConstraints= afterConstraints;
    }

    toString(longest,isTriple,indent=1){
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
                str+=token.string+getSeparatorIfNeeded(index,token,nexToken,longest);;
            }
        });

        

        if(this.triples.length>0){
            let breakLine = "\n";
            if(isTriple && this.triples.length==1)breakLine = "";
            str+='{ '+tripleComent+breakLine;
            this.triples.map(t=>{
                let currentLongest = getLongestTConstraint(this.triples);
                str+=this.getIndent(indent)+t.toString(currentLongest,true,indent+1);
                str+=" "+t.comment +breakLine;
            })

            str+=this.getIndent(indent-1)+"}";
            if(this.afterConstraints.length>0)str+=" ";
            this.afterConstraints.map(a=>{
                str+=a.string+" ";
            })
            if(isTriple)str+=";";
        }else{

            if(this.emptyBrackets)str+='{}';
           
            if(isTriple)str+="; "+tripleComent;
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