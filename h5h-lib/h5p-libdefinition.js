/**
 * Object describing the H5P library definition.
 *
 * @type {{machineName: '', name: '', majorVersion: 0, minorVersion: 0, uploadDirectory:''}}
 */
class LibraryDefinition {

    constructor(){
        this.title = '';
        this.description = '';
        this.machineName = '';
        this.name = '';
        this.majorVersion = 0;
        this.minorVersion = 0;
        this.patchVersion = 0;
        this.author = '';
        this.license = '';
        this.runnable = 0;
        this.embedTypes = [];
        this.fullscreen = 0;
        this.coreApi = null; //object
        this.preloadedCss = [];
        this.preloadedJs = [];
        this.preloadedDependencies = [];

        //TODO: check with authors, avaiblable in PHP code, not in docs (https://h5p.org/library-definition#libcoreApi)
        this.uploadDirectory = '';
    }

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
        return (this.machineName.toString() + (!nospaces ? ' ' : '-') + this.majorVersion.toString() + '.' + this.minorVersion.toString());
    }
}

module.exports = LibraryDefinition;