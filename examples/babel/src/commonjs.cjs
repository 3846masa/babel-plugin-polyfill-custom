require('polyfill:promise');
require('polyfill:promise.any');
require('polyfill:fetch');
require('polyfill:abort-controller');

function request(url, options) {
  return fetch(url, options).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }
    return res;
  });
}

const abortController = new AbortController();

Promise.any([
  request('https://deelay.me/1000/httpbin.org/status/500', {
    signal: abortController.signal,
  }),
  request('https://deelay.me/3000/httpbin.org/status/200', {
    signal: abortController.signal,
  }),
  request('https://deelay.me/5000/httpbin.org/status/400', {
    signal: abortController.signal,
  }),
])
  .then((res) => {
    abortController.abort();
    console.log(res.url, res);
  })
  .catch((err) => {
    console.error(err);
  });
