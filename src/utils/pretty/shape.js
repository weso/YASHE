class Shape{

    constructor(nodes,comments=[]){
        this.nodes = nodes;
        this.comments = comments;
    }

    getCommentsStr(){
        return this.comments.reduce((acc,c)=>{
            return acc+="\n"+c.string;
        },"");
    }

    toString(){
        return this.nodes.reduce((acc,n)=>{
            return acc+=n.toString(0) + this.getCommentsStr();
        },"");
    }
}

module.exports = Shape;