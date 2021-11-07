'use strict';

const assert = require('assert');

const { ListStacksCommand, CloudFormationClient: CfnClient } = require('@aws-sdk/client-cloudformation');
const { mockClient } = require('aws-sdk-client-mock');

const { cfn } = require('../../../src/aws');

describe('cfn#listStacks()', function() {
  const cfnMock = mockClient(CfnClient);

  beforeEach(function () {
    cfnMock.reset();
  });

  it('should return list of active stacks', async function() {
    
    const statuses = ['CREATE_COMPLETE', 'UPDATE_COMPLETE'];

    cfnMock.on(ListStacksCommand)
      .resolves({
        '$metadata': {
          httpStatusCode: 200,
          requestId: '867fd26c-407f-4157-9bd3-cea7c5757002',
          extendedRequestId: undefined,
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0
        },
        StackSummaries: [
          {
            StackId: 'arn:aws:cloudformation:eu-west-1:119559809358:stack/sje-test-archive/5ff1c3c0-37b9-11ec-86c4-060d1f68173d',
            StackName: 'example-stack-0001',
            TemplateDescription: 'Example stack 0001\n',
            CreationTime: new Date('2021-10-28T06:36:26.056Z'),
            LastUpdatedTime: new Date('2021-10-28T06:36:31.381Z'),
            DeletionTime: undefined,
            StackStatus: 'CREATE_COMPLETE',
            StackStatusReason: undefined,
            ParentId: undefined,
            RootId: undefined,
            DriftInformation: {
              StackDriftStatus: 'NOT_CHECKED', 
              LastCheckTimestamp: undefined
            }
          }
        ],
        NextToken: undefined
      });
    
    const resp = await cfn.listStacks(cfnMock, statuses);
    return assert.strictEqual(resp.StackSummaries.length, 1);
  });

});
