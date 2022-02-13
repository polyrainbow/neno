export const fetchJSON = (url, options) => {
  // eslint-disable-next-line no-undef
  return fetch(url, options).then((response) => response.json());
};


export const trimHostUrl = (hostUrl) => {
  let hostUrlTrimmed = hostUrl;

  while (hostUrlTrimmed[hostUrlTrimmed.length - 1] === "/") {
    hostUrlTrimmed = hostUrlTrimmed.substring(0, hostUrlTrimmed.length - 1);
  }

  return hostUrlTrimmed;
};


export const getNoteBlocks = ({
  url,
  pageTitle,
  noteText,
}) => {
  const blocks = [
    {
      type: "link",
      data: {
        link: url,
        meta: {
          title: pageTitle,
          description: "",
          image: {
            url: "",
          },
        },
      },
    },
  ];

  if (noteText.trim().length > 0) {
    const paragraphs = noteText.split("\n\n");
    const paragraphBlocks = paragraphs.map((paragraph) => {
      return {
        type: "paragraph",
        data: {
          text: paragraph,
        },
      };
    });

    blocks.push(...paragraphBlocks);
  }

  return blocks;
};


export const putNote = ({
  note,
  hostUrl,
  apiKey,
  graphId,
}) => {
  const requestBody = {
    note,
    options: {
      ignoreDuplicateTitles: true,
    },
  };

  const requestUrl = `${hostUrl}/api/graph/${graphId}/note`;

  return fetchJSON(requestUrl, {
    method: "PUT",
    headers: {
      "X-Auth-Token": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      return response;
    });
};


export const getExistingNotesWithThisUrl = (url, graphId, hostUrl, apiKey) => {
  const searchString = encodeURIComponent("has-url:" + url);
  const requestUrl
    = `${hostUrl}/api/graph/${graphId}/notes?searchString=${searchString}`;

  return fetchJSON(requestUrl, {
    method: "GET",
    headers: {
      "X-Auth-Token": apiKey,
      "Content-Type": "application/json",
    },
  })
    .then((result) => {
      return result;
    })
    .catch((e) => {
      return {
        success: false,
        error: e.message,
      };
    });
};


export const isAuthenticated = ({
  hostUrl,
  apiKey,
}) => {
  const url = hostUrl + "/api/user/authenticated";

  return fetchJSON(url, {
    method: "GET",
    headers: {
      "X-Auth-Token": apiKey,
      "Content-Type": "application/json",
    },
  })
    .then((result) => {
      return result;
    })
    .catch((e) => {
      return {
        success: false,
        error: e.message,
      };
    });
};
