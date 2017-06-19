const fsx = require('fs-extra');
const path = require('path');
const dirCompare = require('dir-compare');

const AbstractStorageStrategy = require('./h5p-abstractstoragestrategy');

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
 *
 * https://h5ptechnology.atlassian.net/browse/HFP-1202
 */
class FSStorageStrategy extends AbstractStorageStrategy {

    /**
     * Initializes the FSStorageStrategy
     * @param opts.basePath {string}: defines the base path to work with where h5p libraries, it is a sub-path of the app root.
     */
    constructor(opts){
        super();
        this._basePath = opts.basePath;
    }

    /**
     * Returns the path where h5p library
     * contents are stored, based on the
     * content ID.
     * @param contentID {string}
     */
    static getContentPath(contentID) {
        return path.join(this._basePath, CONTENT_PATH, contentID);
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
     * @param contentID {string}: id of the content to store
     * @returns {Promise.<boolean>}
     */
    async saveContent(sourcePath,contentID){
        let destPath = FSStorageStrategy.getContentPath(contentID);

        // Make sure destination dir doesn't exist
        await this.deepDelete(destPath);

        // Move library folder
        await this.deepCopy(sourcePath, destPath);

        let files = await fsx.readdir(destPath);

        return (files.length>0);
    }

    /**
     * Async removes all library contents
     * at the given location by content ID.
     * @param contentID {string}: content to be deleted
     * @returns {Promise.<void>}
     */
    async deleteContent(contentID){
        await this.deepDelete(FSStorageStrategy.getContentPath(contentID));
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

module.exports = FSStorageStrategy;