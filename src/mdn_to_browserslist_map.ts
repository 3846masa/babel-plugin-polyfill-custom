const STANDARD_TARGET_NAME_LIST = [
  {
    browserslist: 'chrome',
    mdn: 'chrome',
    name: 'Chrome',
  },
  {
    browserslist: 'edge',
    mdn: 'edge',
    name: 'Edge',
  },
  {
    browserslist: 'firefox',
    mdn: 'firefox',
    name: 'Firefox',
  },
  {
    browserslist: 'ie',
    mdn: 'ie',
    name: 'IE',
  },
  {
    browserslist: 'node',
    mdn: 'nodejs',
    name: 'Node.js',
  },
  {
    browserslist: 'opera',
    mdn: 'opera',
    name: 'Opera',
  },
  {
    browserslist: 'safari',
    mdn: 'safari',
    name: 'Safari',
  },
  {
    browserslist: 'ios',
    mdn: 'safari_ios',
    name: 'iOS Safari',
  },
  {
    browserslist: 'samsung',
    mdn: 'samsunginternet_android',
    name: 'Samsung Browser',
  },
  {
    browserslist: 'android',
    mdn: 'webview_android',
    name: 'Android Webview',
  },
];

export const MDN_TO_BROWSERSLIST_MAP = new Map(
  STANDARD_TARGET_NAME_LIST.map(({ browserslist, mdn }) => [mdn, browserslist]),
);
