'use strict';

const assert = require('assert');
const { hbTemplate } = require('../../src/formats');

describe('hbTemplate#capitalize()', function() {
  it('should return lowercase string with initial caps', function() {
    const inputString = 'aardvark';
    const expectedString = 'Aardvark';
    const actualString = hbTemplate.capitalize(inputString);
    assert.strictEqual(actualString, expectedString);
  });
});
