class Shape{

    constructor(nodes,comments=[],directivesAndStarts){
        this.nodes = nodes;
        this.comments = comments;
        this.directivesAndStarts = directivesAndStarts;
        console.log(this.directivesAndStarts)
    }

    getCommentsStr(){
        return this.comments.reduce((acc,c)=>{
            return acc+="\n"+c.string;
        },"");
    }

    getDirectivesAndStartsStr(){
        return '\n\n'+this.directivesAndStarts
    }

    toString(){
        return this.nodes.reduce((acc,n)=>{
            return acc+=n.toString(0) + this.getCommentsStr() + this.getDirectivesAndStartsStr();
        },"");
    }
}

module.exports = Shape;