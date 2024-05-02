import { configs as sharedConfigs } from '@3846masa/configs/eslint/config.mjs';

/** @type {import('eslint').Linter.FlatConfig[]} */
const configs = [
  {
    ignores: ['lib/', 'examples/'],
  },
  ...sharedConfigs,
  {
    rules: {
      // FIXME: https://github.com/import-js/eslint-plugin-import/issues/2948
      'import/namespace': ['off'],
      'import/no-unresolved': [
        'error',
        {
          ignore: ['^polyfill:'],
        },
      ],
      'import/order': [
        'error',
        {
          pathGroups: [
            {
              group: 'external',
              pattern: '@mdn/browser-compat-data',
            },
          ],
        },
      ],
    },
  },
];

export default configs;
