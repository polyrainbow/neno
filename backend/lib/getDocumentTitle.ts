import * as logger from "./logger.js";


export const getDocumentTitleFromHtml = (html: string): string => {
  const REGEX = /<title.*>(.*)<\/title>/g;
  const result = REGEX.exec(html);
  if (!result) throw new Error("Document contains no title element");
  return result[1];
};

const getDocumentTitle = async (
  url: string,
): Promise<string> => {
  const requestOpts = {
    method: "GET",
    headers: {
      'User-Agent': "NENO",
    },
  };

  const response = await fetch(url, requestOpts);
  if (response.status !== 200) {
    throw new Error('Response code ' + response.status);
  }

  const bodyText = await response.text();
  const documentTitle = getDocumentTitleFromHtml(bodyText);
  logger.verbose("Document title received:");
  logger.verbose(JSON.stringify(documentTitle));
  return documentTitle;
};

export default getDocumentTitle;
