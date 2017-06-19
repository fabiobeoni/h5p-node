const assert = require('assert');

const H5PLib = require('../h5h-lib');


describe('TESTING DEFAULT STORAGE:', ()=> {

    it('SAVING LIBRARY FROM UPLOADED PATH TO DESTINATION', async ()=> {
        let isFullyStored = false;

        try{
            let fsMngStrat = new H5PLib.FsLibraryManagementStrategy({
                basePath:'./' //WEB APP ROOT
            });

            let libMng = new H5PLib.LibraryManager(fsMngStrat);

            let libraryDef = new H5PLib.LibraryDefinition();
            libraryDef.majorVersion = 1;
            libraryDef.minorVersion =0;
            libraryDef.machineName = 'MyLib';
            libraryDef.name = 'mylib';
            libraryDef.uploadDirectory = './temp-upload';

            isFullyStored = await libMng.saveLibrary(libraryDef);
        }
        catch (err){
            console.error(err);
        }

        assert.equal(isFullyStored,true);
    });
});