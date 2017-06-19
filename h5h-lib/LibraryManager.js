const AbstractLibraryManagementStrategy = require('./AbstractLibraryManagementStrategy');


const MESSAGE_WRONG_CLASS = 'The provided class is doesn\'t extend the required AbstractLibraryManagementStrategy.';


/**
 * This class provides an API to interact
 * with different types of library management strategies
 * (eg.: OS file-system, cloud storage, others)
 * by a shared interface with common methods.
 * It also allows to change
 * from one strategy to another, to allow manage
 * of different resources on different kind of
 * storage (eg.: configurations on a db, images
 * on cloud storage).
 */
class LibraryManager {

    /**
     * Initializes the client and make
     * it working with the preferred
     * storage strategy.
     * @param storageStrategy {AbstractLibraryManagementStrategy}
     */
    constructor(storageStrategy){
        this.setStrategy(storageStrategy);
    }

    /**
     * Instruct the client what strategy
     * your webapp will use to store objects.
     * @param storageStrategy {AbstractLibraryManagementStrategy}
     */
    setStrategy(storageStrategy){
        if(!(Object.getPrototypeOf(storageStrategy) instanceof AbstractLibraryManagementStrategy))
            throw MESSAGE_WRONG_CLASS;

        this.storageStrat = storageStrategy;
    }



    //TODO: update method signatures

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

module.exports = LibraryManager;