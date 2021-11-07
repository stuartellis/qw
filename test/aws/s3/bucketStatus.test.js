'use strict';

const assert = require('assert');

const { HeadBucketCommand, S3: S3Client } = require('@aws-sdk/client-s3');
const { mockClient } = require('aws-sdk-client-mock');

const { s3 } = require('../../../src/aws');

describe('s3#bucketStatus()', function() {
  const s3Mock = mockClient(S3Client);

  beforeEach(function () {
    s3Mock.reset();
  });

  it('should return 200 if bucket is accessible', async function() {
    const bucketName = 'example-bucket-0001';
    
    s3Mock.on(HeadBucketCommand)
      .resolves({
        '$metadata': {
          httpStatusCode: 200,
          requestId: undefined,
          extendedRequestId: '6L+Et/TZ2QrKN6jpeRFhot81LymGO2DasgiVpwJiuK4DX9tIPSNw5A1e8lAjwrMmVdvAefcX/Mw=',
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0
        }
      });
    
    const resp = await s3.bucketStatus(s3Mock, bucketName);
    return assert.strictEqual(resp, 200);
  });

  it('should return 403 if bucket is not accessible', async function() {
    const bucketName = 'example-bucket-0001';
    
    s3Mock.on(HeadBucketCommand)
      .resolves({
        '$metadata': {
          httpStatusCode: 403,
          requestId: undefined,
          extendedRequestId: '6L+Et/TZ2QrKN6jpeRFhot81LymGO2DasgiVpwJiuK4DX9tIPSNw5A1e8lAjwrMmVdvAefcX/Mw=',
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0
        }
      });
    
    const resp = await s3.bucketStatus(s3Mock, bucketName);
    return assert.strictEqual(resp, 403);
  });

  it('should return 404 if bucket does not exist', async function() {
    const bucketName = 'example-bucket-0001';
    
    s3Mock.on(HeadBucketCommand)
      .resolves({
        '$metadata': {
          httpStatusCode: 404,
          requestId: undefined,
          extendedRequestId: '6L+Et/TZ2QrKN6jpeRFhot81LymGO2DasgiVpwJiuK4DX9tIPSNw5A1e8lAjwrMmVdvAefcX/Mw=',
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0
        }
      });
    
    const resp = await s3.bucketStatus(s3Mock, bucketName);
    return assert.strictEqual(resp, 404);
  });

});
