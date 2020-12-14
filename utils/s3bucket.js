const bucket = process.env.NODE_ENV === 'production' ? 'slothfashionreact' : 'slothfashionreactpre'
const s3URL = "https://slothfashionreact.s3-sa-east-1.amazonaws.com/"

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk')

AWS.config.loadFromPath('credentials.json');

// Create S3 service object
s3 = new AWS.S3({ apiVersion: '2006-03-01' })

// Create the parameters for calling listObjects
var bucketParams = {
  Bucket: bucket,
}

function AWSlistObjects() {
  // Call S3 to list the buckets
  s3.listObjects(bucketParams, function (err, data) {
    if (err) {
      console.log("Error", err)
      throw Error(err)
    } else {
      console.log("Success", data)
      return data
    }
  })
}

async function AWSuploadFile(file) {
  var uploadParams = { Bucket: bucket, Key: '', Body: '', ContentType: '' }

  // Configure the file stream and obtain the upload parameters
  var fs = require('fs')
  var fileStream = fs.createReadStream(file)
  fileStream.on('error', function (err) {
    console.log('File Error', err)
  })
  uploadParams.Body = fileStream;
  var path = require('path')
  uploadParams.Key = path.basename(file)

  const ext = file.split('.')
  const ContentType = 'image/'+ext[1]
  uploadParams.ContentType = ContentType

  // call S3 to retrieve upload file to specified bucket
  s3.upload(uploadParams, function (err, data) {
    if (err) {
      console.log("Error", err)
    } if (data) {
      console.log("Upload Success", data.Location);
    }
  })
}

async function AWSDeleteFile(fileName) {
  var params = {
    Bucket: bucket,
    Key: fileName
  };
  await s3.deleteObject(params, function (err, data) {
    if (err) {
      console.log(err, err.stack)
      throw Error(err)
    }
    else {
      console.log(data)
    }
  });
}



module.exports = { AWSlistObjects, AWSuploadFile, AWSDeleteFile, s3URL }