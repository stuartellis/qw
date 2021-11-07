'use strict';

const assert = require('assert');

const { S3: S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { mockClient } = require('aws-sdk-client-mock');

const { s3 } = require('../../../src/aws');

describe('s3#listAllObjects()', function() {
  const s3Mock = mockClient(S3Client);

  beforeEach(function () {
    s3Mock.reset();
  });

  it('should return empty Array for empty bucket', async function() {
    const bucketName = 'example-bucket-0001';

    s3Mock.on(ListObjectsV2Command)
      .resolves({
        '$metadata': {
          httpStatusCode: 200,
          requestId: undefined,
          extendedRequestId: '8ZqJy6goZKasLBjAVinsU3sIOdxqq/riCPgAeJDYBWQqIM+ukq3U8JFxibM104O9k6SHSxicZrE=',
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0
        },
        CommonPrefixes: undefined,
        Contents: undefined,
        ContinuationToken: undefined,
        Delimiter: undefined,
        EncodingType: undefined,
        IsTruncated: false,
        KeyCount: 0,
        MaxKeys: 1000,
        Name: 'example-bucket-0001',
        NextContinuationToken: undefined,
        Prefix: '',
        StartAfter: undefined
      });
    
    const resp = await s3.listAllObjects(s3Mock, bucketName);
    return assert.strictEqual(resp.length, 0);
  });

});
