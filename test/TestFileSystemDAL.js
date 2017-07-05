/**
 * This test is a selection of the most
 * "tricky" functions of the FileSystemDAL.
 * The test uses data from ./test/sample-data
 * folder.
 */
const assert = require('assert');
const path = require('path');
const recursiveRead = require('fs-readdir-recursive');

const H5PLib = require('../h5h-lib');
const TestVars = require('./SharedTestVars');


describe('Class FileSystemDAL:', async()=> {

    //Deep copy is an important function since it is invoked
    //in many functions in the app to manage the filesystem
    //For instance copy of an .h5p package in the app
    //libraries repository.
    it('deepCopy(): Makes a FILTERED copy of an entire H5P library, including sub paths and checks that all needed files are there', async()=> {

        let testResult = false;

        try{
            let destPath = (TestVars.SAMPLE_LIBRARY_PATH+'_deepcopy_filtered');
            testResult = await H5PLib.FileSystemDAL.deepCopy(TestVars.SAMPLE_LIBRARY_PATH,destPath,true);
        }
        catch (err){console.error(err);}


        assert.equal(testResult,true);
    });

    it('deepCopy(): Makes a FULL copy of an entire H5P library, including sub paths and checks that all needed files are there', async()=> {

        let testResult = false;

        try{
            let destPath = (TestVars.SAMPLE_LIBRARY_PATH+'_deepcopy_full');
            testResult = await H5PLib.FileSystemDAL.deepCopy(TestVars.SAMPLE_LIBRARY_PATH,destPath,false);
        }
        catch (err){console.error(err);}


        assert.equal(testResult,true);
    });

    //This test is needed to make sure that the deepCopy() works
    //as expected by removing from the deep copy files that are
    //not allowed. filterFilesToIgnore() actually filters the
    //list of files to copy.
    it('filterFilesToIgnore(): Filters a list of files based on ignore options and returns them', async()=> {

        let testResult = false;
        try{
            let filterResult = await H5PLib.FileSystemDAL.filterFilesToIgnore(TestVars.SAMPLE_LIBRARY_PATH);
            let fullFilesList =  await recursiveRead(path.resolve(TestVars.SAMPLE_LIBRARY_PATH));

            //useful output on test result report once exported
            console.log('================ Filter applied =================');
            console.log(filterResult.ignoreOpts);

            //this is very basic, a more deep test can
            //check that all returned files follows
            //don't match the ignore options
            testResult = fullFilesList.length>filterResult.allowedList.length;
        }
        catch (err){console.error(err);}


        assert.equal(testResult,true);
    });

});