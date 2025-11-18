# Babel Plugin Polyfill Custom

[![github sponsors](https://img.shields.io/badge/GitHub_Sponsors-Support_me_%E2%9D%A4-ff69b4.svg?&logo=github&style=flat-square)](https://github.com/sponsors/3846masa)
[![npm](https://img.shields.io/npm/v/babel-plugin-polyfill-custom.svg?logo=npm&style=flat-square)](https://www.npmjs.com/package/babel-plugin-polyfill-custom)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](./LICENSE)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

Yet another babel plugin that lets you freely customize polyfills.

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Options](#options)
- [Contributing](#contributing)
- [License](#license)

## Background

<!--
babel を経由して、polyfill を挿入する方法として、@babel/preset-env や @babel/transform-runtime などがあります。
また、最近は babel-plugin-polyfill-es-shims なども生まれ、core-js 以外の選択肢も増えました。

一方で、core-js や es-shims は ECMAScript の polyfill に特化しており、DOM API の polyfill には乏しい問題があります。

babel-plugin-polyfill-custom は、あなたがほしい任意の polyfill を設定することができます。

例えば、fetch の polyfill を挿入したいとき、あなたは whatwg-fetch を選ぶこともできますし、unfetch を選ぶこともできます。
Promise の polyfill を検討するとき、core-js 以外にも Zousan や Yaku, Aigle などの代替を選択することも可能です。

加えて、babel-plugin-polyfill-custom では、browserslist に書かれたブラウザをもとに、どの polyfill が必要であるか判別してくれます。
これは、Differencial bundle serving 手法を使うときに、大変有益です。
-->

There are several ways to insert polyfill via babel, including @babel/preset-env and @babel/transform-runtime.
Recently, babel-plugin-polyfill-es-shims and others have been created to provide more options other than core-js.

On the other hand, core-js and es-shims are specialized for ECMAScript polyfills, and there is a lack of DOM API polyfills.

**babel-plugin-polyfill-custom allows you to set any polyfills you want.**

For example, if you want to insert a polyfill for fetch, you can choose whatwg-fetch or unfetch.
When considering a polyfill for Promise, you can also choose an alternative other than core-js, such as Zousan, Yaku, or Aigle.

In addition, babel-plugin-polyfill-custom can determine which polyfill is needed based on the browsers listed in the browserslist.
This is highly beneficial when using the differencial bundle serving.

## Install

```
npm install --dev @babel/core babel-plugin-polyfill-custom
```

<!--
:warning: このプラグインは、ECMAScript の構文をトランスパイルすることはできません。もし、ECMAScript の新しい構文を使う場合は、@babel/preset-env を併用してください。
-->

:warning: This plugin cannot transpile ECMAScript syntax. If you want to use new ECMAScript syntax, please use @babel/preset-env together.

### Using with a bundler

<!--
babel-plugin-polyfill-custom は、base64 data URI を使って polyfill を挿入します。
バンドラーと合わせて使う場合、バンドラーが base64 data URI を認識できる必要があります
-->

babel-plugin-polyfill-custom inserts polyfill using base64 data URIs.
When used with a bundler, the bundler should be able to recognize base64 data URIs.

#### webpack

<!--
webpack 5.38.0 以降で、data scheme に対応しています。
`module.rules` の指定に以下を追記します。
-->

webpack 5.38.0 or later supports data scheme.

```js
const config = {
  module: {
    rules: [
      {
        mimetype: 'text/javascript',
        scheme: 'data',
        type: 'javascript/auto',
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              ...,
            },
          },
        ],
      },
    ],
  },
};
```

#### Rollup

<!--
`@rollup/plugin-data-uri` を読み込む必要があります。
-->

`@rollup/plugin-data-uri` needs to be loaded.

```js
const { babel } = require('@rollup/plugin-babel');
const dataUri = require('@rollup/plugin-data-uri');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

const config = {
  plugins: [
    babel({
      ...,
    }),
    dataUri(),
    nodeResolve(),
    commonjs(),
  ],
};
```

#### Parcel

<!--
Parcel は base64 data URI を認識する仕組みがありません。
Parcel の Resolver を自作することで、base64 data URI を認識させることができます。
-->

Parcel does not have a feature to recognize base64 data URIs.
You can create your own Parcel Resolver to recognize base64 data URIs.

See [`./examples/parcel`](./examples/parcel) for more details.

```json
{
  "extends": "@parcel/config-default",
  "resolvers": [
    // You should create resolver as parcel-resolver-data-uri.
    "parcel-resolver-data-uri",
    "@parcel/resolver-default"
  ]
}
```

## Options

<!--
より詳しい事例は、`./examples` を参照してください。
-->

You can find more examples in [`./examples`](./examples).

```js
const polyfills = {
  'polyfill:abort-controller': {
    features: ['api.AbortController'],
    packages: [
      {
        packageName: 'abort-controller/polyfill',
      },
    ],
  },
  'polyfill:fetch': {
    features: ['api.fetch', 'api.fetch.init_signal_parameter'],
    packages: [
      {
        definitions: {
          ['fetch']: 'fetch',
        },
        packageName: 'whatwg-fetch',
      },
    ],
  },
};

const config = {
  plugins: [
    [
      'polyfill-custom',
      {
        method: 'entry-global',
        polyfills,
      },
    ],
  ],
};
```

### `method`

`entry-global` is only supported.

See https://github.com/babel/babel-polyfills#injection-methods.

### `polyfills`

<!--
polyfill の定義のための Object。
Object の key は polyfill の識別子であり、import するときの package 名になります。
-->

An Object for the definition of polyfill.
A key of object is the identifier of the polyfill and is used as the package name when importing.

```js
// Source
import 'polyfill:fetch';
import 'polyfill:abort-controller';

const abortController = new AbortController();

fetch('https://example.com', {
  signal: abortController.signal,
}).then(function (res) {
  if (!res.ok) {
    throw new Error('Failed to fetch: ' + String(res.status));
  }
  console.log(res);
});
```

```js
// Transpiled
import 'data:text/javascript;base64,aW1wb3J0e2ZldGNoIGFzIF9fZmV0Y2h9ZnJvbSJ3aGF0d2ctZmV0Y2giO3ZhciBleHBvcnRzPWZ1bmN0aW9uKCl7cmV0dXJuIHR5cGVvZiBnbG9iYWxUaGlzIT09InVuZGVmaW5lZCI/Z2xvYmFsVGhpczp0eXBlb2Ygc2VsZiE9PSJ1bmRlZmluZWQiP3NlbGY6dHlwZW9mIHdpbmRvdyE9PSJ1bmRlZmluZWQiP3dpbmRvdzp0eXBlb2YgZ2xvYmFsIT09InVuZGVmaW5lZCI/Z2xvYmFsOkZ1bmN0aW9uKCJyZXR1cm4gdGhpcyIpKCl9KCk7ZXhwb3J0cy5mZXRjaD1fX2ZldGNoOw==';
import 'abort-controller/polyfill';

const abortController = new AbortController();

fetch('https://example.com', {
  signal: abortController.signal,
}).then(function (res) {
  if (!res.ok) {
    throw new Error('Failed to fetch: ' + String(res.status));
  }
  console.log(res);
});
```

### `polyfills[ID].features`

<!--
polyfill が備えている features のリスト。
@mdn/browser-compat-data の識別子を記入します。
例えば、fetch API に対応する polyfill の場合、`api.fetch` が識別子になります。
-->

A list of features that polyfill has.
Fill in the @mdn/browser-compat-data identifier.

For example, in the case of polyfill supporting the fetch API, the identifier is `api.fetch`.

### `polyfills[ID].packages`

<!--
polyfill として挿入するパッケージの定義。

`packageName` には、パッケージ名を指定します。
`definitions` には、どの export variable を何という global object として挿入するかを指定します。

`window.fetch` に `import { Aigle } from 'aigle'` を代入する場合は、左辺に `Promise` 、右辺に `Aigle` と指定します。

`Element.prototype.matches` に `import matches from '@ungap/element-matches'` を代入する場合は、左辺に `Element.prototype.matches` 、右辺に `default` と指定します。
-->

The definition of the package to be inserted as polyfill.

`packageName` is the name of the package.
`definitions` specifies which export variables are to be inserted as what global object.

```js
// To assign `import { Aigle } from 'aigle'` to `window.Promise`,
// specify `Promise` on the left side and `Aigle` on the right side.
{
  definitions: {
    ['Promise']: 'Aigle',
  },
  packageName: 'aigle',
}
```

```js
// To assign `import matches from '@ungap/element-matches'` to `Element.prototype.matches`,
// specify `Element.prototype.matches` on the left side and `default` on the right side.
{
  definitions: {
    ['Element.prototype.matches']: 'default',
  },
  packageName: '@ungap/element-matches',
}
```

## Contributing

PRs accepted.

## License

[MIT (c) 3846masa](./LICENSE)
