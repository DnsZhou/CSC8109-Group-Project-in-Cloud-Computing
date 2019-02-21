const AWS = require('aws-sdk');
//*/ get reference to S3 client 
var s3 = new AWS.S3({
  signatureVersion: 'v4'
});

exports.handler = (event, context, callback) => {
    
    
    var params = {Bucket: "uploadbuckettestcsc8109", 
    Key: 'something.jpg',
    Expires: 36000};
    var url = s3.getSignedUrl('putObject', params, function(err, data) {

      if(err) {
          callback(null, err)
      } else {
      
          callback(null, data);
      }
    });
};

