import * as logger from "./logger.js";
import urlMetadata from "url-metadata";
import UrlMetadataResponse from "../../lib/notes/interfaces/UrlMetadataResponse";

const getUrlMetadata = async (
  url:string,
):Promise<UrlMetadataResponse> => {
  const metadata = await urlMetadata(url);

  logger.debug("URL METADATA RECEIVED:");
  logger.debug(metadata);

  const response = {
    url,
    title: metadata.title,
    description: metadata.description,
    image: metadata.image,
  };

  logger.debug("URL METADATA RESPONSE OBJECT:");
  logger.debug(response);

  return response;
};

export default getUrlMetadata;
