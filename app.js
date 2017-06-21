const express = require('express');
const H5PLib = require('./h5h-lib');

const app = express();

app.get('/',(rq,rs)=>{
    rs.send('hi');
});

app.listen(3000, function () {
    console.log('Listening on port 3000!');

    let fsMngStrat = new H5PLib.FsLibraryStorageStrategy({
        basePath:'./' //WEB APP ROOT
    });

    let libMng = new H5PLib.LibraryManager(fsMngStrat);
});