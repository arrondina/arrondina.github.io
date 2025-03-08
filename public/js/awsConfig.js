const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: 'AKIA23WHT4LAMRBPL7GV',
    secretAccessKey: '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',
    region: "us-east-1"
});

const s3 = new AWS.S3();

module.exports = s3;