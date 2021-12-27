'use strict';

/**
 * @module aws/cfn
*/

const { CloudFormationClient: CFN, ListStacksCommand, ListStackResourcesCommand } = require('@aws-sdk/client-cloudformation');

/**
 * Returns an AWS CloudFormation client.
 * @param {string} region - AWS region
 * @return {CloudFormationClient} AWS SDK CFN client
*/
function client(region) {
  return new CFN({region: region});
}

/**
 * Lists stacks.
 * See {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudformation/enums/stackstatus.html|StackStatus enumeration} for CFN stack statuses.
 * @param {CloudFormationClient} client - AWS SDK CFN client
 * @param {string} statuses - Statuses to include
 * @return {ListStacksCommandOutput} Promise for response
*/
async function listStacks(client, statuses) {
  const params = { StackStatusFilter: statuses };
  const command = new ListStacksCommand(params);
  return client.send(command);
}

/**
 * Lists all of the resources in a CFN stack.
 * This handles pagination.
 * @param {CloudFormationClient} client - AWS SDK CFN client
 * @param {string} stackName - Name of CFN stack
 * @param {string} data - Previous list of resources
 * @param {} continuationToken - AWS request token for paginated request
 * @return {Array} List of resources
*/
async function listStackResources(client, stackName, data = [], continuationToken = undefined) {
  const params = { StackName: stackName, NextToken: continuationToken};
  const listCommand = new ListStackResourcesCommand(params);
  const response = await client.send(listCommand);
  if (response.StackResourceSummaries) {
    data.push(...response.StackResourceSummaries);
  }
  if (response.IsTruncated) {
    return this.listAllObjects(client, stackName, data, response.NextContinuationToken);
  }
  return data;
}

module.exports = { client, listStacks, listStackResources };
