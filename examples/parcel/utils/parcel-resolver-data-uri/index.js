const crypto = require('node:crypto');
const path = require('node:path');

const { Resolver } = require('@parcel/plugin');
const parseDataURL = require('data-urls');

const DataURIResolver = new Resolver({
  async resolve({ dependency, specifier }) {
    if (specifier.startsWith('data:') === false) {
      return null;
    }

    const parsed = parseDataURL(specifier);
    if (parsed.mimeType.isJavaScript() === false) {
      return null;
    }

    const code = Buffer.from(parsed.body).toString('utf-8');
    const sha256 = crypto.createHash('sha256').update(parsed.body).digest('hex');
    const filePath = path.resolve(path.dirname(dependency.resolveFrom), `data-${sha256}.js`);
    return {
      code,
      filePath,
    };
  },
});

module.exports.default = DataURIResolver;
