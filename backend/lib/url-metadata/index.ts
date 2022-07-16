import { Options, Result } from "./types";
import parse from "./lib/parse.js";

export default async (
  url,
  options?: Options,
): Promise<Result> => {
  if (typeof options !== 'object') options = {};

  const opts = Object.assign(
    // defaults
    {
      userAgent: 'MetadataScraper',
      fromEmail: 'example@example.com',
      maxRedirects: 10,
      timeout: 10000,
      descriptionLength: 750,
      ensureSecureImageRequest: true,
      sourceMap: {},
      decode: undefined,
      encode: undefined
    },
    // options passed in override defaults
    options
  );

  const requestOpts = {
    method: "GET",
    headers: {
      'User-Agent': opts.userAgent,
      'From': opts.fromEmail,
    },
  };

  const response = await fetch(url, requestOpts);
  if (response.status !== 200) {
    throw new Error('Response code ' + response.status);
  }

  const bodyText = await response.text();

  // rewrite url if our request had to follow redirects to resolve the
  // final link destination (for example: links shortened by bit.ly)
  const urlToParse = response.url;
  return parse(urlToParse, bodyText, opts);
};
