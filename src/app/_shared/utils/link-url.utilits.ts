export function getProtocolFromUrl(url: string) {
  const aForUrl = document.createElement('a');
  aForUrl.setAttribute('href', url);
  if (aForUrl.protocol && url.indexOf('://') > -1) {
    return aForUrl.protocol + '//';
  }
  return null;
}

export function getUrlWithoutProtocol(url: string) {
  return url.replace(/^https?\:\/\//i, '');
}
