import * as fc from '../../../../lib/fast-check.js';

import { Arbitrary } from '../../../../src/check/arbitrary/definition/Arbitrary.js';
import { Shrinkable } from '../../../../src/check/arbitrary/definition/Shrinkable.js';
import { constant } from '../../../../src/check/arbitrary/ConstantArbitrary.js';
import { integer } from '../../../../src/check/arbitrary/IntegerArbitrary.js';
import { oneof } from '../../../../src/check/arbitrary/OneOfArbitrary.js';
import { Random } from '../../../../src/random/generator/Random.js';
import { stream } from '../../../../src/stream/Stream.js';

import * as genericHelper from './generic/GenericArbitraryHelper.js';

import * as stubRng from '../../stubs/generators.js';

class CustomArbitrary extends Arbitrary<number> {
  constructor(readonly value: number) {
    super();
  }
  generate(_mrng: Random): Shrinkable<number> {
    function* g(v: number) {
      yield new Shrinkable(v - 42);
    }
    return new Shrinkable(this.value, () => stream(g(this.value)));
  }
}

describe('OneOfArbitrary', () => {
  describe('oneof', () => {
    it('Should generate based on one of the given arbitraries', () =>
      fc.assert(
        fc.property(fc.integer(), fc.array(fc.integer(), 1, 10), (seed, choices) => {
          const mrng = stubRng.mutable.fastincrease(seed);
          const g = oneof(...choices.map(constant)).generate(mrng).value;
          return choices.indexOf(g) !== -1;
        })
      ));
    it('Should call the right shrink on shrink', () =>
      fc.assert(
        fc.property(fc.integer(), fc.array(fc.integer(), 1, 10), (seed, choices) => {
          const mrng = stubRng.mutable.fastincrease(seed);
          const shrinkable = oneof(...choices.map(c => new CustomArbitrary(c))).generate(mrng);
          const shrinks = [...shrinkable.shrink()];
          return shrinks.length === 1 && shrinks[0].value === shrinkable.value - 42;
        })
      ));

    genericHelper.isValidArbitrary(
      (metas: { type: string; value: number }[]) => {
        const arbs = metas.map(m => (m.type === 'unique' ? constant(m.value) : integer(m.value - 10, m.value)));
        return oneof(...arbs);
      },
      {
        seedGenerator: fc.array(fc.record({ type: fc.constantFrom('unique', 'range'), value: fc.nat() }), 1, 10),
        isValidValue: (v: number, metas: { type: string; value: number }[]) =>
          metas.findIndex(m => (m.type === 'unique' ? m.value === v : m.value - 10 <= v && v <= m.value)) !== -1,
        isStrictlySmallerValue: (a: number, b: number) => (Math.abs(b - a) <= 10 && b > 0 ? b - a > 0 : b - a < 0)
      }
    );
  });
});
