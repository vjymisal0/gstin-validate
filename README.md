# @vijayishere/gstin-validate

Validate and parse Indian GSTIN numbers - real checksum verification, state-code lookup, and the embedded PAN, all offline.

## Install

```bash
npm install @vijayishere/gstin-validate
```

## Usage

```js
import { isValidGstin, parseGstin } from '@vijayishere/gstin-validate';

isValidGstin('27AAAPL1234C1ZE'); // true
isValidGstin('not-a-gstin');     // false

parseGstin('27AAAPL1234C1ZE');
// {
//   valid: true,
//   gstin: '27AAAPL1234C1ZE',
//   stateCode: '27',
//   stateName: 'Maharashtra',
//   pan: 'AAAPL1234C',
//   panEntityType: 'Individual',
//   registrationNumber: '1',
//   checkDigit: 'E',
// }

parseGstin('not-a-gstin'); // { valid: false }
```

## What this validates

A GSTIN is 15 characters: `SSPPPPPPPPPPPCZC`

| Position | Meaning |
|---|---|
| 1-2 | State code |
| 3-12 | Embedded PAN |
| 13 | Registration number for this PAN within the state |
| 14 | Reserved, always `Z` |
| 15 | Checksum digit (mod-36) |

This library checks, all offline:

- **Format**: matches the 15-character structure above
- **State code**: must be a real, currently-assigned GST state/UT code (not just any two digits)
- **Checksum**: recomputes the mod-36 check digit and confirms it matches - this catches typos that a regex alone would miss
- **Embedded PAN**: delegates to [`@vijayishere/pan-validator`](https://www.npmjs.com/package/@vijayishere/pan-validator) to confirm the embedded PAN has a valid structure and holder-category code

Like PAN validation, this confirms a GSTIN is *well-formed and internally consistent* - it cannot confirm the GSTIN is *actually registered*. That requires the [GST Network's own verification API](https://www.gst.gov.in/).

## License

MIT
