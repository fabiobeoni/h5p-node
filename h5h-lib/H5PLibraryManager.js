const H5PAbstractLibraryStorageStrategy= require('./H5PAbstractLibraryStorageStrategy');


const MESSAGE_WRONG_CLASS = 'The provided class is doesn\'t extend the required H5PAbstractLibraryStorageStrategy.';


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
class H5PLibraryManager {

    /**
     * Initializes the client and make
     * it working with the preferred
     * storage strategy.
     * @param storageStrategy {H5PAbstractLibraryStorageStrategy}
     */
    constructor(storageStrategy){
        /**
         * Storage in use
         * @type {H5PAbstractLibraryStorageStrategy}
         * @private
         */
        this._storageStrat = null;
        this.setStorage(storageStrategy);
    }

    /**
     * Instruct the client what strategy
     * your webapp will use to store objects.
     * @param storageStrategy {H5PAbstractLibraryStorageStrategy}
     */
    setStorage(storageStrategy){
        if(!(Object.getPrototypeOf(storageStrategy) instanceof H5PAbstractLibraryStorageStrategy))
            throw MESSAGE_WRONG_CLASS;

        this._storageStrat = storageStrategy;
    }

    /**
     * Get storage in use.
     * @return {H5PAbstractLibraryStorageStrategy}
     */
    getStorage(){
        return this._storageStrat;
    }

}

module.exports = H5PLibraryManager;