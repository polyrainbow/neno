import * as logger from "./logger.js";
import urlMetadata from "./url-metadata/index.js";
import UrlMetadataResponse from "../../lib/notes/interfaces/UrlMetadataResponse";

const getUrlMetadata = async (
  url: string,
): Promise<UrlMetadataResponse> => {
  const metadata = await urlMetadata(url);

  logger.verbose("URL metadata received:");
  logger.verbose(JSON.stringify(metadata));

  const response = {
    url,
    title: metadata.title,
    description: metadata.description,
    image: metadata.image,
  };

  logger.verbose("URL metadata response object:");
  logger.verbose(JSON.stringify(response));

  return response;
};

export default getUrlMetadata;
