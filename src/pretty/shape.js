class Shape{

    constructor(nodes){
        this.nodes = nodes;
    }

    toString(){
        this.nodes.map(n=>{
            str+=n.toString();
        })
        return str;
    }
}

module.exports = Shape;