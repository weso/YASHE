class Node{

    constructor(constraints,triples){
        this.constraints = constraints;
        this.triples = triples;
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
            str+=";\n";
        }   
        
        return str;
    }

}
module.exports = Node;