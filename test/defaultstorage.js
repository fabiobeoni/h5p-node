const assert = require('assert');

const Storage = require('../h5p-defaultstorage');
const LibraryDef = require('../h5p-lib-definition');


describe('TESTING DEFAULT STORAGE:', ()=> {

    it('SAVING LIBRARY FROM UPLOADED PATH TO DESTINATION', async ()=> {
        let isFullyStored = false;

        try{
            let storageInst = new Storage('./');
            let libraryDef = new LibraryDef();

            libraryDef.majorVersion = 1;
            libraryDef.minorVersion =0;
            libraryDef.machineName = 'MyLib';
            libraryDef.name = 'mylib';
            libraryDef.uploadDirectory = './temp-upload';

            isFullyStored = await storageInst.saveLibrary(libraryDef);
        }
        catch (err){
            console.error(err);
        }

        assert.equal(isFullyStored,true);
    });
});