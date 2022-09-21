export const fetchJSON = (url: string, options: RequestInit): Promise<any> => {
  // eslint-disable-next-line no-undef
  return fetch(url, options).then((response) => response.json());
};


export const trimHostUrl = (hostUrl: string): string => {
  let hostUrlTrimmed = hostUrl;

  while (hostUrlTrimmed[hostUrlTrimmed.length - 1] === "/") {
    hostUrlTrimmed = hostUrlTrimmed.substring(0, hostUrlTrimmed.length - 1);
  }

  return hostUrlTrimmed;
};


interface GetNoteContentParams {
  url: string,
  pageTitle: string,
  noteText: string,
}

export const getNoteContent = ({
  url,
  pageTitle,
  noteText,
}: GetNoteContentParams): string => {
  let content = url + " " + pageTitle + "\n";

  if (noteText.trim().length > 0) {
    content += "\n" + noteText.trim() + "\n";
  }

  return content;
};


export const putNote = ({
  noteSaveRequest,
  hostUrl,
  apiKey,
  graphId,
}): Promise<any> => {
  const requestUrl = `${hostUrl}/api/graph/${graphId}/note`;

  return fetchJSON(requestUrl, {
    method: "PUT",
    headers: {
      "X-Auth-Token": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noteSaveRequest),
  })
    .then((response) => {
      return response;
    });
};


export const getExistingNotesWithThisUrl = (
  url: string,
  graphId: string,
  hostUrl: string,
  apiKey: string,
): Promise<any> => {
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


export const isAuthenticated = (
  hostUrl: string,
  apiKey: string,
):Promise<any> => {
  const url = hostUrl + "/api/user/authenticated";

  return fetchJSON(url, {
    method: "POST",
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
