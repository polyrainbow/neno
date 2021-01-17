import urlMetadata from "url-metadata";
import UrlMetadataResponse from "../../interfaces/UrlMetadataResponse.js";

const getUrlMetadata = async (
  url:string,
  verbose = false,
):Promise<UrlMetadataResponse> => {
  const metadata = await urlMetadata(url);

  if (verbose) {
    console.log("URL METADATA RECEIVED:");
    console.log(metadata);
  }

  const response = {
    url,
    title: metadata.title,
    description: metadata.description,
    image: metadata.image,
  };

  if (verbose) {
    console.log("URL METADATA RESPONSE OBJECT:");
    console.log(response);
  }

  return response;
};

export default getUrlMetadata;
