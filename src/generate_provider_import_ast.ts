import { template, types as t } from '@babel/core';

import { SOURCE_TYPE_COMMONJS } from './constants';
import { generateProviderDataURI } from './generate_provider_data_uri';
import type { PackageOptions, SourceType } from './types';

type Params = {
  packageOptions: PackageOptions;
  sourceType: SourceType;
};

export function generateProviderImportAST({
  packageOptions: { definitions, packageName },
  sourceType,
}: Params): t.Statement {
  const packagePath =
    definitions != null ? generateProviderDataURI({ definitions, packageName, sourceType }) : packageName;

  if (sourceType === SOURCE_TYPE_COMMONJS) {
    return template.statement(`
      require(%%package_path%%);
    `)({
      package_path: t.stringLiteral(packagePath),
    });
  } else {
    return template.statement(`
      import %%package_path%%;
    `)({
      package_path: t.stringLiteral(packagePath),
    });
  }
}
