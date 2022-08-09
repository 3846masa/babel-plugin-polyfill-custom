import { template, transformFromAstSync, types as t } from '@babel/core';

import { SOURCE_TYPE_COMMONJS } from './constants';
import type { SourceType } from './types';

type Params = {
  definitions: { [exportAs: string]: string };
  packageName: string;
  sourceType: SourceType;
};

export function generateProviderDataURI({ definitions, packageName, sourceType }: Params): string {
  const statements: t.Statement[] = [];

  if (sourceType === SOURCE_TYPE_COMMONJS) {
    statements.push(
      template.statement.ast(`
        var __importDefault = function (mod) {
          return (mod && mod.__esModule) ? mod : { "default": mod };
        };
      `),
    );
    for (const packageEntry of Object.values(definitions)) {
      statements.push(
        template.statement(`
          var %%package_entry_value%% = __importDefault(require(%%package_name%%))[%%package_entry_key%%];
        `)({
          package_entry_key: t.stringLiteral(packageEntry),
          package_entry_value: t.identifier(`__${packageEntry}`),
          package_name: t.stringLiteral(packageName),
        }),
      );
    }
  } else {
    statements.push(
      t.importDeclaration(
        Object.values(definitions).map((packageEntry) => {
          return t.importSpecifier(t.identifier(`__${packageEntry}`), t.identifier(packageEntry));
        }),
        t.stringLiteral(packageName),
      ),
    );
  }

  statements.push(
    template.statement.ast(`
      var __global = (function () {
        return typeof globalThis !== 'undefined'
          ? globalThis
          : typeof self !== 'undefined'
            ? self
            : typeof window !== 'undefined'
              ? window
              : typeof global !== 'undefined'
                ? global
                : Function('return this')();
      })();
    `),
  );

  for (const [exportAs, packageEntry] of Object.entries(definitions)) {
    statements.push(
      template.statement(`
        __global.%%export_as%% = %%package_entry%%;
      `)({
        export_as: exportAs,
        package_entry: t.identifier(`__${packageEntry}`),
      }),
    );
  }

  const result = transformFromAstSync(t.program(statements.flat()), void 0, {
    compact: true,
    minified: true,
    sourceMaps: false,
  });

  if (result == null || typeof result.code !== 'string') {
    throw new Error('Cannot generate data uri.');
  }

  const base64 = Buffer.from(result.code, 'utf-8').toString('base64');
  const dataUri = `data:text/javascript;base64,${base64}`;

  return dataUri;
}
