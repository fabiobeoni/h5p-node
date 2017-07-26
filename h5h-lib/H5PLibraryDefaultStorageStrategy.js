require('./H5PSharedConstants');

const LIBRARIES_PATH = 'libraries';
const CONTENT_PATH = 'content';
const EXPORTS_PATH = 'exports';
const CACHED_ASSETS_PATH = '/cachedassets/';
const EDITOR_PATH = 'editor';

const H5PAbstractLibraryStorageStrategy = require('./H5PAbstractLibraryStorageStrategy');
const FileSystemDAL = require('./FileSystemDAL');
const join = FileSystemDAL.getPath().join;


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
     * @param opts {object}:
     *
     *      basePath {string}:
     *          defines the base path to work with
     *          where h5p files, it is a sub-path
     *          of the app root.
     *          NOTE: Web app process must have write
     *          permission to it.
     *
     *      [altEditorPath] {string}:
     *          defines an alternative path for
     *          the editor.
     */
    constructor(opts){
        super();
        this._basePath = opts.basePath;
        this._altEditorPath = opts.altEditorPath; //optional

        //creates all needed sub paths to work with...
        Promise.all([
            FileSystemDAL.ensurePath(join(this._basePath,LIBRARIES_PATH)),
            FileSystemDAL.ensurePath(join(this._basePath,EXPORTS_PATH)),
            FileSystemDAL.ensurePath(join(this._basePath,CONTENT_PATH)),
            FileSystemDAL.ensurePath(join(this._basePath,CACHED_ASSETS_PATH))
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
        return join(this._basePath, CONTENT_PATH, contentID);
    }

    /**
     * Gets the path of the given library
     * relative to the general libraries
     * store in the web app.
     * @param libDef {H5PLibraryDefinition}
     * @return {string}
     */
    getLibraryPath(libDef) {
        return join(this._basePath, LIBRARIES_PATH, libDef.asString(true));
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
        let libraryUploadedInTemp = join(libDef.uploadDirectory,libDef.asString(true));
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
        targetPath = join(targetPath, libDef.asString(true));

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
        let destPath = this.getContentPath(contentID);

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
        await FileSystemDAL.deepDelete(this.getContentPath(contentID));
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
        let originalContentPath = this.getContentPath(contentID);
        let clonedContentPath = this.getContentPath(newContentID);

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
        let contentPath = this.getContentPath(contentID);
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
            join(EXPORTS_PATH,sourceExportName),
            join(EXPORTS_PATH,outputExportName),
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
        await FileSystemDAL.deepDelete(join(EXPORTS_PATH,exportName));
    }

    /**
     * Returns true if a export file with
     * given name exists in the app exports
     * path.
     * @param exportName {string} this is the equivalent of a short file name (without path)
     * @return {Promise.<boolean>}
     */
    async exportExists(exportName){
        await FileSystemDAL.resourceExists(join(EXPORTS_PATH,exportName));
    };

    /**
     * Concatenates all JavaScrips and Stylesheets into two files in order
     * to improve page load performance.
     *
     * According to Joubel (https://h5ptechnology.slack.com/archives/C36BURHFH/p1498053967451612)
       "files" input should be:
      {
        scripts: [{path: 'path/to/file', version: 'something'}]
        styles: [{path: 'path/to/file', version: 'something'}]
      }
     * @param files {object} a set of all the assets required for content to display
     * @param key {string} hashed key for the cached asset
     * @return {Promise.<object>} returns the same object of the input but with only one file per type and with abs path to it.
     */
    async cacheAssets(files,key){

        let arr = Object.entries(files);

        //type can be "scripts" or "styles"
        for(let [type,assets] of arr){
            if(assets.length>0)
            {
                let fileContent = '';

                for(let i=0;i<assets.length;i++){
                    let asset = assets[i];

                    //get the file path, to copy the file content
                    let assetPath = join(this._basePath,asset.path);

                    //check if it exists
                    let fileExists = await FileSystemDAL.resourceExists(assetPath);

                    //works on content
                    if(fileExists){
                        //get the content of the file as string
                        let assetContent = await FileSystemDAL.readResourceAsText(assetPath);

                        //script file content added to the existing
                        //string so you gonna have only one script
                        //to include in HTML.
                        if(type==='scripts')
                            fileContent += assetContent;
                        else {

                            // Rewrite relative URLs used inside stylesheets
                            let cssRelativePath = asset.path.replace('/[^\/]+$/','');

                            //removes file name from path
                            if(cssRelativePath.indexOf('.css')!==-1)
                                cssRelativePath = cssRelativePath.split('/').slice(0,-1).join('/');

                            //Joubel suggests:
                            fileContent += assetContent.replace(/url\(['"]?([^"')]+)['"]?\)/ig, (match, p1) => {
                                    if (p1.match(/^(data:|([a-z0-9]+:)?\/)/i) !== null) {
                                        return match; // Not relative, skip
                                    }
                                    return 'url("../' + cssRelativePath+'/'+p1 + '")';
                                }) + "\n";
                        }
                    }
                    else
                        console.warn(`The file "${asset.path}" passed to "cacheAssets()" doesn't exist.`);
                }

                //gets the extension and saves the file
                //in the location where cached assets must be
                let ext = (type==='scripts') ? JS_EXT : CSS_EXT;

                let outputFile = `${key}.${ext}`;
                outputFile = join(this._basePath,CACHED_ASSETS_PATH,outputFile);

                await FileSystemDAL.writeResource(outputFile,fileContent);

                //returns the two nodes, scripts and styles, with
                //references to the new created files with merged
                //contents.
                files[type] = {
                    path:outputFile,
                    version:''
                };
            }
        }

        return files;
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
     * Deletes all given assets list from the cache.
     * @param keys {string[]}: list of keys
     * @return {Promise.<void>}
     */
    async deleteCachedAssets(keys){
        for(let key of keys)
            for(let ext of [JS_EXT,CSS_EXT])
            {
                let assetPath = this.getCachedAssetsSrc(key,ext);
                if(await FileSystemDAL.resourceExists(assetPath))
                    await FileSystemDAL.deepDelete(assetPath);
            }
    }

    /**
     * Reads the given path and returns
     * the resource content as a text string (UTF-8).
     * In this storage strategy implementation,
     * it's just a wrapper a-round the
     * FileSystemDAL.readResourceAsText, and
     * exposed as required by the abstract
     * parent class.
     * @param path {string}
     * @param [encoding] {string}
     * @return {Promise.<string>}
     */
    async getResourceAsText(path,encoding){
        return await FileSystemDAL.readResourceAsText(path,encoding);
    }

    /**
     * Save files uploaded through the editor.
     * The files must be marked as temporary until the content form is saved.
     * @param editorFile {H5PEditorUpload}
     * @param [contentID] {string}
     * @return {Promise.<H5PEditorUpload>}
     */
    async saveResource(editorFile,contentID){
        let storingPath = '';

        if(!contentID)
            storingPath = this.getEditorPath();
        else
            storingPath = this.getContentPath(contentID);

        //appends to editor working path + 's' //TODO: what's that "s" (from PHP code)?
        storingPath = join(storingPath,editorFile.getType(),'s');

        await FileSystemDAL.ensurePath(storingPath);

        //now also adds the name of the file
        storingPath = join(storingPath,editorFile.getName());

        let fileContent = editorFile.getData();
        if(fileContent)
            await FileSystemDAL.writeResource(storingPath,fileContent);
        else
            //PHP copy($_FILES['file']['tmp_name'], $path);
            await FileSystemDAL.copyResource(editorFile.fileInfo.tempName,storingPath);

        return editorFile;
    }

    /**
     * Looks for the given resource item with-in
     * the content path, and returns the full path
     * of it when available
     * @param resourceItemPath {string}: path relative to contentID path
     * @param contentID {string}
     * @return {Promise.<string>}: null is resource doesn't exist
     */
    async getFullResourceItemPathFromContent(resourceItemPath, contentID){
        let fullResPath = join(this.getContentPath(contentID), resourceItemPath);
        return (await FileSystemDAL.resourceExists(fullResPath)) ? fullResPath : null;
    }

    /**
     * Looks for the given resource item with-in
     * the content path and deletes it if any.
     * @param resourceItemPath {string}: path relative to contentID path
     * @param contentID {string}
     * @return {Promise.<void>}
     */
    async deleteResourceItemFromContent(resourceItemPath, contentID){
        let fullResPath = await this.getFullResourceItemPathFromContent(resourceItemPath,contentID);
        if(fullResPath)
            await FileSystemDAL.deleteResource(fullResPath);
    }

    /**
     * Copy a file from another content or editor tmp path
     * to the provided destination contentID.
     *
     * @param resourceItemPath {string}: path relative to contentID path
     * @param fromContentID {string}
     * @param toContentID {string}
     */
    async cloneContentResourceItem(resourceItemPath, fromContentID, toContentID) {

        //gets the location of the content
        //resource to clone, it can be
        //hosted on editor working path
        //or into a specific content path
        let sourceLocation = '';

        if(fromContentID==='editor')
            sourceLocation = this.getEditorPath();
        else
            sourceLocation = this.getContentPath(fromContentID);

        //that's the full original path
        let fullSourceResourceItemPath = join(sourceLocation, resourceItemPath);

        //that's the full destination, where the content resource item will be cloned
        let destinationLocation = this.getContentPath(toContentID);
        let fullDestinationResourceItemPath = fullSourceResourceItemPath.replace(sourceLocation,destinationLocation);

        //clones only if the file doesn't exist (from PHP, looks like updates is not possible then)
        if(await FileSystemDAL.resourceExists(fullDestinationResourceItemPath)===false)
            await FileSystemDAL.copyResource(
                fullSourceResourceItemPath,
                fullDestinationResourceItemPath
            );
    }

    /**
     * Copy a content from one directory to another. Defaults to cloning
     * content from the current temporary upload folder to the editor path.
     * @param opts {object}
     *      [sourcePath] {string},
     *      [contentID] {string}
     * @return {Promise.<object>} Object containing h5p json and content json data
     */
    async cloneContentResources(opts){
        let sourcePath = opts.sourcePath;
        let contentID = opts.contentID;

        if(!sourcePath)
            return null;

        //gets the path where the files
        //of the content must be copied to
        let contentTargetPath = (!contentID || contentID==='0') ? this.getEditorPath() : this.getContentPath(contentID);

        //gets the source content path
        let contentSourcePath = join(sourcePath,CONTENT_PATH);

        //copies all content except for content.json
        await FileSystemDAL.deepCopy(contentSourcePath,contentTargetPath,true, {
            equalTo:['.','..',H5P_CONTENT_CONFIG_FILE_NAME], //file names equal to these
        });

        //reads the JSONs files of H5P package (h5p.json and content.json)
        //to return that JSONs to the client
        let h5pConfig = JSON.parse(
            await FileSystemDAL.readResourceAsText(join(contentSourcePath,H5P_CONFIG_FILE_NAME))
        );

        let h5pContentConfig = JSON.parse(
            await FileSystemDAL.readResourceAsText(join(contentSourcePath,H5P_CONTENT_CONFIG_FILE_NAME))
        );

        return {
            'h5pJson':h5pConfig,
            'contentJson':h5pContentConfig
        };
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
        return await FileSystemDAL.getWritableTempPath(this._basePath);
    }

    /**
     * Returns true if the given path
     * has writable access.
     * @param pathTo {string}
     * @return {Promise.<boolean>}
     */
    async isPathWritable(pathTo){
        return await FileSystemDAL.isPathWritable(pathTo);
    }

    /**
     * Returns the path where the editor
     * is working on.
     * @return {string}
     */
    getEditorPath(){
        return this._altEditorPath || join(this._basePath,EDITOR_PATH);
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