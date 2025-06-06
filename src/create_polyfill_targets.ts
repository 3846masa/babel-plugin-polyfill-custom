import bcd from '@mdn/browser-compat-data';
import type { BrowserName, Identifier } from '@mdn/browser-compat-data';
import get from 'lodash.get';
import semver from 'semver';

import { MDN_TO_BROWSERSLIST_MAP } from './mdn_to_browserslist_map';
import type { PluginOptions } from './types';

export function createPolyfillTargets(options: PluginOptions) {
  const polyfills: Record<string, Record<string, string>> = {};

  for (const [polyfillId, { features }] of Object.entries(options.polyfills)) {
    const targets: Record<string, string> = {};

    for (const featureId of features) {
      const compat: Identifier | undefined = get(bcd, featureId) as Identifier | undefined;
      const support = compat?.__compat?.support ?? {};

      for (const mdnBrowserName of Object.keys(support) as BrowserName[]) {
        const browser = MDN_TO_BROWSERSLIST_MAP.get(mdnBrowserName);
        if (browser == null) {
          continue;
        }

        const [statement] = [support[mdnBrowserName]].flat();
        if (statement == null || statement.flags != null) {
          continue;
        }

        const versionAdded: string | null = (() => {
          if (
            statement.version_added == null ||
            statement.version_added === false ||
            statement.version_added === 'preview'
          ) {
            return null;
          }
          if (statement.version_added === true) {
            return '1';
          }
          if (statement.version_added.startsWith('≤')) {
            return statement.version_added.slice(1);
          }
          return statement.version_added;
        })();

        const versionAddedSemver = semver.coerce(versionAdded);
        if (versionAdded == null || versionAddedSemver == null) {
          continue;
        }

        const targetVersion = targets[browser];
        const targetVersionSemver = semver.coerce(targetVersion);

        if (targetVersionSemver == null || semver.lte(targetVersionSemver, versionAddedSemver)) {
          targets[browser] = versionAdded;
        }
      }
    }

    polyfills[polyfillId] = targets;
  }

  return polyfills;
}
