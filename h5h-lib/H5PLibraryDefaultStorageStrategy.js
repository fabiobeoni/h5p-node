const H5PAbstractLibraryStorageStrategy = require('./H5PAbstractLibraryStorageStrategy');
const FileSystemDAL = require('./FileSystemDAL');

const LIBRARIES_PATH = 'libraries';
const CONTENT_PATH = 'content';
const EXPORTS_PATH = 'exports';
const CACHED_ASSETS_PATH = '/cachedassets/';

const JS_EXT = '.js';
const CSS_EXT = '.css';


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
class H5PLibraryDefaultStorageStrategy extends H5PAbstractLibraryStorageStrategy {

    /**
     * Initializes the H5PLibraryDefaultStorageStrategy
     * @param opts.basePath {string}:
     * defines the base path to work with
     * where h5p files, it is a sub-path
     * of the app root.
     * NOTE: Web app process must have write
     * permission to it.
     */
    constructor(opts){
        super();
        this._basePath = opts.basePath;

        //creates all needed sub paths to work with...
        Promise.all([
            FileSystemDAL.ensurePath(FileSystemDAL.getPath().join(this._basePath,LIBRARIES_PATH)),
            FileSystemDAL.ensurePath(FileSystemDAL.getPath().join(this._basePath,EXPORTS_PATH)),
            FileSystemDAL.ensurePath(FileSystemDAL.getPath().join(this._basePath,CONTENT_PATH)),
            FileSystemDAL.ensurePath(FileSystemDAL.getPath().join(this._basePath,CACHED_ASSETS_PATH))
        ])
            .then(console.log('H5P required paths created'))
            .catch(err=>console.error(err));
    }

    /**
     * Returns the path where h5p library
     * contents are stored, based on the
     * content ID.
     * @param contentID {string}
     */
    getContentPath(contentID) {
        return FileSystemDAL.getPath().join(this._basePath, CONTENT_PATH, contentID);
    }

    /**
     * Gets the path of the given library
     * relative to the general libraries
     * store in the web app.
     * @param libDef {H5PLibraryDefinition}
     * @return {string}
     */
    getLibraryPath(libDef) {
        return FileSystemDAL.getPath().join(this._basePath, LIBRARIES_PATH, libDef.asString(true));
    }

