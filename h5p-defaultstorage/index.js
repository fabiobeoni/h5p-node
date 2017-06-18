const fsx = require('fs-extra');
const path = require('path');
const dirCompare = require('dir-compare');


const LIBRARIES_PATH = 'libraries';
const CONTENT_PATH = 'content';

/**
 * This class act as default storage
 * system for the web-app working
 * with the H5P Framework.
 * To be compliant with the first
 * implementation of the H5P Framework
 * (developed in PHP), this class
 * makes use of the OS file-system
 * to as data storage.
 * By the way, the class also acts
 * as a "contract definition", so future
 * implementations of a data layer, based
 * on different data storage (eg. cloud
 * storage), will implement methods with
 * the same signatures as this class does.
 *
 * https://h5ptechnology.atlassian.net/browse/HFP-1202
 */
class Storage {

    /**
     * Initializes the Storage
     * @param basePath {string}: defines the base path to work with where h5p libraries, it is a sub-path of the app root.
     */
    constructor(basePath){
        this._basePath = basePath;
    }

    /**
     * Async stores the h5p library folder
     * by selecting the library by the
     * provided versioning info.
     * @param libDef {LibraryDefinition}
     * @returns {Promise.<boolean>}
     */
    async saveLibrary(libDef) {

        let libraryUploadedInTemp = path.join(libDef.uploadDirectory,libDef.asString(true));
        let libraryDestPath = path.join(this._basePath,LIBRARIES_PATH,libDef.asString(true));

        // Make sure destination dir doesn't exist
        await this.deepDelete(libraryDestPath);

        // Move library folder
        await this.deepCopy(libraryUploadedInTemp, libraryDestPath);

        let result = await dirCompare.compare(libraryUploadedInTemp,libraryDestPath);

        return (result.differences===0);
    };

    //TODO: looks like the "content" folder of a h5p library gets stored in a different path in the server. Ask to Joubel
    /**
     * Async gets the all library contents from the
     * by the given content.id and stores them under
     * the main content app storage path and content
     * ID.
     * @param sourcePath {string}: content source path
     * @param content {object}: content properties
     * @returns {Promise.<boolean>}
     */
    async saveContent(sourcePath,content){
        let destPath = path.join(this._basePath,CONTENT_PATH,content['id'].toString());

        // Make sure destination dir doesn't exist
        await this.deepDelete(destPath);

        // Move library folder
        await this.deepCopy(sourcePath, destPath);

        let files = await fsx.readdir(destPath);

        return (files.length>0);
    }

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

    /**
     * Async and recursively copies a tree.
     * @param from {string}
     * @param to {string}
     * @returns {Promise.<void>}
     * @php H5PDefaultStorage copyFileTree
     */
    async deepCopy(from, to){
        from = path.resolve(from);
        to = path.resolve(to);
        await fsx.copy(from,to);
    };

}

module.exports = Storage;