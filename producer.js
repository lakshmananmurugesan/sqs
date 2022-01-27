const aws = require('aws-sdk');
const uuid = require('uuid');
const splitArray = require('split-array');

aws.config.loadFromPath(__dirname + '/config.json');

const sqs = new aws.SQS();

const queueMessages = async function (messages, queueUrl) {
  try {
    // only 10 messages can be queued to SQS at one time, hence
    // we break our messages into chunks of 10 messages.
    let response;
    const splittedArray = splitArray(messages, 10);
    for (const arr of splittedArray) {
      const params = {
        QueueUrl: queueUrl,
        Entries: []
      };
      arr.forEach(message => {
        params.Entries.push({
          // Id is a unique ID assigned to each message
          // read more about how Id is used in AWS's documentation
          Id: uuid.v4(),
          MessageBody: JSON.stringify(message)
        });
      });
      response = await sqs.sendMessageBatch(params).promise()
    }
    return response;
  } catch (e) {
    throw new Error(e.message)
  }
};

async function start () {
  console.log('-- Producer/Scheduler started --');
  const messages = [];
  // iterate account id
  for (let i=1; i<=10; i++) {
    // looping with region, queue url, 4accounts*16*200services
    messages.push({
      account: `account_${i}`,
      type: 'AWS:Lambda:*',
      region: 'us-east-1'
    })
  }
  const response = await queueMessages(messages, queue[region]);
  console.log('response\n', response.Successful.map((item) => item.MessageId).join('\n'));
}

start();
