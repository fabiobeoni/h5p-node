class StorageWrapper {

    constructor(storage){
        this.storage = storage;
    }

    static getContentPath(contentID) {
        return this.storage.getContentPath(contentID);
    }

    async saveLibrary(libDef) {
        return await this.storage.saveLibrary(libDef);
    };

    async saveContent(sourcePath,contentID){
        return await this.storage.saveContent(sourcePath,contentID);
    }

    async deleteCotent(contentID){
        await this.storage.deleteCotent(contentID);
    }

    async deepDelete(pathTo){
        await this.storage.deepDelete(pathTo);
    };

    async deepCopy(from, to){
        await this.storage.deepCopy(from,to);
    };

}

module.exports = StorageWrapper;