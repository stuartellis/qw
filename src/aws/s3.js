'use strict';

/**
 * @module aws/s3
*/

const { S3, HeadBucketCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

/**
 * Returns an AWS S3 client.
 * @param {string} region - AWS region
 * @return {S3} AWS SDK S3 client
*/
function client(region) {
  return new S3({region: region});
}

/**
 * Tests whether S3 bucket exists and can be accessed.
 * @param {S3} client - AWS SDK S3 client
 * @param {string} bucketName - Name of S3 bucket
 * @return {Number} HTTP status code for bucket
*/
async function bucketStatus(client, bucketName) {
  const basicBucketParams = {
    Bucket: bucketName
  };
  const headBucketCommand = new HeadBucketCommand(basicBucketParams);
  try {
    const query = await client.send(headBucketCommand);
    if (query.$metadata && query.$metadata.httpStatusCode) {
      return query.$metadata.httpStatusCode;
    } else {
      Promise.reject(new Error(`Failed to get status of ${bucketName}`));
    }
  } catch (error) {
    if (error.$metadata && error.$metadata.httpStatusCode) {
      return error.$metadata.httpStatusCode;
    } else {
      error.message = 'Failed to query AWS';
      return Promise.reject(error);
    }
  }
}

/**
 * Lists all of the objects in an S3 bucket.
 * This handles pagination.
 * @param {S3} client - AWS SDK S3 client
 * @param {string} bucketName - Name of S3 bucket
 * @param {string} data - Previous list of objects
 * @param {} continuationToken - AWS request token for paginated request
 * @return {Array} List of objects
*/
async function listAllObjects(client, bucketName, data = [], continuationToken = undefined) {
  const params = {Bucket: bucketName, ContinuationToken: continuationToken};
  const listCommand = new ListObjectsV2Command(params);
  const response = await client.send(listCommand);
  if (response.Contents) {
    data.push(...response.Contents);
  }
  if (response.IsTruncated) {
    return this.listAllObjects(client, bucketName, data, response.NextContinuationToken);
  }
  return data;
}

module.exports = { client, bucketStatus, listAllObjects };
