let {getSeparatorIfNeeded,getLongestTConstraint} = require('./printUtils.js')

class Node{

    constructor(constraints,triples,comment='',firstComment=''){
        this.constraints = constraints;
        this.triples = triples;
        this.comment = comment;
        this.firstComment = firstComment;
    }

    toString(longest){
        let str = this.firstComment;
        let triplesStart = "{ ";
        this.constraints.map((token,index)=>{

            if(token.type=='comment'){
                triplesStart+=token.string;
            }else{
                let nexToken = this.constraints[index+1];
                str+=token.string+getSeparatorIfNeeded(index,token,nexToken,longest);;
            }
        });
        if(this.triples.length>0){
            str+=triplesStart+="\n";
            this.triples.map(t=>{
                let currentLongest = getLongestTConstraint(this.triples);
                str+="  "+t.toString(currentLongest)+ ";";
                str+=" "+t.comment +"\n";
            })
            str+="} ";
        } 
        return str;
    }




}
module.exports = Node;