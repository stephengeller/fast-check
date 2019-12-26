import { Random } from '../../random/generator/Random.js';
import { Stream } from '../../stream/Stream.js';
import { stringify } from '../../utils/stringify.js';
import { cloneMethod } from '../symbols.js';
import { Arbitrary } from './definition/Arbitrary.js';
import { biasWrapper } from './definition/BiasedArbitraryWrapper.js';
import { Shrinkable } from './definition/Shrinkable.js';

class StreamArbitrary<T> extends Arbitrary<Stream<T>> {
  constructor(readonly arb: Arbitrary<T>) {
    super();
  }
  generate(mrng: Random): Shrinkable<Stream<T>> {
    const g = function*(arb: Arbitrary<T>, clonedMrng: Random) {
      while (true) yield arb.generate(clonedMrng).value_;
    };
    const producer = () => new Stream(g(this.arb, mrng.clone()));
    const toString = () =>
      `Stream(${[
        ...producer()
          .take(10)
          .map(stringify)
      ].join(',')}...)`;
    const enrichedProducer = () => Object.assign(producer(), { toString, [cloneMethod]: enrichedProducer });
    return new Shrinkable(enrichedProducer());
  }
  withBias(freq: number): Arbitrary<Stream<T>> {
    return biasWrapper(freq, this, () => new StreamArbitrary(this.arb.withBias(freq)));
  }
}

/**
 * Produce an infinite stream of values
 *
 * WARNING: Requires Object.assign
 *
 * @param arb Arbitrary used to generate the values
 */
function infiniteStream<T>(arb: Arbitrary<T>): Arbitrary<Stream<T>> {
  return new StreamArbitrary(arb);
}

export { infiniteStream };
