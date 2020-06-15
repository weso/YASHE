let {getSeparator} = require('./printUtils.js')

class Node{

    constructor(constraints,triples,comment=''){
        this.constraints = constraints;
        this.triples = triples;
        this.comment = comment;
    }

    toString(previous){
        let longest = 0;
        this.triples.map(t=>{   
            let token = t.constraints[0];
            if(token.type=='string-2'){
                if(token.string.length>longest){
                    longest = token.string.length;
                }
            }
        })

        let str = "";
        let separator = "";
        this.constraints.map((c,index)=>{
            let actual = c.string.length;
            let diference = previous - actual;
            if(index==0){
                separator=getSeparator(diference);
            }else{
                separator = " ";
            }
            str+=c.string+separator;
        });
        if(this.triples.length>0){
            str+=" {\n"
            this.triples.map(t=>{
                str+="  "+t.toString(longest)+ ";";
                str+=" "+t.comment +"\n";
            })
            str+="} ";
        } 
        return str;
    }

}
module.exports = Node;