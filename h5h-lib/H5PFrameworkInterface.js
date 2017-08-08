const NAME = 'H5PframeworkInterface';
const MSG = ': missing implementation.';

class H5PFrameworkInterface {

    /**
     * Returns info for the current platform.
     *
     * @return {object}
     *   - name {string}: The name of the platform, for instance "Wordpress"
     *   - version {string}: The version of the platform, for instance "4.0"
     *   - h5pVersion {string}: The version of the H5P plugin/module
     */
    getPlatformInfo(){ throw `${NAME}.getPlatformInfo()${MSG}`};

    /**
     * Fetches a file from a remote server using HTTP GET
     *
     * @param url {string} where you want to get or send data.
     * @param data {object} data to post to the URL. Can be null.
     * @param blocking {boolean} Set to 'false' to instantly time out (fire and forget), default is 'true'.
     * @param stream {string} Path to where the file should be saved. Can be null.
     * @return {string} The content (response body). NULL if something went wrong
     */
    fetchExternalData(url, data, blocking, stream){throw `${NAME}.fetchExternalData()${MSG}`};

    /**
     * Set the tutorial URL for a library. All versions of the library is set
     *
     * @param machineName {string}
     * @param tutorialUrl {string}
     */
    setLibraryTutorialUrl(machineName, tutorialUrl){ throw `${NAME}.setLibraryTutorialUrl()${MSG}`};

    /**
     * Show the user an error message
     *
     * @param message {string}
     */
    setErrorMessage(message){ throw `${NAME}.setErrorMessage()${MSG}`};

    /**
     * Show the user an information message
     *
     * @param message {string}
     */
    setInfoMessage(message){ throw `${NAME}.setInfoMessage()${MSG}`};

    /**
     * Translation function
     *
     * @param message {string}
     *  The english string to be translated.
     * @param replacements {object}
     *   An associative array of replacements to make after translation. Incidences
     *   of any key in this array are replaced with the corresponding value. Based
     *   on the first character of the key, the value is escaped and/or themed:
     *    - !variable: inserted as is
     *    - @variable: escape plain text to HTML
     *    - %variable: escape text and theme as a placeholder for user-submitted
     *      content
     * @return {string} Translated string
     */
    t(message, replacements){ throw `${NAME}.t()${MSG}`};

    /**
     * Get URL to file in the specific library
     * @param libraryFolderName {string}
     * @param fileName {string}
     * @return {string} URL to file
     */
    getLibraryFileUrl(libraryFolderName, fileName){ throw `${NAME}.getLibraryFileUrl()${MSG}`}

    /**
     * Get the Path to the last uploaded h5p
     *
     * @return {string}
     *   Path to the folder where the last uploaded h5p for this session is located.
     */
     getUploadedH5pFolderPath(){ throw `${NAME}.getUploadedH5pFolderPath()${MSG}`};

    /**
     * Get the path to the last uploaded h5p file
     *
     * @return {string}
     *   Path to the last uploaded h5p
     */
    getUploadedH5pPath(){ throw `${NAME}.getUploadedH5pPath()${MSG}`};

    /**
     * Get a list of the current installed libraries
     *
     * @return {object}
     *   Associative array containing one entry per machine name.
     *   For each machineName there is a list of libraries(with different versions)
     */
    loadLibraries(){ throw `${NAME}.loadLibraries()${MSG}`};

    /**
     * Returns the URL to the library admin page
     *
     * @return {string}
     *   URL to admin page
     */
    getAdminUrl(){ throw `${NAME}.getAdminUrl()${MSG}`};

    /**
     * Get id to an existing library.
     * If version number is not specified, the newest version will be returned.
     *
     * @param {string} machineName
     *   The librarys machine name
     * @param {number} majorVersion
     *   Optional major version number for library
     * @param {number} minorVersion
     *   Optional minor version number for library
     * @return {number}
     *   The id of the specified library or FALSE
     */
    getLibraryId(machineName, majorVersion = 0, minorVersion = 0){ throw `${NAME}.getLibraryId()${MSG}`};

    /**
     * Get file extension whitelist
     *
     * The default extension list is part of h5p, but admins should be allowed to modify it
     *
     * @param {boolean} isLibrary
     *   TRUE if this is the whitelist for a library. FALSE if it is the whitelist
     *   for the content folder we are getting
     * @param {string} defaultContentWhitelist
     *   A string of file extensions separated by whitespace
     * @param {string} defaultLibraryWhitelist
     *   A string of file extensions separated by whitespace
     */
    getWhitelist(isLibrary, defaultContentWhitelist, defaultLibraryWhitelist){ throw `${NAME}.getWhitelist()${MSG}`};

