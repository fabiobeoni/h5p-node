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
     * Gets the path of the given library
     * relative to the general libraries
     * store in the web app.
     * @param libDef {LibraryDefinition}
     * @return {string}
     */
    getLibraryPath(libDef) {throw MESSAGE+'getLibraryPath().';}

}

module.exports = AbstractLibraryStorageStrategy;