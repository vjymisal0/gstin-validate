export interface ParsedGstin {
  valid: boolean;
  gstin?: string;
  stateCode?: string;
  stateName?: string | null;
  pan?: string;
  panEntityType?: string;
  registrationNumber?: string;
  checkDigit?: string;
}

/**
 * Parses a GSTIN into its structural components, verifying its checksum
 * digit and the embedded PAN's structure.
 */
export function parseGstin(input: string): ParsedGstin;

/**
 * Validates a GSTIN's format, checksum, and embedded PAN structure.
 */
export function isValidGstin(input: string): boolean;
