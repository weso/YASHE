class Shape{

    constructor(nodes,comments=[],directivesAndStarts){
        this.nodes = nodes;
        this.comments = comments;
        this.directivesAndStarts = directivesAndStarts;
    }

    getCommentsStr(){
        return this.comments.reduce((acc,c)=>{
            return acc+="\n"+c.string;
        },"");
    }

    getDirectivesAndStartsStr(){
        let str = '';
        if(this.directivesAndStarts.trim()!='')
            str = '\n\n'+this.directivesAndStarts;
        return str;
    }

    toString(){
        return this.nodes.reduce((acc,n)=>{
            return acc+=n.toString(0) + this.getCommentsStr() + this.getDirectivesAndStartsStr();
        },"");
    }
}

module.exports = Shape;