    /**
     * Async stores the h5p library folder
     * by selecting the library by the
     * provided versioning info.
     * @param libDef {H5PLibraryDefinition}
     * @returns {Promise.<boolean>}
     * true when there are not differences
     * from original library and the saved
     * one in the new location
     */
    async saveLibrary(libDef) {

        let libraryUploadedInTemp = FileSystemDAL.getPath().join(libDef.uploadDirectory,libDef.asString(true));
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
     * @param libDef {H5PLibraryDefinition} lib to be exported
     * @param targetPath {string} path where to export the library
     * (must not include the lib name, will be added).
     * @param [devPath] {string} replacement path where the lib resides (dev only)
     * @returns {Promise.<boolean>} true when the full copy is done
     */
    async exportLibrary(libDef,targetPath,devPath){
        let libraryPath = devPath || this.getLibraryPath(libDef);

        //puts the library name into the name of the target
        targetPath = FileSystemDAL.getPath().join(targetPath, libDef.asString(true));

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
        let destPath = H5PLibraryDefaultStorageStrategy.getContentPath(contentID);

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
        await FileSystemDAL.deepDelete(H5PLibraryDefaultStorageStrategy.getContentPath(contentID));
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
        let originalContentPath = H5PLibraryDefaultStorageStrategy.getContentPath(contentID);
        let clonedContentPath = H5PLibraryDefaultStorageStrategy.getContentPath(newContentID);

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
        let contentPath = H5PLibraryDefaultStorageStrategy.getContentPath(contentID);
        if(await FileSystemDAL.resourceExists(contentPath))
            return await FileSystemDAL.deepCopy(contentPath,targetPath,true);
        else{
            await FileSystemDAL.ensurePath(targetPath);
            return true;
        }
    };

    /**
     * Exports a file (typically .h5p zipped file)
     * to the app export directory.
     * @param sourceExportName {string} this is the equivalent of a short file name (without path)
     * @param outputExportName {string} this is the equivalent of a short file name (without path)
     * @return {Promise.<boolean>}
     */
    async saveExport(sourceExportName,outputExportName){
        //deletes if any...
        await this.deleteExport(outputExportName);

        //performs the copy
        return await FileSystemDAL.deepCopy(
            FileSystemDAL.getPath().join(EXPORTS_PATH,sourceExportName),
            FileSystemDAL.getPath().join(EXPORTS_PATH,outputExportName),
            false
        );
    }

    /**
     * Deletes the given export file
     * from the app exports path.
     * @param exportName {string} this is the equivalent of a short file name (without path)
     * @return {Promise.<void>}
     */
    async deleteExport(exportName){
        await FileSystemDAL.deepDelete(FileSystemDAL.getPath().join(EXPORTS_PATH,exportName));
    }

    /**
     * Returns true if a export file with
     * given name exists in the app exports
     * path.
     * @param exportName {string} this is the equivalent of a short file name (without path)
     * @return {Promise.<boolean>}
     */
    async exportExists(exportName){
        await FileSystemDAL.resourceExists(FileSystemDAL.getPath().join(EXPORTS_PATH,exportName));
    };

    /**
     * Concatenates all JavaScrips and Stylesheets into two files in order
     * to improve page load performance.
     * @param assets {object} a set of all the assets required for content to display
     * @param key {string} hashed key for the cached asset
     * @return {Promise.<void>}
     */
    async cacheAssets(assets,key){
        //According to Joubel (https://h5ptechnology.slack.com/archives/C36BURHFH/p1498053967451612)
        //"files" input should be:
        /*
        * {
         scripts: [{path: '', version: ''},{path: '', version: ''}]
         styles: [{path: '', version: ''},{path: '', version: ''}]
         }

        * */
        let content = '';

        assets.forEach(async(asset,i)=>{

            //scripts or styles list of files
            if(asset && asset.length>0)//has an array of child objects
            {
                //get the file path
                let assetPath = FileSystemDAL.getPath().join(this._basePath,asset.path);

                //check if it exists
                if(await FileSystemDAL.resourceExists(assetPath)){
                    //get the content of the file as string
                    let assetContent = await FileSystemDAL.readResourceAsText(assetPath);

                    //script file content added to the existing
                    //string so you gonna have only one script
                    //to include in HTML.
                    if(assets[i]==='scripts')
                        content += assetContent;
                    else {

                        let cssRelativePath = asset.path.replace('/[^\/]+$/','');

                        /*
                        TODO: discuss with Joubel, this code is out of my small knowledge of PHP. Moreover looks a bit sensitive...

                         // Rewrite relative URLs used inside stylesheets
                         $content .= preg_replace_callback(
                         '/url\([\'"]?([^"\')]+)[\'"]?\)/i',
                         function ($matches) use ($cssRelPath) {
                            if (preg_match("/^(data:|([a-z0-9]+:)?\/)/i", $matches[1]) === 1) {
                                return $matches[0]; // Not relative, skip
                            }
                            return 'url("../' . $cssRelPath . $matches[1] . '")';
                         },
                         $assetContent) . "\n";
                        */
                    }
                }
                else
                    console.warn(`The file "${asset.path}" passed to "cacheAssets()" doesn't exist.`);
            }
        });
    }

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
    async getCachedAssets(key){
        let files = {};

        let jsCachedFile = this.getCachedAssetsSrc(key,JS_EXT);
        let cssCachedFile = this.getCachedAssetsSrc(key,CSS_EXT);

        if(FileSystemDAL.resourceExists(jsCachedFile))
            files.scripts = [{
                path:jsCachedFile,
                version:''
            }];

        if(FileSystemDAL.resourceExists(cssCachedFile))
            files.styles =[{
                path:cssCachedFile,
                version:''
            }];

        return (files.length>0 ? files : null);
    }

    /**
     * Returns a temp dir with unique name.
     * Not sure that is really needed in
     * nodejs.
     * //TODO: later when you have more knowledge of the h5p framework check this
     * @php H5PDefaultStorage.getTmpPath()
     * @return {Promise.<string>}
     */
    async getWritableTempPath(){
        return await H5PLibraryDefaultStorageStrategy.getWritableTempPath(this._basePath);
    }

    /**
     * Returns the value for the
     * src property of a <script>
     * or <style> element to include
     * some assets.
     * @param key {string}
     * @param ext {string} ".js", ".css"
     * @return {string}
     */
    static getCachedAssetsSrc(key,ext){
        return (CACHED_ASSETS_PATH+`${key}.${ext}`);
    }

}

module.exports = H5PLibraryDefaultStorageStrategy;