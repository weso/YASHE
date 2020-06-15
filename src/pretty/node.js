let {getSeparatorIfNeeded,getLongestTConstraint} = require('./printUtils.js')

class Node{

    constructor(constraints,triples,comment=''){
        this.constraints = constraints;
        this.triples = triples;
        this.comment = comment;
    }

    toString(longest){
        let str = "";
        this.constraints.map((token,index)=>{
            let nexToken = this.constraints[index+1];
            str+=token.string+getSeparatorIfNeeded(index,token,nexToken,longest);;
        });
        if(this.triples.length>0){
            str+="{\n"
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