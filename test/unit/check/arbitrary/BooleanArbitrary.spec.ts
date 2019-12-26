import * as fc from '../../../../lib/fast-check.js';

import { boolean } from '../../../../src/check/arbitrary/BooleanArbitrary.js';

import * as stubRng from '../../stubs/generators.js';

describe('BooleanArbitrary', () => {
  describe('boolean', () => {
    it('Should produce true and false uniformaly', () =>
      fc.assert(
        fc.property(fc.integer(), seed => {
          const mrng = stubRng.mutable.counter(seed);
          const g1 = boolean().generate(mrng).value;
          const g2 = boolean().generate(mrng).value;
          return (g1 === true && g2 === false) || (g1 === false && g2 === true);
        })
      ));
  });
});
