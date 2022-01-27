// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'REGION'});
AWS.config.loadFromPath(__dirname + '/config.json');
// Create the SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var params = {
  Attributes: {
    "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:us-west-1:630223858646:MyFirstQueue\",\"maxReceiveCount\":\"10\"}",
  },
  QueueUrl: "https://sqs.us-west-1.amazonaws.com/630223858646/MyFirstQueue"
};

sqs.setQueueAttributes(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data);
  }
});
