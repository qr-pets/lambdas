/* eslint-disable import/no-dynamic-require */

require('dotenv').config({ path: '../../.env' });

const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');

const packageJSONPath = `${path.resolve()}/package.json`;
const packageJSON = require(packageJSONPath);

const {
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  AWS_REGION,
  LAMBDA_ROLE,
} = process.env;

const createNewLambda = async (lambda, lambdaName, zipPath) => {
  try {
    await lambda.createFunction({
      Code: {
        ZipFile: fs.readFileSync(zipPath),
      },
      FunctionName: lambdaName,
      Handler: 'index.default',
      Role: LAMBDA_ROLE,
      Runtime: 'nodejs10.x',
      Timeout: 15,
    }).promise();
  } catch (error) {
    console.error(`Could not save ${lambdaName}, ${JSON.stringify(error)}`);
    process.exit(1);
  }
};

const updateExistingLambda = async (lambda, lambdaName, zipPath) => {
  await lambda.getFunction({
    FunctionName: lambdaName,
  }).promise();

  await lambda.updateFunctionCode({
    FunctionName: lambdaName,
    ZipFile: fs.readFileSync(zipPath),
  }).promise();
};

(async () => {
  const lambdaName = packageJSON.name;
  const lambda = new AWS.Lambda({
    apiVersion: '2015-03-31',
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    region: AWS_REGION,
  });

  const zipPath = `${path.resolve()}/dist/archive.zip`;

  try {
    await updateExistingLambda(lambda, lambdaName, zipPath);
  } catch (error) {
    if (error.code === 'ResourceNotFoundException') {
      await createNewLambda(lambda, lambdaName, zipPath);
    } else {
      console.error(`Could not save ${lambdaName}, ${JSON.stringify(error)}`);
      process.exit(1);
    }
  }
})();
