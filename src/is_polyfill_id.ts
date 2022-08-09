import type { PolyfillId } from './types';

export function isPolyfillId(str: string): str is PolyfillId {
  return str.startsWith('polyfill:');
}
