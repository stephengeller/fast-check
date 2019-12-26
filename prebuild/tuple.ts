import { commas, iota, txCommas } from './helpers.js';

const signatureFor = (num: number, opt?: boolean): string =>
  `
        /**
         * For tuples of [${txCommas(num)}]
         */
        function tuple<${txCommas(num)}>(
                ${commas(num, v => `arb${v}${opt === true ? '?' : ''}: Arbitrary<T${v}>`)}
                )`;

const generateTuple = (num: number): string => {
  const blocks = [
    // imports
    `import { Arbitrary } from './definition/Arbitrary.js';`,
    `import { GenericTupleArbitrary } from './TupleArbitrary.generic.js';`,
    // declare all signatures
    ...iota(num).map(id => `${signatureFor(id + 1)}: Arbitrary<[${txCommas(id + 1)}]>;`),
    // declare function
    `function tuple<Ts>(...arbs: Arbitrary<Ts>[]): Arbitrary<Ts[]> {
      return new GenericTupleArbitrary(arbs);
    }`,
    // export
    `export { tuple };`
  ];

  return blocks.join('\n');
};

const simpleUnitTest = (num: number, biased: boolean): string =>
  `
        it('Should produce the same output for tuple${num} and genericTuple${biased ? ' (enforced bias)' : ''}', () => {
            const tupleArb = tuple(${commas(num, v => `dummy(${v * v})`)})${biased ? '.withBias(1)' : ''};
            const genericTupleArb = genericTuple([${commas(num, v => `dummy(${v * v})`)}])${
    biased ? '.withBias(1)' : ''
  };
            const mrng1 = stubRng.mutable.fastincrease(0);
            const mrng2 = stubRng.mutable.fastincrease(0);
            const g1 = tupleArb.generate(mrng1).value;
            const g2 = genericTupleArb.generate(mrng2).value;
            expect(g1).toEqual(g2);
        });
    `;

const generateTupleSpec = (num: number): string => {
  const blocks = [
    // imports
    `import { dummy } from './TupleArbitrary.properties.js';`,
    `import * as stubRng from '../../stubs/generators.js';`,
    `import { tuple, genericTuple } from '../../../../src/check/arbitrary/TupleArbitrary.js';`,
    // start blocks
    `describe('TupleArbitrary', () => {`,
    `    describe('tuple', () => {`,
    // units
    ...iota(num).map(id => simpleUnitTest(id + 1, false)),
    ...iota(num).map(id => simpleUnitTest(id + 1, true)),
    // end blocks
    `   });`,
    `});`
  ];

  return blocks.join('\n');
};

export { generateTuple, generateTupleSpec };
