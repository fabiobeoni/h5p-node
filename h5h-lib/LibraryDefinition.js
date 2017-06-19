/**
 * Object describing the H5P library definition.
 * @link https://h5p.org/library-definition#libcoreApi
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

        //Not defined in docs (https://h5p.org/library-definition#libcoreApi),
        //Joubel suggests that in the PHP equivalent
        //may be a "on-the-fly" created for some purposes.
        //https://h5ptechnology.slack.com/archives/C36BURHFH/p1497863978538236
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
        return (this.machineName + (!nospaces ? ' ' : '-') + this.majorVersion.toString() + '.' + this.minorVersion.toString());
    }
}

module.exports = LibraryDefinition;