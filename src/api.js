import get from "lodash/get";

function fetchResource(input, init) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ input, init }, (messageResponse) => {
      const [response, error] = messageResponse;
      if (response === null) {
        reject(error);
      } else {
        // Use undefined on a 204 - No Content
        const body = response.body ? new Blob([response.body]) : undefined;
        resolve(
          new Response(body, {
            status: response.status,
            statusText: response.statusText,
          })
        );
      }
    });
  });
}

const getMatches = async (newOnly, nextPageToken) => {
  return fetchResource(
    `https://api.gotinder.com/v2/matches?count=100&is_tinder_u=true&locale=en&message=${
      newOnly ? 0 : 1
    }${
      typeof nextPageToken === "string" ? `&page_token=${nextPageToken}` : ""
    }`,

    {
      mode: "cors",
      headers: {
        referrer: "https://tinder.com/",
        referrerPolicy: "origin",
        Accept: "application/json; charset=UTF-8",
        "persistent-device-id": localStorage.getItem("TinderWeb/uuid"),
        platform: "web",
        "X-Auth-Token": localStorage.getItem("TinderWeb/APIToken"),
      },
      method: "GET",
    }
  )
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      return data ? JSON.parse(data) : {};
    });
};

const getMessagesForMatch = ({ id }) =>
  fetchResource(
    `https://api.gotinder.com/v2/matches/${id}/messages?count=100`,
    {
      headers: {
        accept: "application/json",
        "persistent-device-id": localStorage.getItem("TinderWeb/uuid"),
        platform: "web",
        "X-Auth-Token": localStorage.getItem("TinderWeb/APIToken"),
      },
      method: "GET",
    }
  )
    .then((response) => {
      return response.text();
    })
    .then((data) => (data ? JSON.parse(data) : {}))
    .then((data) =>
      get(data, "data.messages", []).map((r) =>
        get(r, "message", "")
          .trim()
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+/g, "-")
          .replace("thanks", "thank")
      )
    )
    .catch((error) => {
      console.log(error);
    });

const sendMessageToMatch = (matchID, message) =>
  fetchResource(`https://api.gotinder.com/user/matches/${matchID}?locale=en`, {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "persistent-device-id": localStorage.getItem("TinderWeb/uuid"),
      platform: "web",
      "X-Auth-Token": localStorage.getItem("TinderWeb/APIToken"),
    },
    body: JSON.stringify({ message }),
    method: "POST",
  })
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      return data ? JSON.parse(data) : {};
    })
    .catch((error) => {
      console.log(error);
    });

export { sendMessageToMatch, getMessagesForMatch, getMatches };
