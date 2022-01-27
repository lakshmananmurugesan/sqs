const AWS = require('aws-sdk');
const https = require('https');
const { Consumer } = require('sqs-consumer');

AWS.config.loadFromPath(__dirname + '/config.json');
const sqs = new AWS.SQS();

const createConsumer = function (queueUrl, batchSize, handler) {
    return Consumer.create({
        queueUrl: queueUrl,
        batchSize: 5,
        handleMessageBatch: handler,
        sqs: new AWS.SQS({
            httpOptions: {
                agent: new https.Agent({
                    keepAlive: true
                })
            }
        })
    })
};

const doThisWithMessages = function (messages) {
    // process messages in this function
    // caught and create new messages in another queue
    console.log('messages', messages);
    if (messages && Object.keys(messages).length) {
        for (const message of messages) {
            const deleteParams = {
                QueueUrl: 'https://sqs.us-west-1.amazonaws.com/630223858646/MyFirstQueue',
                ReceiptHandle: message.ReceiptHandle
            };
            sqs.deleteMessage(deleteParams, (err, data) => {
                if (err) {
                    console.log(err, err.stack);
                } else {
                    console.log(`Successfully deleted message from queue - ${message.MessageId}`);
                }
            });
        }
    }
};

const sampleConsumer = createConsumer(
  "https://sqs.us-west-1.amazonaws.com/630223858646/MyFirstQueue", // URL of the queue to consume
  10, // batch size -- number of messages to consume at once, <=10
  doThisWithMessages // handler for messages
);

sampleConsumer.start();
console.log('-- Consumer started --');