    /**
     * Is the library a patched version of an existing library?
     *
     * @param {object} library
     *   An associative array containing:
     *   - machineName: The library machineName
     *   - majorVersion: The librarys majorVersion
     *   - minorVersion: The librarys minorVersion
     *   - patchVersion: The librarys patchVersion
     * @return {boolean}
     *   TRUE if the library is a patched version of an existing library
     *   FALSE otherwise
     */
    isPatchedLibrary(library){ throw `${NAME}.isPatchedLibrary()${MSG}`};

    /**
     * Is H5P in development mode?
     *
     * @return {boolean}
     *  TRUE if H5P development mode is active
     *  FALSE otherwise
     */
    isInDevMode(){ throw `${NAME}.isInDevMode()${MSG}`};

    /**
     * Is the current user allowed to update libraries?
     *
     * @return {boolean}
     *  TRUE if the user is allowed to update libraries
     *  FALSE if the user is not allowed to update libraries
     */
    mayUpdateLibraries(){ throw `${NAME}.mayUpdateLibraries()${MSG}`};

    /**
     * Store data about a library
     *
     * Also fills in the libraryId in the libraryData object if the object is new
     *
     * @param {object} libraryData
     *   Associative array containing:
     *   - libraryId: The id of the library if it is an existing library.
     *   - title: The library's name
     *   - machineName: The library machineName
     *   - majorVersion: The library's majorVersion
     *   - minorVersion: The library's minorVersion
     *   - patchVersion: The library's patchVersion
     *   - runnable: 1 if the library is a content type, 0 otherwise
     *   - fullscreen(optional): 1 if the library supports fullscreen, 0 otherwise
     *   - embedTypes(optional): list of supported embed types
     *   - preloadedJs(optional): list of associative arrays containing:
     *     - path: path to a js file relative to the library root folder
     *   - preloadedCss(optional): list of associative arrays containing:
     *     - path: path to css file relative to the library root folder
     *   - dropLibraryCss(optional): list of associative arrays containing:
     *     - machineName: machine name for the librarys that are to drop their css
     *   - semantics(optional): Json describing the content structure for the library
     *   - language(optional): associative array containing:
     *     - languageCode: Translation in json format
     * @param {boolean} isNew
     * @return ??
     */
    saveLibraryData(libraryData, isNew = true){ throw `${NAME}.saveLibraryData()${MSG}`};

    /**
     * Insert new content.
     *
     * @param {object} content
     *   An associative array containing:
     *   - id: The content id
     *   - params: The content in json format
     *   - library: An associative array containing:
     *     - libraryId: The id of the main library for this content
     * @param {number} contentMainId
     *   Main id for the content if this is a system that supports versions
     */
    insertContent(content, contentMainId = 0){ throw `${NAME}.insertContent()${MSG}`};

    /**
     * Update old content.
     *
     * @param {object} content
     *   An associative array containing:
     *   - id: The content id
     *   - params: The content in json format
     *   - library: An associative array containing:
     *     - libraryId: The id of the main library for this content
     * @param {number} contentMainId
     *   Main id for the content if this is a system that supports versions
     */
    updateContent(content, contentMainId = 0){ throw `${NAME}.updateContent()${MSG}`};

    /**
     * Resets marked user data for the given content.
     *
     * @param {number} contentId
     */
    resetContentUserData(contentId){ throw `${NAME}.resetContentUserData()${MSG}`};

    /**
     * Save what libraries a library is depending on
     *
     * @param {number} libraryId
     *   Library Id for the library we're saving dependencies for
     * @param {object} dependencies
     *   List of dependencies as associative arrays containing:
     *   - machineName: The library machineName
     *   - majorVersion: The library's majorVersion
     *   - minorVersion: The library's minorVersion
     * @param {string} dependency_type
     *   What type of dependency this is, the following values are allowed:
     *   - editor
     *   - preloaded
     *   - dynamic
     */
    saveLibraryDependencies(libraryId, dependencies, dependency_type){ throw `${NAME}.saveLibraryDependencies()${MSG}`};

    /**
     * Give an H5P the same library dependencies as a given H5P
     *
     * @param {number} contentId
     *   Id identifying the content
     * @param {number} copyFromId
     *   Id identifying the content to be copied
     * @param {number} contentMainId
     *   Main id for the content, typically used in frameworks
     *   That supports versions. (In this case the content id will typically be
     *   the version id, and the contentMainId will be the frameworks content id
     */
    copyLibraryUsage(contentId, copyFromId, contentMainId = 0){ throw `${NAME}.copyLibraryUsage()${MSG}`};

