const NAME = 'H5PframeworkInterface';

class H5PFrameworkInterface {

    /**
     * Returns info for the current platform.
     *
     * @return {object}
     *   - name {string}: The name of the platform, for instance "Wordpress"
     *   - version {string}: The version of the platform, for instance "4.0"
     *   - h5pVersion {string}: The version of the H5P plugin/module
     */
    getPlatformInfo(){ throw `${NAME}.getPlatformInfo(): missing implementation.`};

    /**
     * Fetches a file from a remote server using HTTP GET
     *
     * @param url {string} where you want to get or send data.
     * @param data {object} data to post to the URL. Can be null.
     * @param blocking {boolean} Set to 'false' to instantly time out (fire and forget), default is 'true'.
     * @param stream {string} Path to where the file should be saved. Can be null.
     * @return {string} The content (response body). NULL if something went wrong
     */
    fetchExternalData(url, data, blocking, stream){throw `${NAME}.fetchExternalData(): missing implementation.`};

    /**
     * Set the tutorial URL for a library. All versions of the library is set
     *
     * @param machineName {string}
     * @param tutorialUrl {string}
     */
    setLibraryTutorialUrl(machineName, tutorialUrl){ throw `${NAME}.setLibraryTutorialUrl(): missing implementation.`};

    /**
     * Show the user an error message
     *
     * @param message {string}
     */
    setErrorMessage($message){ throw `${NAME}.setErrorMessage(): missing implementation.`};

    /**
     * Show the user an information message
     *
     * @param message {string}
     */
    setInfoMessage(message){ throw `${NAME}.setInfoMessage(): missing implementation.`};

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
    t(message, replacements){ throw `${NAME}.t(): missing implementation.`};

    /**
     * Get URL to file in the specific library
     * @param libraryFolderName {string}
     * @param fileName {string}
     * @return {string} URL to file
     */
    getLibraryFileUrl(libraryFolderName, fileName){ throw `${NAME}.getLibraryFileUrl(): missing implementation.`}
}

module.exports = H5PframeworkInterface;