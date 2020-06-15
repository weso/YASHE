class Shape{

    constructor(nodes){
        this.nodes = nodes;
    }

    toString(){
        return this.nodes.reduce((acc,n)=>{
            return acc+=n.toString(0);
        },"");
    }
}

module.exports = Shape;