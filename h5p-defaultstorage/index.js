const fsx = require('fs-extra');
const path = require('path');
const dirCompare = require('dir-compare');


const LIBRARIES_PATH = 'libraries';
const CONTENT_PATH = 'content';

class Storage {

    constructor(basePath){
        this._basePath = basePath;
    }

    /**
     * Async stores the library folder.
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

    /**
     * Get the all contents from the
     * given resource path (and child nodes)
     * by the  given content.id.
     * @param sourcePath {string}: content source path
     * @param content {object}: content properties //TODO: what's that?
     * @returns {Promise.<boolean>}
     */
    async saveContent(sourcePath,content){
        let destPath = path.join(this._basePath,CONTENT_PATH,content['id'].toString());

        // Make sure destination dir doesn't exist
        await this.deepDelete(contentPath);

        // Move library folder
        await this.deepCopy(sourcePath, destPath);

        let files = await fsx.readdir(destPath);

        return (files.length>0);
    }

    /**
     * Recursively deletes a tree, if any.
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
     * Recursively copies a tree.
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