
class Prefix {

    constructor(prefixName='',prefixValue='http://example.org/'){
        this.prefixName = prefixName;
        this.prefixValue = prefixValue;
    }


    getPrefixName(){
        return this.prefixName;
    }

    getPrefixValue(){
        return this.prefixValue;
    }

}


module.exports =  Prefix;