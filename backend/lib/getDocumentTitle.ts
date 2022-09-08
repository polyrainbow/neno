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
  const response = await fetch(url);
  if (response.status !== 200) {
    throw new Error('Response code ' + response.status);
  }

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.startsWith("text/html")) {
    throw new Error('Invalid content-type' + contentType);
  }

  const bodyText = await response.text();
  const documentTitle = getDocumentTitleFromHtml(bodyText);
  logger.verbose("Document title received:");
  logger.verbose(JSON.stringify(documentTitle));
  return documentTitle;
};

export default getDocumentTitle;
