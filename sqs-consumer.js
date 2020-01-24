const AWS = require('aws-sdk');
const { Consumer } = require('sqs-consumer');

// Configure the region
AWS.config.update({region: 'us-east-1'});

const queueUrl = process.env['SQS_URL'];

// Create our consumer
const app = Consumer.create({
    queueUrl: queueUrl,
    handleMessage: async (message) => {
        let sqsMessage = JSON.parse(message.Body);
        console.log(message);
        // todo throwing error will not complete the queue instead it will keep in-flight mode
        //throw new Error('error');
    },
    sqs: new AWS.SQS()
});

app.on('error', (err) => {
    console.error(err.message);
});

app.on('processing_error', (err) => {
    console.error(err.message);
});

console.log('SQS service is running');
app.start();