'use strict';

const assert = require('assert');
const { csv } = require('../../src/formats');

describe('csv#fromArray()', function() {
  it('should return Array of Objects in CSV format', function() {

    const items = [
      {
        id: 'b1e42bd0-49f6-4b57-8ade-5e1c25fbe8a2',
        name: 'nuklear',
        url: 'https://dev.azure.com/sjellis/83cd6f64-aa0d-4908-b163-3e3136cf8a97/_apis/git/repositories/b1e42bd0-49f6-4b57-8ade-5e1c25fbe8a2'
      }, 
      {
        id: '2b7de62f-781c-44b5-9ff8-e04b67045130',
        name: 'multiplicity',
        url: 'https://dev.azure.com/sjellis/83cd6f64-aa0d-4908-b163-3e3136cf8a97/_apis/git/repositories/2b7de62f-781c-44b5-9ff8-e04b67045130'
      }
    ];

    const itemsAsCsv = 'id,name,url\r\n"b1e42bd0-49f6-4b57-8ade-5e1c25fbe8a2","nuklear","https://dev.azure.com/sjellis/83cd6f64-aa0d-4908-b163-3e3136cf8a97/_apis/git/repositories/b1e42bd0-49f6-4b57-8ade-5e1c25fbe8a2"\r\n"2b7de62f-781c-44b5-9ff8-e04b67045130","multiplicity","https://dev.azure.com/sjellis/83cd6f64-aa0d-4908-b163-3e3136cf8a97/_apis/git/repositories/2b7de62f-781c-44b5-9ff8-e04b67045130"';
    assert.strictEqual(csv.fromArray(items), itemsAsCsv);
  });

  describe('csv#fromObject()', function() {
    it('should return Object in CSV format', function() {
  
      const item = {
        id: 'b1e42bd0-49f6-4b57-8ade-5e1c25fbe8a2',
        name: 'nuklear',
        url: 'https://dev.azure.com/sjellis/83cd6f64-aa0d-4908-b163-3e3136cf8a97/_apis/git/repositories/b1e42bd0-49f6-4b57-8ade-5e1c25fbe8a2'
      };
  
      const itemAsCsv = 'id,name,url\r\n"b1e42bd0-49f6-4b57-8ade-5e1c25fbe8a2","nuklear","https://dev.azure.com/sjellis/83cd6f64-aa0d-4908-b163-3e3136cf8a97/_apis/git/repositories/b1e42bd0-49f6-4b57-8ade-5e1c25fbe8a2"';
      assert.strictEqual(csv.fromObject(item), itemAsCsv);
    });
  });
    
});
