const uuid = require('uuid');
const imageInfo = require('imageinfo');
const FileSystemDAL = require('./FileSystemDAL');

const CLASS_NAME = 'H5PUploadedFileInfo';

/**
 * Represent a resource uploaded
 * to from the H5PEditor.
 *
 */
class H5PEditorUpload  {

    /**
     * DEV NOTE:
     * the PHP equivalent of this class
     * has in the constructor a lot of
     * logic to handle an HTTP request
     * with posted data and file, and
     * to get out of that some infos.
     *
     * Those data are represented by the
     * H5PUploadedFileInfo class in this
     * nodejs implementation.
     * So this implementation expects the
     * client of this class to perform the
     * logic of data extraction and sanitation
     * that in PHP is handled here.
     *
     * The reason for this choice is that
     * the request object on PHP and NodeJS
     * is managed quite differently, especially
     * the way nodejs works with posted files
     * may vary a-lot, depending on the framework
     * in use to create the HTTP server and web
     * app.
     * @param field {object} json object
     * @param fileInfo {H5PUploadedFileInfo}
     */
    constructor(field,fileInfo){

        this._name = null;

        this.result = {};

        /**
         *
         * @type {Object} json object
         */
        this.field = field;

        /**
         *
         * @type {H5PUploadedFileInfo}
         */
        this.fileInfo = fileInfo;
    }

    /**
     * Validates the extension of the
     * file according to the mime types
     * allowed for images, videos and audios.
     * For other types just sets the
     * result.mime to the the file.type.
     * Throws error if validation fails.
     * @return {Promise.<void>}
     */
    async validate(){
        if(!this.fileInfo.type)
            throw `${CLASS_NAME}-cannot-get-file-type`;

        if(this.fileInfo.mimes.length===0 || this.fileInfo.mimes.indexOf(this.fileInfo.type)===-1)
            throw `${CLASS_NAME}-file-type-not-allowed`;

        let allowedExtensions;

        switch (this.fileInfo.type){
            default: throw `${CLASS_NAME}-file-type-not-allowed`;

            case 'image':
                allowedExtensions = {
                    'image/png': 'png',
                    'image/jpeg': 'jpeg',
                    'image/jpg': 'jpg',
                    'image/gif': 'gif'
                };

                if(!this.checkMimeType([allowedExtensions]))
                    throw `${CLASS_NAME}-image-file-type-not-allowed`;


                let imgData;
                let imgMetaData;

                try{
                    if(this.fileInfo.base64Data)
                        imgData = new Buffer(this.fileInfo.base64Data, 'base64');
                    else
                        imgData = await FileSystemDAL.readResource(this.fileInfo.tempName);
                }
                catch (err){
                    console.error(err);
                    throw `${CLASS_NAME}-cannot-read-image`;
                }

                if(imgData){
                    try{
                        imgMetaData = imageInfo(imgData);
                    }
                    catch (err){
                        console.error(err);
                        throw `${CLASS_NAME}-cannot-read-image-metadata`;
                    }
                }

                if(imgMetaData){
                    this.result.width = imgMetaData.width;
                    this.result.height = imgMetaData.height;
                    this.result.mime = this.fileInfo.type;
                }

                break;


            case 'audio':
                allowedExtensions = {
                    'audio/mpeg' : 'mp3',
                    'audio/mp3': 'mp3',
                    'audio/x-wav' : 'wav',
                    'audio/wav' : 'wav',
                    'application/ogg' : 'ogg',
                    'audio/ogg' : 'ogg',
                    'video/ogg' : 'ogg'
                };

                if(!this.checkMimeType([allowedExtensions]))
                    throw `${CLASS_NAME}-audio-file-type-not-allowed`;


                this.result.mime = this.fileInfo.type;
                break;


            case 'video':
                allowedExtensions = {
                    'video/webm' : 'webm',
                    'video/mp4' : 'mp4',
                    'video/ogg' : 'ogg',
                };

                if(!this.checkMimeType([allowedExtensions]))
                    throw `${CLASS_NAME}-video-file-type-not-allowed`;

                this.result.mime = this.fileInfo.type;
                break;


            case 'file':
                this.result.mime = this.fileInfo.type;
                break;
        }
    }

    /**
     * Check if result object
     * is available.
     * @return {boolean}
     */
    isLoaded(){
        return this.result!==null;
    }

    /**
     * Check if the current fileInfo.extension
     * against a list of provided mimes.
     * @param mimeList {object[]} array of JSONs
     * @return {boolean} true when the current fileInfo.extension meet at least one from the given input mimeList
     * <pre><code>
     * [
     *  {
     *    "video/mp4":".mp4" //value can also be an array of extensions
     *  }
     * ]
     * <code></pre>
     */
    checkMimeType(mimeList){
        let currentExtension = this.fileInfo.extension.toLowerCase();

        mimeList.forEach((mimeDef)=>{
            let mime = mimeDef[0].toLowerCase();
            let extensions = mimeDef[1].toLowerCase();
            if(Array.isArray(extensions)){
                if(extensions.indexOf(currentExtension)!==-1)
                {
                    this.fileInfo.type = mime;
                    return true;
                }
            }
            else if(extensions===currentExtension)
            {
                this.fileInfo.type = mime;
                return true;
            }
        });

        return false;
    }

    /**
     * True if result object doesn't
     * have any error instance
     * @return {boolean}
     */
    isValid(){
        return (!this.result.error);
    }

    /**
     * The type of the file uploaded
     * @return {string}
     */
    getType(){
        return this.fileInfo.type;
    }

    /**
     * Retuns the name of the current uploaded file.
     * @return {string|*|null|string}
     */
    getName(){
        if(!this._name)
        {
            //name is based on a guid + original file name and extension
            this._name = (this.fileInfo.name+'-'+uuid.v4());

            if(this.fileInfo.extension)
                this._name += this.fileInfo.extension;
            else
            {
                let matches = this.fileInfo.name.match('/([a-z0-9]{1,})$/i');
                if(matches && matches.length>0)
                    this._name+='.'+matches[0];
            }
        }

        return this._name;
    }

    /**
     * Gets the content of the file
     * if it was provided as base64
     * string, otherwise returns null.
     * @return {string|null} base64 string, file content
     */
    getData(){
        return this.fileInfo.base64Data;
    }

    /**
     * Returns teh result of the file upload elaboration
     * Dev Note: the PHP equivalent prints the
     * result on response.
     * @return {{}|*}
     */
    getResult(){
        this.result.path = FileSystemDAL.getPath().join(this.getType(),'s',this.getName());
        return this.result;
    }
}

class H5PUploadedFileInfo {
    constructor(){
        this.name = '';
        this.size = 0;
        this.type = '';
        this.mimes = [];
        this.extension = '';
        this.tempName = '';
        this.base64Data = null;
    }
}

module.exports = {
    H5PEditorUpload:H5PEditorUpload,
    H5PUploadedFileInfo:H5PUploadedFileInfo
} ;