import { expect, it } from '@jest/globals';
import { transformAsync } from '@babel/core';
import dedent from 'dedent';

import plugin from '../index';

it('replace require("polyfill:{feature-name}") to require("{polyfill-library}")', async () => {
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
    require('polyfill:abort-controller');
    const controller = new AbortController();
  `;
  const actual = (await transformAsync(input, config))?.code;
  expect(actual).toBe(dedent/* JavaScript */ `
    require("abort-controller/polyfill");
    const controller = new AbortController();
  `);
});

it('when define "definitions" fields, replace require("polyfill:{feature-name}") to require("data:application/javascript;base64,{base64}")', async () => {
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
    require('polyfill:promise');
    Promise.resolve('Hello world.');
  `;
  const actual = (await transformAsync(input, config))?.code;
  expect(actual).toBe(dedent/* JavaScript */ `
    require("data:text/javascript;base64,dmFyIF9faW1wb3J0RGVmYXVsdD1mdW5jdGlvbihtb2Qpe3JldHVybiBtb2QmJm1vZC5fX2VzTW9kdWxlP21vZDp7ImRlZmF1bHQiOm1vZH19O3ZhciBfX2RlZmF1bHQ9X19pbXBvcnREZWZhdWx0KHJlcXVpcmUoInpvdXNhbiIpKVsiZGVmYXVsdCJdO3ZhciBfX2dsb2JhbD1mdW5jdGlvbigpe3JldHVybiB0eXBlb2YgZ2xvYmFsVGhpcyE9PSJ1bmRlZmluZWQiP2dsb2JhbFRoaXM6dHlwZW9mIHNlbGYhPT0idW5kZWZpbmVkIj9zZWxmOnR5cGVvZiB3aW5kb3chPT0idW5kZWZpbmVkIj93aW5kb3c6dHlwZW9mIGdsb2JhbCE9PSJ1bmRlZmluZWQiP2dsb2JhbDpGdW5jdGlvbigicmV0dXJuIHRoaXMiKSgpfSgpO19fZ2xvYmFsLlByb21pc2U9X19kZWZhdWx0Ow==");
    Promise.resolve('Hello world.');
  `);
});

it('when targets support featues, remove require("polyfill:{feature-name}")', async () => {
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
    require('polyfill:promise');
    Promise.resolve('Hello world.');
  `;
  const actual = (await transformAsync(input, config))?.code;
  expect(actual).toBe(dedent/* JavaScript */ `
    Promise.resolve('Hello world.');
  `);
});
