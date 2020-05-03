// Load the SDK and UUID
var AWS = require('aws-sdk');
var uuid = require('uuid');

/*
This is a dummy test comment to learn github
*/

AWS.config.update({region: 'us-east-1'});

// Run this by "node index.js BUCKET_NAME"
function createBucket(){
        // Create S3 service object
    s3 = new AWS.S3({apiVersion: '2006-03-01'});

    // Create the parameters for calling createBucket
    var bucketParams = {
    Bucket : process.argv[2],
    ACL : 'public-read'
    };

    // call S3 to create the bucket
    s3.createBucket(bucketParams, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data.Location);
    }
    });
}

function getListOfBuckets(){

    s3 = new AWS.S3({apiVersion: '2006-03-01'});
        // Call S3 to list the buckets
    s3.listBuckets(function(err, data) {
        if (err) {
        console.log("Error", err);
        } else {
        console.log("Success", data.Buckets);
        }
    });
}

//run this by "node index.js BUCKET_NAME FILE_NAME"
function uploadFileIntoBucket(){
    // Create S3 service object
    s3 = new AWS.S3({apiVersion: '2006-03-01'});

    // call S3 to retrieve upload file to specified bucket
    var uploadParams = {Bucket: process.argv[2], Key: '', Body: ''};
    var file = process.argv[3];

    // Configure the file stream and obtain the upload parameters
    var fs = require('fs');
    var fileStream = fs.createReadStream(file);
    fileStream.on('error', function(err) {
        console.log('File Error', err);
    });

    uploadParams.Body = fileStream;
    var path = require('path');
    uploadParams.Key = path.basename(file);

    // call S3 to retrieve upload file to specified bucket
    s3.upload (uploadParams, function (err, data) {
    if (err) {
        console.log("Error", err);
    } if (data) {
        console.log("Upload Success", data.Location);
    }
    });
}

//run this by "node index.js BUCKET_NAME FOLDER_NAME FILE_NAME"
function uploadFileIntoFolderOfBucket(){
    // Create S3 service object
    s3 = new AWS.S3({apiVersion: '2006-03-01'});

    // call S3 to retrieve upload file to specified bucket
    var uploadParams = {Bucket: process.argv[2], Key: '', Body: ''};
    var file = process.argv[4];

    // Configure the file stream and obtain the upload parameters
    var fs = require('fs');
    var fileStream = fs.createReadStream(file);
    fileStream.on('error', function(err) {
        console.log('File Error', err);
    });

    uploadParams.Body = fileStream;
    var path = require('path');
    uploadParams.Key = process.argv[3]+"/"+path.basename(file);

    // call S3 to retrieve upload file to specified bucket
    s3.upload (uploadParams, function (err, data) {
    if (err) {
        console.log("Error", err);
    } if (data) {
        console.log("Upload Success", data.Location);
    }
    });
}

function getListOfFilesFromBucket(){
    s3=new AWS.S3({apiVersion: '2006-03-01'});
    var bucketParams={
        Bucket:process.argv[2]
    }
    // Call S3 to obtain a list of the objects in the bucket
    s3.listObjects(bucketParams, function(err, data) {
        if (err) {
        console.log("Error", err);
        } else {
        console.log("Success", data);
        }
    });
}

function getListOfFilesFromBucketFolder(){
    s3=new AWS.S3({apiVersion: '2006-03-01'});
    var bucketParams={
        Bucket:process.argv[2],
        Prefix:process.argv[3]
    }
    // Call S3 to obtain a list of the objects in the bucket
    s3.listObjects(bucketParams, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }
    });
}

//run this by "node index.js BUCKET_NAME path/to/file"
/*
If you delete all the files of a particular folder, the folder will automatically get deleted
*/
async function deleteFileFromFolder(){
    const params = {
        Bucket:process.argv[2],
        Key: process.argv[3] //if any sub folder-> path/of/the/folder.ext   
    }
    s3=new AWS.S3({apiVersion: '2006-03-01'});
    try {
        await s3.headObject(params).promise()
        console.log("File Found in S3")
        try {
            await s3.deleteObject(params).promise()
            console.log("file deleted Successfully")
        }
        catch (err) {
             console.log("ERROR in file Deleting : " + JSON.stringify(err))
        }
    } 
    catch (err) {
            console.log("File not Found ERROR : " + err.code)
    }

}


//delete a folder requires deleting all the files in it
async function emptyAndDeleteFolderOfBucket() {
    s3=new AWS.S3({apiVersion: '2006-03-01'});
    const listParams = {
        Bucket:process.argv[2],
        Prefix:process.argv[3]
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
        Bucket: process.argv[2],
        Delete: { Objects: [] }
    };

    listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) await emptyAndDeleteFolderOfBucket(process.argv[2], process.argv[3]);
}

//createBucket();
//getListOfBuckets();
//uploadFileIntoBucket();
//getListOfFilesFromBucket();
//uploadFileIntoFolderOfBucket();
//getListOfFilesFromBucketFolder();
//deleteFileFromFolder();
//emptyAndDeleteFolderOfBucket();
