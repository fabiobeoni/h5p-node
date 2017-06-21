const MESSAGE = 'Missing implementation of method AbstractLibraryStorageStrategy.';

/**
 * This class defines an "interface"
 * to implement multiple storage
 * strategies.
 */
class AbstractLibraryStorageStrategy {

    /**
     * Returns the path where h5p library
     * contents are stored, based on the
     * content ID.
     * @param contentID {string}
     */
    getContentPath(contentID){
        throw MESSAGE+'getContentPath().';
    };

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
    async saveLibrary(libDef){ throw MESSAGE+'saveLibrary().';};

    /**
     * Async gets the all library contents from the
     * by the given content.id and stores them under
     * the main content app storage path and content
     * ID.
     * @param sourcePath {string}: content source path
     * @param contentID {string}: id of the content to store
     * @returns {Promise.<boolean>} true when all path and childs are saved
     */
    async saveContent(sourcePath,contentID){ throw MESSAGE+'saveContent().';};

    /**
     * Async removes all library contents
     * at the given location by content ID.
     * @param contentID {string}: content to be deleted
     * @returns {Promise.<void>}
     */
    async deleteContent(contentID){ throw MESSAGE+'deleteContent().';};

    /**
     * Async clones the given content
     * and assigns the new ID to the
     * cloned one.
     * @param contentID {string}
     * @param newContentID {string}
     * @returns {Promise.<boolean>} true when content is fully cloned
     */
    async cloneContent(contentID,newContentID){throw MESSAGE+'cloneContent().';};

    /**
     * Fetch content from the given path and
     * copies it in target directory ready for
     * exporting. When content is not available
     * simply creates an empty content path
     * under the export path.
     * @param contentID {string} unique ID of the content to be exported
     * @param targetPath {string} path where the content will be copied for export
     * @returns {Promise.<boolean>} true when all content is exported
     * or an empty path for it is available
     */
    async exportContent(contentID,targetPath){throw MESSAGE+'exportContent().';};

    /**
     * Fetch library folder and save in target directory.
     * @param libDef {LibraryDefinition} lib to be exported
     * @param targetPath {string} path where to export the library
     * @param [devPath] {string} replacement path where the lib resides (dev only)
     * @returns {Promise.<boolean>}
     */
    async exportLibrary(libDef,targetPath,devPath){throw MESSAGE+'exportLibrary().';}

    /**
     * Exports a file (typically .h5p zipped file)
     * to the app export directory.
     * @param sourceExportName {string} this is the equivalent of a short file name (without path)
     * @param outputExportName {string} this is the equivalent of a short file name (without path)
     * @return {Promise.<boolean>}
     */
    async saveExport(sourceExportName,outputExportName){throw MESSAGE+'saveExport().';}

    /**
     * Deletes the given export file
     * from the app exports path.
     * @param exportName {string} this is the equivalent of a short file name (without path)
     * @return {Promise.<void>}
     */
    async deleteExport(exportName){throw MESSAGE+'deleteExport().';}

    /**
     * Returns true if a export file with
     * given name exists in the app exports
     * path.
     * @param exportName {string} this is the equivalent of a short file name (without path)
     * @return {Promise.<boolean>}
     */
    async exportExists(exportName){throw MESSAGE+'exportExists().';};

    /**
     * Concatenates all JavaScrips and Stylesheets into two files in order
     * to improve page load performance.
     * @param files {string[]} a set of all the assets required for content to display
     * @param key {string} hashed key for the cached asset
     * @return {Promise.<void>}
     */
    async cacheAssets(files,key){throw MESSAGE+'cacheAssets()';}

    /**
     * Checks if there are cache assets available for content
     * and returns them if any. Typical output:
     * @param key {string}
     * @return {Promise.<object>} object or null.
     *
     * <pre><code>
     * {
     *  scripts:[{
     *      path:'path/to/JS/file/based/on/KEY',
     *      version:''
     *  }],
     *  styles:[{
     *      path:'path/to/CSS/file/based/on/KEY',
     *      version:''
     *  }]
     * }
     * </code></pre>
     */
    async getCachedAssets(key){throw MESSAGE+'getCachedAssets()';}

    /**
     * Returns a temp dir with unique name.
     * Not sure that is really needed in
     * nodejs.
     * //TODO: later when you have more knowledge of the h5p framework check this
     * @php H5PDefaultStorage.getTmpPath()
     * @return {Promise.<string>}
     */
    async getWritableTempPath(){throw MESSAGE+'getWritableTempPath().';}

    /**
     * Gets the path of the given library
     * relative to the general libraries
     * store in the web app.
     * @param libDef {LibraryDefinition}
     * @return {string}
     */
    getLibraryPath(libDef) {throw MESSAGE+'getLibraryPath().';}

}

module.exports = AbstractLibraryStorageStrategy;