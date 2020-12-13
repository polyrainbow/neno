import urlMetadata from "url-metadata";
import UrlMetadataResponse from "../interfaces/UrlMetadataResponse.js";

const getUrlMetadata = async (
  url:string,
):Promise<UrlMetadataResponse> => {
  const metadata = await urlMetadata(url);

  const response:UrlMetadataResponse = {
    "success": 1,
    "url": url,
    "meta": {
      "title": metadata.title,
      "description": metadata.description,
      "image": {
        "url": metadata.image,
      },
    },
  };

  return response;
};

export default getUrlMetadata;
