import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidGstin, parseGstin } from '../src/index.js';

// Synthetic, checksum-valid GSTIN built from the illustrative PAN AAAPL1234C
// (state 27 = Maharashtra, registration 1). Not a real registration.
const VALID_GSTIN = '27AAAPL1234C1ZE';

test('parseGstin accepts a well-formed, checksum-valid GSTIN', () => {
  const result = parseGstin(VALID_GSTIN);

  assert.equal(result.valid, true);
  assert.equal(result.stateCode, '27');
  assert.equal(result.stateName, 'Maharashtra');
  assert.equal(result.pan, 'AAAPL1234C');
  assert.equal(result.panEntityType, 'Individual');
  assert.equal(result.registrationNumber, '1');
  assert.equal(result.checkDigit, 'E');
});

test('parseGstin is case-insensitive and trims whitespace', () => {
  const result = parseGstin(`  ${VALID_GSTIN.toLowerCase()}  `);
  assert.equal(result.valid, true);
  assert.equal(result.gstin, VALID_GSTIN);
});

test('parseGstin rejects an incorrect checksum digit', () => {
  const tampered = VALID_GSTIN.slice(0, 14) + 'A';
  assert.equal(parseGstin(tampered).valid, false);
});

test('parseGstin rejects an invalid state code', () => {
  const tampered = '99' + VALID_GSTIN.slice(2);
  assert.equal(parseGstin(tampered).valid, false);
});

test('parseGstin rejects a malformed embedded PAN', () => {
  // 4th PAN character 'D' is not a valid holder-category code.
  const tampered = '27AAADL1234C1ZZ';
  assert.equal(parseGstin(tampered).valid, false);
});

test('parseGstin rejects wrong length', () => {
  assert.equal(parseGstin(VALID_GSTIN.slice(0, 14)).valid, false);
  assert.equal(parseGstin(VALID_GSTIN + 'X').valid, false);
});

test('isValidGstin returns a plain boolean', () => {
  assert.equal(isValidGstin(VALID_GSTIN), true);
  assert.equal(isValidGstin('not-a-gstin'), false);
});
