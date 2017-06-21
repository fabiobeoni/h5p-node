/**
 * This test is a selection of the most
 * complex functions performed by the
 * framework that is crucial to test.
 * The test uses data from ./test/sample-data
 * folder.
 */
const assert = require('assert');

const H5PLib = require('../h5h-lib');
const TestVars = require('./SharedTestVars');



describe('H5P Libraries Management:', ()=> {

    //Requires writable folder
    it('Saves h5p package from upload folder to libraries repository', async ()=> {
        let isFullyStored = false;

        try{
            let fsMngStrat = new H5PLib.FsLibraryStorageStrategy({
                basePath:'./h5p-packages'
            });

            let libMng = new H5PLib.LibraryManager(fsMngStrat);

            let libraryDef = new H5PLib.LibraryDefinition();
            libraryDef.majorVersion = 1;
            libraryDef.minorVersion =0;
            libraryDef.machineName = 'MyLib';
            libraryDef.name = 'mylib';
            libraryDef.uploadDirectory = TestVars.SAMPLE_LIBRARY_PATH;

            isFullyStored = await libMng.saveLibrary(libraryDef);
        }
        catch (err){
            console.error(err);
        }

        assert.equal(isFullyStored,true);
    });
});