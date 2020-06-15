class Node{

    constructor(constraints,triples,comment=''){
        this.constraints = constraints;
        this.triples = triples;
        this.comment = comment;
    }

    toString(){
        let str = "";
        let space = "";
        this.constraints.map((c,index)=>{
            if(index!=0)space=" ";
            str+=space+c.string;
        });
        if(this.triples.length>0){
            str+=" {\n"
            this.triples.map(t=>{
                str+="  "+t.toString()+ ";";
                str+=" "+t.comment +"\n";
            })
            str+="} ";
        } 
        return str;
    }

}
module.exports = Node;