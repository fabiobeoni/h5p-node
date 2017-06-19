const fsx = require('fs-extra');
const path = require('path');
const dirCompare = require('dir-compare');
const uuidV4 = require('uuid/v4');

const TEMP_PATH = 'temp-res'; //must grant write permission to the web app process.
const PATH_PREFIX = 'h5p-';

/**
 * This class act as default storage
 * system for the web-app working
 * with the H5P Framework.
 * To be compliant with the first
 * implementation of the H5P Framework
 * (developed in PHP), this class
 * makes use of the OS file-system
 * to as data storage.
 *
 * https://h5ptechnology.atlassian.net/browse/HFP-1202
 */
class FileSystemDAL {

    /**
     * Check if the resource exists to
     * the given path.
     * @param pathToResource {string}
     * @returns {Promise.<boolean>} true if resource exists
     */
    async resourceExists(pathTo){
        pathTo = path.resolve(pathTo);
        return await fsx.pathExists(pathTo);
    };

    /**
     * Async and recursively deletes a tree, if any.
     * @param path {string}
     * @returns {Promise.<void>}
     * @php H5PCore deleteFileTree
     */
    async deepDelete(pathTo){
        pathTo = path.resolve(pathTo);
        if(await fsx.pathExists(pathTo))
            await fsx.remove(pathTo);
    };

    //TODO: must accept a parameter to define files to be excluded from the copy, see PHP copyFileTree()
    /**
     * Async and recursively copies a tree,
     * and makes sure the clone actually has
     * all contents of the original
     * and returns the result.
     * @param from {string}
     * @param to {string}
     * @returns {Promise.<boolean>} true when the copy
     * was fully completed
     * @php H5PDefaultStorage copyFileTree
     */
    async deepCopy(from, to){
        from = path.resolve(from);
        to = path.resolve(to);
        await fsx.copy(from,to);

        let result= await dirCompare.compare(from,to);
        return (result.differences===0);
    };

    /**
     * Makes sure you get the path
     * you need
     * @param pathNeeded {string}
     * @return {Promise.<*>}
     */
    async ensurePath(pathNeeded){
        return await fsx.ensureDir(pathNeeded);
    };

    /**
     * Gets the reference to a writable
     * temporary path where the app can
     * store data.
     * In this implementation the async
     * is not really needed but it is
     * declared in the super class signature
     * so let's keep it as is.
     * @param basePath
     * @return {Promise.<*>}
     */
    async getWritableTempPath(basePath) {
        return new Promise((resolve)=>{
             resolve(path.join(basePath,TEMP_PATH,PATH_PREFIX,uuidV4()));
        });
    }

}

module.exports = FileSystemDAL;