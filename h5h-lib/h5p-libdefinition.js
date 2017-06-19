/**
 * Object describing the H5P library definition.
 * @link https://h5p.org/library-definition#libcoreApi
 */
class LibraryDefinition {

    title = '';
    description = '';
    machineName = '';
    name = '';
    majorVersion = 0;
    minorVersion = 0;
    patchVersion = 0;
    author = '';
    license = '';
    runnable = 0;
    embedTypes = [];
    fullscreen = 0;
    coreApi = null; //object
    preloadedCss = [];
    preloadedJs = [];
    preloadedDependencies = [];

    //TODO: check with authors, available in PHP code, not in docs (https://h5p.org/library-definition#libcoreApi)
    uploadDirectory = '';

    /**
     * Returns the object with the following
     * string format "machineName majorVersion.minorVersion".
     * If "machineName" is null then "name" is returned
     * instead.
     * @param [nospaces] {boolean}: true if you want to get back a string with hyphens instead of spaces.
     * @returns {string}
     */
    asString(nospaces){
        this.machineName = this.machineName || this.name;
        return (this.machineName + (!nospaces ? ' ' : '-') + this.majorVersion.toString() + '.' + this.minorVersion.toString());
    }
}

module.exports = LibraryDefinition;