
class Prefix {

    constructor(prefixName='',prefixValue='http://example.org/',comment=''){
        this.prefixName = prefixName;
        this.prefixValue = prefixValue;
        this.comment = comment;
    }


    toString(separator){
        return 'PREFIX '+this.prefixName+separator+this.prefixValue+this.comment+'\n';
    }

}


module.exports =  Prefix;