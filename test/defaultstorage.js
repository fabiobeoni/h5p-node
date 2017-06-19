const assert = require('assert');

const H5PLib = require('../h5h-lib');


describe('TESTING DEFAULT STORAGE:', ()=> {

    it('SAVING LIBRARY FROM UPLOADED PATH TO DESTINATION', async ()=> {
        let isFullyStored = false;

        try{
            let fsStorage = new H5PLib.FSStorageStrategy({
                basePath:'./' //WEB APP ROOT
            });

            let storageClient = new H5PLib.StorageClient(fsStorage);

            let libraryDef = new H5PLib.LibraryDefinition();
            libraryDef.majorVersion = 1;
            libraryDef.minorVersion =0;
            libraryDef.machineName = 'MyLib';
            libraryDef.name = 'mylib';
            libraryDef.uploadDirectory = './temp-upload';

            isFullyStored = await storageClient.saveLibrary(libraryDef);
        }
        catch (err){
            console.error(err);
        }

        assert.equal(isFullyStored,true);
    });
});