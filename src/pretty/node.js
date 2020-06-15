class Node{

    constructor(constraints,triples,comment=''){
        this.constraints = constraints;
        this.triples = triples;
        this.comment = comment;
    }

    toString(){
        let str = "";
        this.constraints.map(c=>{
            str+=" "+c.string;
        });
        if(this.triples.length>0){
            str+=" {\n"
            this.triples.map(t=>{
                str+=" "+t.toString();
            })
            str+=" }";
        }else{
            str+="; ";
        }   
        
        str+=this.comment +"\n";

        return str;
    }

}
module.exports = Node;