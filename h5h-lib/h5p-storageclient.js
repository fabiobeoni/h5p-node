const AbstractStorageStrategy = require('./h5p-abstractstoragestrategy');


const MESSAGE_WRONG_CLASS = 'The provided class is doesn\'t extend the required AbstractStorageStrategy.';


/**
 * This class provides an API to interact
 * with different types of storage strategies
 * (eg.: OS file-system, cloud storage, others)
 * by a shared interface with common methods.
 * The Storage Client also allows to change
 * from one strategy to another, to allow storage
 * of different resources on different kind of
 * storage (eg.: configurations on a db, images
 * on cloud storage).
 */
class StorageClient {

    /**
     * Initializes the client and make
     * it working with the preferred
     * storage strategy.
     * @param storageStrategy {AbstractStorageStrategy}
     */
    constructor(storageStrategy){
        this.setStrategy(storageStrategy);
    }

    /**
     * Instruct the client what strategy
     * your webapp will use to store objects.
     * @param storageStrategy {AbstractStorageStrategy}
     */
    setStrategy(storageStrategy){
        if(!(Object.getPrototypeOf(storageStrategy) instanceof AbstractStorageStrategy))
            throw MESSAGE_WRONG_CLASS;

        this.storageStrat = storageStrategy;
    }


    static getContentPath(contentID) {
        return this.storageStrat.getContentPath(contentID);
    }

    async saveLibrary(libDef) {
        return await this.storageStrat.saveLibrary(libDef);
    };

    async saveContent(sourcePath,contentID){
        return await this.storageStrat.saveContent(sourcePath,contentID);
    }

    async deleteContent(contentID){
        await this.storageStrat.deleteContent(contentID);
    }

    async deepDelete(pathTo){
        await this.storageStrat.deepDelete(pathTo);
    };

    async deepCopy(from, to){
        await this.storageStrat.deepCopy(from,to);
    };

}

module.exports = StorageClient;