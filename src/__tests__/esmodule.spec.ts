import { expect, it } from '@jest/globals';
import { transformAsync } from '@babel/core';
import dedent from 'dedent';

import plugin from '../index';

it('replace import "polyfill:{feature-name}" to import "{polyfill-library}"', async () => {
  const config: import('@babel/core').TransformOptions = {
    plugins: [
      [
        plugin,
        {
          method: 'entry-global',
          polyfills: {
            'polyfill:abort-controller': {
              features: ['api.AbortController'],
              packages: [
                {
                  packageName: 'abort-controller/polyfill',
                },
              ],
            },
          },
        },
      ],
    ],
    sourceType: 'unambiguous',
    targets: 'ie 11',
  };

  const input = dedent/* JavaScript */ `
    import 'polyfill:abort-controller';
    const controller = new AbortController();
  `;
  const actual = (await transformAsync(input, config))?.code;
  expect(actual).toBe(dedent/* JavaScript */ `
    import "abort-controller/polyfill";
    const controller = new AbortController();
  `);
});

it('when define "definitions" fields, replace import "polyfill:{feature-name}" to import "data:application/javascript;base64,{base64}"', async () => {
  const config: import('@babel/core').TransformOptions = {
    plugins: [
      [
        plugin,
        {
          method: 'entry-global',
          polyfills: {
            'polyfill:promise': {
              features: ['javascript.builtins.Promise'],
              packages: [
                {
                  definitions: {
                    ['Promise']: 'default',
                  },
                  packageName: 'zousan',
                },
              ],
            },
          },
        },
      ],
    ],
    sourceType: 'unambiguous',
    targets: 'ie 11',
  };

  const input = dedent/* JavaScript */ `
    import 'polyfill:promise';
    Promise.resolve('Hello world.');
  `;
  const actual = (await transformAsync(input, config))?.code;
  expect(actual).toBe(dedent/* JavaScript */ `
    import "data:text/javascript;base64,aW1wb3J0e2RlZmF1bHQgYXMgX19kZWZhdWx0fWZyb20iem91c2FuIjt2YXIgX19nbG9iYWw9ZnVuY3Rpb24oKXtyZXR1cm4gdHlwZW9mIGdsb2JhbFRoaXMhPT0idW5kZWZpbmVkIj9nbG9iYWxUaGlzOnR5cGVvZiBzZWxmIT09InVuZGVmaW5lZCI/c2VsZjp0eXBlb2Ygd2luZG93IT09InVuZGVmaW5lZCI/d2luZG93OnR5cGVvZiBnbG9iYWwhPT0idW5kZWZpbmVkIj9nbG9iYWw6RnVuY3Rpb24oInJldHVybiB0aGlzIikoKX0oKTtfX2dsb2JhbC5Qcm9taXNlPV9fZGVmYXVsdDs=";
    Promise.resolve('Hello world.');
  `);
});

it('when targets support featues, remove import "polyfill:{feature-name}"', async () => {
  const config: import('@babel/core').TransformOptions = {
    plugins: [
      [
        plugin,
        {
          method: 'entry-global',
          polyfills: {
            'polyfill:promise': {
              features: ['javascript.builtins.Promise'],
              packages: [
                {
                  definitions: {
                    ['Promise']: 'default',
                  },
                  packageName: 'zousan',
                },
              ],
            },
          },
        },
      ],
    ],
    sourceType: 'unambiguous',
    targets: 'Chrome 100',
  };

  const input = dedent/* JavaScript */ `
    import 'polyfill:promise';
    Promise.resolve('Hello world.');
  `;
  const actual = (await transformAsync(input, config))?.code;
  expect(actual).toBe(dedent/* JavaScript */ `
    Promise.resolve('Hello world.');
  `);
});
