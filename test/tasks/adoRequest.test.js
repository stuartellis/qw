'use strict';

const assert = require('assert');
const path = require('path');

const nockBack = require('nock').back;

const { ado: adoService } = require('../../config/services/ado');
const { adoRequest } = require('../../src/tasks');

describe('adoRequest#get()', function() {
  it('should return a list of pipelines', async function() {
    const userToken = process.env['AZURE_DEVOPS_EXT_PAT'];
    const urlTemplate = 'https://dev.azure.com/{organization}/{project}/_apis/pipelines?api-version=6.1-preview.1';
    const templateValues = adoService;
    const onError = (err) => { return Promise.reject(err); };
    const onSuccess = (resp) => { return resp; };

    nockBack.fixtures = path.join(__dirname, 'fixtures', 'nock', 'adoRest');

    return nockBack('pipeline-inventory.json').then(({ nockDone }) => {
      return adoRequest.get(userToken, urlTemplate, templateValues, onError, onSuccess)
        .then((resp) => {
          return assert.strictEqual(resp.status, 200);
        }).then(nockDone);
    });
  });

  it('should return a list of releases', async function() {
    const userToken = process.env['AZURE_DEVOPS_EXT_PAT'];
    const urlTemplate = 'https://vsrm.dev.azure.com/{organization}/{project}/_apis/release/releases?api-version=6.0';
    const templateValues = adoService;
    const onError = (err) => { return Promise.reject(err); };
    const onSuccess = (resp) => { return resp; };

    nockBack.fixtures = path.join(__dirname, 'fixtures', 'nock', 'adoRest');

    return nockBack('release-inventory.json').then(({ nockDone }) => {
      return adoRequest.get(userToken, urlTemplate, templateValues, onError, onSuccess)
        .then((resp) => {
          return assert.strictEqual(resp.status, 200);
        }).then(nockDone);
    });
  });

  it('should return a list of repositories', async function() {
    const userToken = process.env['AZURE_DEVOPS_EXT_PAT'];
    const urlTemplate = 'https://dev.azure.com/{organization}/{project}/_apis/git/repositories?api-version=6.0&includeLinks=true';
    const templateValues = adoService;
    const onError = (err) => { return Promise.reject(err); };
    const onSuccess = (resp) => { return resp; };

    nockBack.fixtures = path.join(__dirname, 'fixtures', 'nock', 'adoRest');

    return nockBack('repo-inventory.json').then(({ nockDone }) => {
      return adoRequest.get(userToken, urlTemplate, templateValues, onError, onSuccess)
        .then((resp) => {
          return assert.strictEqual(resp.status, 200);
        }).then(nockDone);
    });
  });
    
});
