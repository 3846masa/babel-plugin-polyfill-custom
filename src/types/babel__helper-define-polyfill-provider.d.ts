/* eslint-disable @typescript-eslint/no-explicit-any */

declare module '@babel/helper-define-polyfill-provider' {
  import type * as babel from '@babel/core';

  type ObjectMap<T> = { [k: string]: T };

  type Pattern = string | RegExp;

  type ProviderOptions<Opts = Record<string, unknown>> = {
    exclude?: Pattern[];
    include?: Pattern[];
  } & Opts;

  type MetaDescriptor =
    | { kind: 'import'; source: string }
    | { kind: 'global'; name: string }
    | {
        key: string;
        kind: 'property';
        object: string | null;
        placement: 'static' | 'prototype' | null;
      }
    | {
        key: string;
        kind: 'in';
        object: string | null;
        placement: 'static' | 'prototype' | null;
      };

  type ResolverPolyfills<T> = {
    global?: ObjectMap<T>;
    instance?: ObjectMap<T>;
    static?: ObjectMap<ObjectMap<T>>;
  };

  type ResolvedPolyfill<T> = {
    desc: T;
    kind: 'global' | 'static' | 'instance';
    name: string;
  };

  type ResolverFn<T> = (meta: MetaDescriptor) => void | ResolvedPolyfill<T>;

  function createMetaResolver<T>(polyfills: ResolverPolyfills<T>): ResolverFn<T>;

  type Utils = {
    injectDefaultImport(url: string, hint?: string): babel.types.Identifier;
    injectGlobalImport(url: string): void;
    injectNamedImport(url: string, name: string, hint?: string): babel.types.Identifier;
  };

  type MethodString = 'entry-global' | 'usage-global' | 'usage-pure';

  type Targets = {
    [target: string]: string;
  };

  type ProviderApi = {
    assertDependency(name: string, version?: string): void;
    babel: typeof babel & babel.ConfigAPI;
    createMetaResolver: typeof createMetaResolver;
    debug(name: string | null): void;
    getUtils(path: NodePath): Utils;
    method: MethodString;
    shouldInjectPolyfill(name: string): boolean;
    targets: Targets;
  };

  type ProviderResult = {
    entryGlobal?: (meta: MetaDescriptor, utils: Utils, path: babel.NodePath) => void;
    filterPolyfills?: (name: string) => boolean;
    name: string;
    polyfills?: string[] | { [name: string]: Targets };
    post?: babel.PluginObj['post'];
    pre?: babel.PluginObj['pre'];
    usageGlobal?: (meta: MetaDescriptor, utils: Utils, path: babel.NodePath) => void;
    usagePure?: (meta: MetaDescriptor, utils: Utils, path: babel.NodePath) => void;
    visitor?: babel.Visitor<any>;
  };

  type PolyfillProvider<Opts = Record<string, unknown>> = (
    api: ProviderApi,
    options: ProviderOptions<Opts>,
    dirname: string,
  ) => ProviderResult;

  export default function definePolyfillProvider<Options>(
    factory: PolyfillProvider<Options>,
  ): (api: object, options: babel.PluginOptions | null | undefined, dirname: string) => babel.PluginObj;
}
