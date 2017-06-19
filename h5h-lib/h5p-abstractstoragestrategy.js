const MESSAGE = 'Missing implementation of method AbstractStorageStrategy.';

/**
 * This class defines an "interface"
 * to implement multiple storage
 * strategies.
 */
class AbstractStorageStrategy {
    /**
     * Async stores the h5p library folder
     * by selecting the library by the
     * provided versioning info.
     * @param libDef {LibraryDefinition}
     * @returns {Promise.<boolean>}
     */
    async saveLibrary(libDef){ throw MESSAGE+'saveLibrary().';};

    /**
     * Async gets the all library contents from the
     * by the given content.id and stores them under
     * the main content app storage path and content
     * ID.
     * @param sourcePath {string}: content source path
     * @param contentID {string}: id of the content to store
     * @returns {Promise.<boolean>}
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
     * Async and recursively deletes a tree, if any.
     * @param path {string}
     * @returns {Promise.<void>}
     * @php H5PCore deleteFileTree
     */
    async deepDelete(pathTo){ throw MESSAGE+'deepDelete().';};

    /**
     * Async and recursively copies a tree.
     * @param from {string}
     * @param to {string}
     * @returns {Promise.<void>}
     * @php H5PDefaultStorage copyFileTree
     */
    async deepCopy(from, to){ throw MESSAGE+'deepCopy().';};

    /**
     * Returns the path where h5p library
     * contents are stored, based on the
     * content ID.
     * @param contentID {string}
     */
    static getContentPath(contentID){
        throw MESSAGE+'getContentPath().';
    };
}

module.exports = AbstractStorageStrategy;