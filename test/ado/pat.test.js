'use strict';

const assert = require('assert');
const { pat } = require('../../src/ado');

describe('ado#encode()', function() {
  it('should return PAT in encoded form', function() {
    const rawPat = 'llgccsksimplr6u3oauf6c26sigyfvsfx3rmmowlmtdk2jbpf2eq';
    const encodedPat = 'OmxsZ2Njc2tzaW1wbHI2dTNvYXVmNmMyNnNpZ3lmdnNmeDNybW1vd2xtdGRrMmpicGYyZXE=';
    assert.strictEqual(pat.encode(rawPat), encodedPat);
  });
});
