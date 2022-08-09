import type { ResolveOptions } from 'enhanced-resolve';

import type { SOURCE_TYPE_COMMONJS, SOURCE_TYPE_MODULE } from './constants';

export type SourceType = SOURCE_TYPE_COMMONJS | SOURCE_TYPE_MODULE;

export type PolyfillId = `polyfill:${string}`;

export type PluginOptions = {
  polyfills: PolyfillOptionsMap;
  resolveOptions: ResolveOptions;
};

export type PolyfillOptionsMap = {
  [polyfillId: PolyfillId]: PolyfillOptions;
};

export type PolyfillOptions = {
  features: string[];
  packages: PackageOptions[];
};

export type PackageOptions = {
  definitions?: {
    [exportAs: string]: string;
  };
  packageName: string;
};