    /**
     * Deletes content data
     *
     * @param {number} contentId
     *   Id identifying the content
     */
    deleteContentData($contentId){ throw `${NAME}.deleteContentData()${MSG}`};

    /**
     * Delete what libraries a content item is using
     *
     * @param {number} contentId
     *   Content Id of the content we'll be deleting library usage for
     */
    deleteLibraryUsage(contentId){ throw `${NAME}.deleteLibraryUsage()${MSG}`};

    /**
     * Saves what libraries the content uses
     *
     * @param {number} contentId
     *   Id identifying the content
     * @param {object} librariesInUse
     *   List of libraries the content uses. Libraries consist of associative arrays with:
     *   - library: Associative array containing:
     *     - dropLibraryCss(optional): comma separated list of machineNames
     *     - machineName: Machine name for the library
     *     - libraryId: Id of the library
     *   - type: The dependency type. Allowed values:
     *     - editor
     *     - dynamic
     *     - preloaded
     */
    saveLibraryUsage(contentId, librariesInUse){ throw `${NAME}.saveLibraryUsage()${MSG}`};

    /**
     * Get number of content/nodes using a library, and the number of
     * dependencies to other libraries
     * @param {number} libraryId
     *   Library identifier
     * @return {object}
     *   Associative array containing:
     *   - content: Number of content using the library
     *   - libraries: Number of libraries depending on the library
     */
    getLibraryUsage(libraryId){ throw `${NAME}.getLibraryUsage()${MSG}`};

    /**
     * Loads a library
     *
     * @param {string} machineName
     *   The library's machine name
     * @param {number} majorVersion
     *   The library's major version
     * @param {number} minorVersion
     *   The library's minor version
     * @return {object} | false
     *   FALSE if the library does not exist.
     *   Otherwise an associative array containing:
     *   - libraryId: The id of the library if it is an existing library.
     *   - title: The library's name
     *   - machineName: The library machineName
     *   - majorVersion: The library's majorVersion
     *   - minorVersion: The library's minorVersion
     *   - patchVersion: The library's patchVersion
     *   - runnable: 1 if the library is a content type, 0 otherwise
     *   - fullscreen(optional): 1 if the library supports fullscreen, 0 otherwise
     *   - embedTypes(optional): list of supported embed types
     *   - preloadedJs(optional): comma separated string with js file paths
     *   - preloadedCss(optional): comma separated sting with css file paths
     *   - dropLibraryCss(optional): list of associative arrays containing:
     *     - machineName: machine name for the librarys that are to drop their css
     *   - semantics(optional): Json describing the content structure for the library
     *   - preloadedDependencies(optional): list of associative arrays containing:
     *     - machineName: Machine name for a library this library is depending on
     *     - majorVersion: Major version for a library this library is depending on
     *     - minorVersion: Minor for a library this library is depending on
     *   - dynamicDependencies(optional): list of associative arrays containing:
     *     - machineName: Machine name for a library this library is depending on
     *     - majorVersion: Major version for a library this library is depending on
     *     - minorVersion: Minor for a library this library is depending on
     *   - editorDependencies(optional): list of associative arrays containing:
     *     - machineName: Machine name for a library this library is depending on
     *     - majorVersion: Major version for a library this library is depending on
     *     - minorVersion: Minor for a library this library is depending on
     */
    loadLibrary(machineName, majorVersion, minorVersion){ throw `${NAME}.loadLibrary()${MSG}`};

    /**
     * Loads library semantics.
     *
     * @param {string} machineName
     *   Machine name for the library
     * @param {number} majorVersion
     *   The library's major version
     * @param {number} minorVersion
     *   The library's minor version
     * @return {string}
     *   The library's semantics as json
     */
    loadLibrarySemantics(machineName, majorVersion, minorVersion){ throw `${NAME}.loadLibrarySemantics()${MSG}`};

    /**
     * Makes it possible to alter the semantics, adding custom fields, etc.
     *
     * @param {object} semantics
     *   Associative array representing the semantics
     * @param {string} machineName
     *   The library's machine name
     * @param {number} majorVersion
     *   The library's major version
     * @param {number} minorVersion
     *   The library's minor version
     */
    alterLibrarySemantics(semantics, machineName, majorVersion, minorVersion){ throw `${NAME}.alterLibrarySemantics()${MSG}`};

}

module.exports = H5PframeworkInterface;