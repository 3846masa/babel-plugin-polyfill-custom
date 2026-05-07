import { configs as sharedConfigs } from '@3846masa/configs/eslint';

/** @type {import('eslint').Linter.Config[]} */
const configs = [
  {
    ignores: ['lib/', 'examples/'],
  },
  ...sharedConfigs,
  {
    rules: {
      'import-x/no-unresolved': [
        'error',
        {
          ignore: ['^polyfill:'],
        },
      ],
      'import-x/order': [
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
