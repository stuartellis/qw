'use strict';

const assert = require('assert');
const { timestamp } = require('../../src/formats');

describe('timestamp#fromDate()', function() {
  it('should return Date as YYYYMMDDHHMM string without separator', function() {
    const dt = new Date('2021-01-01T01:01:01');
    const expectedString = '202101010101';
    assert.strictEqual(timestamp.fromDate(dt), expectedString);
  });

  it('should return Date as YYYY/MM/DD/HH/MM string with \'/\' separator', function() {
    const dt = new Date('2021-01-01T01:01:01');
    const expectedString = '2021/01/01/01/01';
    assert.strictEqual(timestamp.fromDate(dt, '/'), expectedString);
  });

});
