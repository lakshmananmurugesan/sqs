const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');

// Configure the region
AWS.config.update({region: 'us-east-1'});

// Create an SQS service object
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const queueUrl = process.env['SQS_URL'];

let categoryData = {
    name: 'Advertising',
    id: '123',
    Action: 'QUESTION_CATEGORY_UPDATE',
    service: 'Question'
}

let sqsData = {
    MessageAttributes: {
      "categoryName": {
        DataType: "String",
        StringValue: categoryData.name
      },
      "categoryId": {
        DataType: "String",
        StringValue: categoryData.id
      }
    },
    MessageBody: JSON.stringify(categoryData),
    MessageGroupId: "CategoryUpdate",
    MessageDeduplicationId: uuidv4(),
    QueueUrl: queueUrl
};

// Send the order data to the SQS queue
let sendSqsMessage = sqs.sendMessage(sqsData).promise();

sendSqsMessage.then((data) => {
    console.log(`CategoryUpdate SQS | SUCCESS: ${data.MessageId}`);
}).catch((err) => {
    console.log(`CategoryUpdate SQS | ERROR: ${err}`);
});