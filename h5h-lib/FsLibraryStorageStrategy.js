const path = require('path');

const AbstractLibraryStorageStrategy = require('./AbstractLibraryStorageStrategy');
const FileSystemDAL = require('./FileSystemDAL');

const LIBRARIES_PATH = 'libraries'; //must grant write permission to the web app process.
const CONTENT_PATH = 'content'; //must grant write permission to the web app process.


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
class FsLibraryStorageStrategy extends AbstractLibraryStorageStrategy {

    /**
     * Initializes the FsLibraryStorageStrategy
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
    getContentPath(contentID) {
        return path.join(this._basePath, CONTENT_PATH, contentID);
    }

    /**
     * Gets the path of the given library
     * relative to the general libraries
     * store in the web app.
     * @param libDef {LibraryDefinition}
     * @return {string}
     */
    getLibraryPath(libDef) {
        return path.join(this._basePath, LIBRARIES_PATH, libDef.asString(true));
    }

    /**
     * Async stores the h5p library folder
     * by selecting the library by the
     * provided versioning info.
     * @param libDef {LibraryDefinition}
     * @returns {Promise.<boolean>}
     * true when there are not differences
     * from original library and the saved
     * one in the new location
     */
    async saveLibrary(libDef) {

        let libraryUploadedInTemp = path.join(libDef.uploadDirectory,libDef.asString(true));
        let libraryDestPath = this.getLibraryPath(libDef);

        // Make sure destination dir doesn't exist
        await FileSystemDAL.deepDelete(libraryDestPath);

        // Move library folder
        return await FileSystemDAL.deepCopy(libraryUploadedInTemp, libraryDestPath,true);
    };

    /**
     * Fetch library from the given path and
     * copies it in target path ready for exporting.
     *
     * @param libDef {LibraryDefinition} lib to be exported
     * @param targetPath {string} path where to export the library
     * (must not include the lib name, will be added).
     * @param [devPath] {string} replacement path where the lib resides (dev only)
     * @returns {Promise.<boolean>} true when the full copy is done
     */
    async exportLibrary(libDef,targetPath,devPath){
        let libraryPath = devPath || this.getLibraryPath(libDef);

        //puts the library name into the name of the target
        targetPath = path.join(targetPath, libDef.asString(true));

        return await FileSystemDAL.deepCopy(libraryPath,targetPath,true);
    }

    //TODO: check https://h5ptechnology.slack.com/archives/C36BURHFH/p1497872148219359
    /**
     * Async gets the all library contents from the
     * by the given content.id and stores them under
     * the main content app storage path and content
     * ID.
     * @param sourcePath {string}: content source path
     * @param contentID {string}: id of the content to store
     * @returns {Promise.<boolean>} true when all path and childs are saved
     */
    async saveContent(sourcePath,contentID){
        let destPath = FsLibraryStorageStrategy.getContentPath(contentID);

        // Make sure destination dir doesn't exist
        await FileSystemDAL.deepDelete(destPath);

        // Move library folder
        return await FileSystemDAL.deepCopy(sourcePath, destPath,true);
    }

    /**
     * Async removes all library contents
     * at the given location by content ID.
     * @param contentID {string}: content to be deleted
     * @returns {Promise.<void>}
     */
    async deleteContent(contentID){
        await FileSystemDAL.deepDelete(FsLibraryStorageStrategy.getContentPath(contentID));
    }

    /**
     * Async clones the given content
     * and assigns the new ID to the
     * cloned one.
     * @param contentID {string}
     * @param newContentID {string}
     * @returns {Promise.<boolean>} true when content is fully cloned
     */
    async cloneContent(contentID, newContentID) {
        let originalContentPath = FsLibraryStorageStrategy.getContentPath(contentID);
        let clonedContentPath = FsLibraryStorageStrategy.getContentPath(newContentID);

        //makes sure the clone actually has all contents of the original
        //and returns the result
        return await FileSystemDAL.deepCopy(originalContentPath,clonedContentPath,true);
    }

    /**
     * Fetch content from the given path and
     * copies it in target path ready for
     * exporting. When content is not available
     * simply creates an empty content path
     * under the export path.
     *
     * @param contentID {string} unique ID of the content to be exported
     * @param targetPath {string} path where the content will be copied for export
     * @returns {Promise.<boolean>} true when all content is exported
     * or an empty path for it is available
     */
    async exportContent(contentID,targetPath){
        let contentPath = FsLibraryStorageStrategy.getContentPath(contentID);
        if(await FileSystemDAL.resourceExists(contentPath))
            return await FileSystemDAL.deepCopy(contentPath,targetPath,true);
        else{
            await FileSystemDAL.ensurePath(targetPath);
            return true;
        }
    };

}

module.exports = FsLibraryStorageStrategy;