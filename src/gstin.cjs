const { parsePan } = require('pan-card-validator');

// Public spec: 2 state code + 10-char PAN + 1 entity number + 'Z' + 1 checksum.
const GSTIN_PATTERN = /^([0-9]{2})([A-Z]{5}[0-9]{4}[A-Z])([1-9A-Z])(Z)([0-9A-Z])$/;
const CHECKSUM_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Published by the GST Network (as of 2026); code 97/99 reserved for
// centralized/other jurisdictions not tied to a single state.
const STATE_CODES = {
  '01': 'Jammu and Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  10: 'Bihar',
  11: 'Sikkim',
  12: 'Arunachal Pradesh',
  13: 'Nagaland',
  14: 'Manipur',
  15: 'Mizoram',
  16: 'Tripura',
  17: 'Meghalaya',
  18: 'Assam',
  19: 'West Bengal',
  20: 'Jharkhand',
  21: 'Odisha',
  22: 'Chattisgarh',
  23: 'Madhya Pradesh',
  24: 'Gujarat',
  25: 'Daman and Diu',
  26: 'Dadra and Nagar Haveli',
  27: 'Maharashtra',
  28: 'Andhra Pradesh',
  29: 'Karnataka',
  30: 'Goa',
  31: 'Lakshadweep',
  32: 'Kerala',
  33: 'Tamil Nadu',
  34: 'Puducherry',
  35: 'Andaman and Nicobar Islands',
  36: 'Telangana',
  37: 'Andhra Pradesh (New)',
  38: 'Ladakh',
  97: 'Other Territory',
};

function normalize(input) {
  return typeof input === 'string' ? input.trim().toUpperCase() : '';
}

function computeChecksum(gstinBody) {
  let factor = 2;
  let sum = 0;
  const mod = CHECKSUM_CHARS.length;

  for (let i = gstinBody.length - 1; i >= 0; i--) {
    const codePoint = CHECKSUM_CHARS.indexOf(gstinBody[i]);
    let digit = factor * codePoint;
    digit = Math.floor(digit / mod) + (digit % mod);
    sum += digit;
    factor = factor === 2 ? 1 : 2;
  }

  const checksumIndex = (mod - (sum % mod)) % mod;
  return CHECKSUM_CHARS[checksumIndex];
}

/**
 * Parses a GSTIN into its structural components, verifying its checksum
 * digit and the embedded PAN's structure.
 * @param {string} input
 * @returns {{
 *   valid: boolean,
 *   gstin?: string,
 *   stateCode?: string,
 *   stateName?: string,
 *   pan?: string,
 *   panEntityType?: string,
 *   registrationNumber?: string,
 *   checkDigit?: string,
 * }}
 */
function parseGstin(input) {
  const gstin = normalize(input);
  const match = GSTIN_PATTERN.exec(gstin);

  if (!match) {
    return { valid: false };
  }

  const [, stateCode, pan, registrationNumber, , checkDigit] = match;

  if (!(stateCode in STATE_CODES)) {
    return { valid: false };
  }

  if (computeChecksum(gstin.slice(0, 14)) !== checkDigit) {
    return { valid: false };
  }

  const panInfo = parsePan(pan);
  if (!panInfo.valid) {
    return { valid: false };
  }

  return {
    valid: true,
    gstin,
    stateCode,
    stateName: STATE_CODES[stateCode] ?? null,
    pan,
    panEntityType: panInfo.entityType,
    registrationNumber,
    checkDigit,
  };
}

/**
 * Validates a GSTIN's format, checksum, and embedded PAN structure.
 * @param {string} input
 * @returns {boolean}
 */
function isValidGstin(input) {
  return parseGstin(input).valid;
}

module.exports = { isValidGstin, parseGstin };
