class H5PEditorFile {

    constructor(){
        this.name = '';
        this.type = '';
        this.data = '';
    }

    getName(){
        //TODO: missing implentation, see PHP code
        return this.name;
    }

    getType(){
        return this.type;
    }

    getData(){
        return this.data || null;
    }
}

module.exports = H5PEditorFile;