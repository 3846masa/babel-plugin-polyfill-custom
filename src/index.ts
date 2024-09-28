import type { NodePath, types as t } from '@babel/core';
import defineProvider from '@babel/helper-define-polyfill-provider';

import { SOURCE_TYPE_COMMONJS, SOURCE_TYPE_MODULE } from './constants';
import { createPolyfillTargets } from './create_polyfill_targets';
import { generateProviderImportAST } from './generate_provider_import_ast';
import { InjectActionCache } from './inject_action_cache';
import { isPolyfillId } from './is_polyfill_id';
import type { PluginOptions, SourceType } from './types';

export default defineProvider<PluginOptions>((api, pluginOptions) => {
  return {
    entryGlobal(meta, _utils, path) {
      if (meta.kind !== 'import' || !isPolyfillId(meta.source)) {
        return;
      }

      const polyfill = pluginOptions.polyfills[meta.source];

      if (polyfill == null || !api.shouldInjectPolyfill(meta.source)) {
        api.debug(null);
        path.remove();
        return;
      }

      const program = path.findParent((p) => p.isProgram()) as NodePath<t.Program>;
      const insertActionCache = InjectActionCache.getInstance({ program });
      const sourceType: SourceType = path.isImportDeclaration() ? SOURCE_TYPE_MODULE : SOURCE_TYPE_COMMONJS;

      for (const packageOptions of polyfill.packages) {
        insertActionCache.inject([{ packageOptions, sourceType }], ({ packageOptions, sourceType }) => {
          api.debug(packageOptions.packageName);
          path.insertBefore(generateProviderImportAST({ packageOptions, sourceType }));
        });
      }

      path.remove();
    },
    name: 'custom',
    polyfills: createPolyfillTargets(pluginOptions),
  };
});
