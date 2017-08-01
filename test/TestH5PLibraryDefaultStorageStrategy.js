/**
 * This test is a selection of the most
 * complex functions performed by the
 * framework that is crucial to test.
 * The test uses data from ./test/test-data
 * folder.
 */
const assert = require('assert');

const H5PLib = require('../h5h-lib');
const TestVars = require('./SharedTestVars');



describe('H5P Libraries Management:', async()=> {

    it(`Checks that all needed default dirs to work 
        are available after the H5PLibraryDefaultStorageStrategy
        is initialized`,

        async()=>
        {
            let result = false;
            try{
                const WORKING_PATH = './test/dirs';
                const fs = H5PLib.FileSystemDAL;
                const createdDirs = H5PLib.H5PLibraryDefaultStorageStrategy.getWorkingPaths();

                new H5PLib.H5PLibraryDefaultStorageStrategy({
                    basePath:WORKING_PATH
                });

                let allPathsAvailable = true;
                allPathsAvailable = allPathsAvailable && await fs.isPathWritable(fs.getPath().join(WORKING_PATH,createdDirs.EDITOR_PATH));
                allPathsAvailable = allPathsAvailable && await fs.isPathWritable(fs.getPath().join(WORKING_PATH,createdDirs.CACHED_ASSETS_PATH));
                allPathsAvailable = allPathsAvailable && await fs.isPathWritable(fs.getPath().join(WORKING_PATH,createdDirs.EXPORTS_PATH));
                allPathsAvailable = allPathsAvailable && await fs.isPathWritable(fs.getPath().join(WORKING_PATH,createdDirs.CONTENT_PATH));
                allPathsAvailable = allPathsAvailable && await fs.isPathWritable(fs.getPath().join(WORKING_PATH,createdDirs.LIBRARIES_PATH));

                result = allPathsAvailable;
            }
            catch (err){
                console.error(err);
            }

            assert.equal(result,true);
        }
    );


    //Requires writable folder
    it('Saves h5p package from upload folder to libraries repository', async ()=> {
        let isFullyStored = false;

        try{
            let storageStrat = new H5PLib.H5PLibraryDefaultStorageStrategy({
                basePath:'./h5p-packages-repository'
            });

            let libMng = new H5PLib.H5PLibraryManager(storageStrat);

            let libraryDef = new H5PLib.H5PLibraryDefinition();
            libraryDef.majorVersion = 1;
            libraryDef.minorVersion =0;
            libraryDef.machineName = 'MyLib';
            libraryDef.name = 'mylib';
            libraryDef.uploadDirectory = TestVars.SAMPLE_LIBRARY_PATH;

            isFullyStored = await libMng.getStorage().saveLibrary(libraryDef);
        }
        catch (err){
            console.error(err);
        }

        assert.equal(isFullyStored,true);
    });

    it(`Get a list of files to merge and put in a cache
        to test the first behaviour related to caching system`,

        async()=>
        {
            const CACHING_TEST_PATH = 'CachingAssetsTest';
            const path = H5PLib.FileSystemDAL.getPath();

            let data = {
                scripts: [
                    {path:path.join(CACHING_TEST_PATH,'fileOne.js'), version: '1'},
                    {path:path.join(CACHING_TEST_PATH,'fileTwo.js'), version: '1'}
                ],
                styles: [
                    {path:path.join(CACHING_TEST_PATH,'fileThree.css'), version: '1'},
                    {path:path.join(CACHING_TEST_PATH,'fileFour.css'), version: '1'}
                ]
            };

            let storageStrat = new H5PLib.H5PLibraryDefaultStorageStrategy({
                basePath:TestVars.TEST_DATA_PATH
            });

            let merge = await storageStrat.cacheAssets(data,'my-key');

            let hasResult = (merge!==null);

            assert.equal(hasResult,true);
        }
    );

});