const assert = require('assert');
const path = require('path');
const imageInfo = require('imageinfo');

const H5PLib = require('../h5h-lib');
const TestVars = require('./SharedTestVars');


const IMG_DATA = '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';


describe('Test image file/base64-data reading to get image properties:', async()=> {

    it('Process a base64 string (from image) and returns width and height of the image', async()=> {
        let w = 0;
        let h = 0;

        try{
            let imgData = new Buffer(IMG_DATA, 'base64');
            let info = imageInfo(imgData);

            if(info){
                w = info.width;
                h = info.height;
            }

        }
        catch (err){console.error(err);}


        assert.notEqual((w+h),0)
    });

});