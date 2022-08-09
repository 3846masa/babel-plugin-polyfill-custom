import type { NodePath, types as t } from '@babel/core';
import stringify from 'fast-json-stable-stringify';

export class InjectActionCache {
  private static _instances = new WeakMap<NodePath<t.Program>, InjectActionCache>();
  private _cache: Map<string, true>;

  private constructor() {
    this._cache = new Map();
  }

  static getInstance({ program }: { program: NodePath<t.Program> }) {
    const instance = InjectActionCache._instances.get(program) ?? new InjectActionCache();
    InjectActionCache._instances.set(program, instance);
    return instance;
  }

  inject<Args extends unknown[]>(args: Args, fn: (...args: Args) => unknown) {
    const key = stringify(args);
    if (this._cache.get(key) !== true) {
      fn(...args);
    }
    this._cache.set(key, true);
  }
}
