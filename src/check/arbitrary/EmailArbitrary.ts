import { array } from './ArrayArbitrary.js';
import { buildLowerAlphaNumericArb } from './helpers/SpecificCharacterRange.js';
import { domain } from './HostArbitrary.js';
import { stringOf } from './StringArbitrary.js';
import { tuple } from './TupleArbitrary.js';

/**
 * For email address
 *
 * According to RFC 5322 - https://www.ietf.org/rfc/rfc5322.txt
 */
export function emailAddress() {
  const others = ['!', '#', '$', '%', '&', "'", '*', '+', '-', '/', '=', '?', '^', '_', '`', '{', '|', '}', '~'];
  const atextArb = buildLowerAlphaNumericArb(others);
  const dotAtomArb = array(stringOf(atextArb, 1, 10), 1, 5).map(a => a.join('.'));
  return tuple(dotAtomArb, domain()).map(([lp, d]) => `${lp}@${d}`);
}
