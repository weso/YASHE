let {getSeparatorIfNeeded,getLongestTConstraint} = require('./printUtils.js')

class Node{

    constructor(constraints,triples,comment='',emptyBrackets){
        this.constraints = constraints;
        this.triples = triples;
        this.comment = comment;
        this.emptyBrackets = emptyBrackets; //ej: schema:name    {};
    }

    toString(longest,isTriple){
        let str = "";
        let tripleComent = "";
        let forceSeparator = false;
        this.constraints.map((token,index)=>{
            if(token.type=='comment'){
            
                if(index==0){//If it's a comment before the constraints skip it
                    forceSeparator = true;
                }else{ //If not, add it to the finish of the line
                    tripleComent+=token.string;
                }
                
            }else{
                if(forceSeparator)index--;
                let nexToken = this.constraints[index+1];
                str+=token.string+getSeparatorIfNeeded(index,token,nexToken,longest);;
            }
        });

        if(this.emptyBrackets)str+='{}';

        if(this.triples.length>0){
            str+='{ '+tripleComent+"\n";
            this.triples.map(t=>{
                let currentLongest = getLongestTConstraint(this.triples);
                str+="  "+t.toString(currentLongest,true);
                str+=" "+t.comment +"\n";
            })
            str+="}";
        }else{
           
            if(isTriple)str+="; "+tripleComent;
        }

        
        
        return str;
    }




}
module.exports = Node;