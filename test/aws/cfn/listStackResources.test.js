'use strict';

const assert = require('assert');

const { CloudFormationClient: cfnClient, ListStackResourcesCommand } = require('@aws-sdk/client-cloudformation');
const { mockClient } = require('aws-sdk-client-mock');

const { cfn } = require('../../../src/aws');

describe('cfn#listStackResources()', function() {
  const cfnMock = mockClient(cfnClient);

  beforeEach(function () {
    cfnMock.reset();
  });

  it('should return Array of resources', async function() {
    const stackName = 'example-stack-0001';

    cfnMock.on(ListStackResourcesCommand)
      .resolves({
        '$metadata': {
          httpStatusCode: 200,
          requestId: '33ff6b2f-e09c-4973-a4d1-d30cf11ad813',
          extendedRequestId: undefined,
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0
        },
        StackResourceSummaries: [
          {
            LogicalResourceId: 'Bucket',
            PhysicalResourceId: 'sje-test-archive-eu-west-1',
            ResourceType: 'AWS::S3::Bucket',
            LastUpdatedTimestamp: new Date('2021-10-28T06:36:59.266Z'),
            ResourceStatus: 'CREATE_COMPLETE',
            ResourceStatusReason: undefined,
            DriftInformation: {
              StackResourceDriftStatus: 'NOT_CHECKED',
              LastCheckTimestamp: undefined
            },
            ModuleInfo: undefined
          }
        ],
        NextToken: undefined
      });
    
    const resp = await cfn.listStackResources(cfnMock, stackName);
    return assert.strictEqual(resp.length, 1);
  });

});
