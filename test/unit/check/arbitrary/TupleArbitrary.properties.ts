import { Arbitrary } from '../../../../src/check/arbitrary/definition/Arbitrary.js';
import { integer } from '../../../../src/check/arbitrary/IntegerArbitrary.js';
import { Random } from '../../../../src/random/generator/Random.js';

export class DummyArbitrary extends Arbitrary<string> {
  constructor(public id: number) {
    super();
  }
  generate(mrng: Random) {
    return integer()
      .generate(mrng)
      .map(v => `key${this.id}_${v}`);
  }
  withBias(freq: number) {
    return new DummyArbitrary(2 * this.id + freq);
  }
}
function dummy(id: number) {
  return new DummyArbitrary(id);
}

export { dummy };
