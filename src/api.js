import get from "lodash/get";

const headers = {
  referrer: "https://tinder.com/",
  referrerPolicy: "origin",
  Accept: "application/json; charset=UTF-8",
  "persistent-device-id": localStorage.getItem("TinderWeb/uuid"),
  platform: "web",
  "X-Auth-Token": localStorage.getItem("TinderWeb/APIToken"),
};

const defaultOptions = {
  mode: "cors",
  headers,
  method: "GET",
};

function fetchResource(url, body = false) {
  return new Promise((resolve, reject) => {
    let options = defaultOptions;
    if (body) {
      options.body = JSON.stringify(body);
      options.method = "POST";
    }
    chrome.runtime.sendMessage({ url, options }, (messageResponse) => {
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
}

const getMatches = async (newOnly, nextPageToken) => {
  return fetchResource(
    `https://api.gotinder.com/v2/matches?count=100&is_tinder_u=true&locale=en&message=${
      newOnly ? 0 : 1
    }${typeof nextPageToken === "string" ? `&page_token=${nextPageToken}` : ""}`
  );
};

const getMyProfile = () =>
  fetchResource(
    `https://api.gotinder.com/v2/profile?locale=en&include=account%2Cboost%2Ccontact_cards%2Cemail_settings%2Cinstagram%2Clikes%2Cnotifications%2Cplus_control%2Cproducts%2Cpurchase%2Creadreceipts%2Cswipenote%2Cspotify%2Csuper_likes%2Ctinder_u%2Ctravel%2Ctutorials%2Cuser`
  );

const getMessagesForMatch = ({ id }) =>
  fetchResource(
    `https://api.gotinder.com/v2/matches/${id}/messages?count=100`
  ).then((data) =>
    get(data, "data.messages", []).map((r) =>
      get(r, "message", "")
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace("thanks", "thank")
    )
  );

const sendMessageToMatch = (matchID, message) =>
  fetchResource(`https://api.gotinder.com/user/matches/${matchID}?locale=en`, {
    message,
  });

export { sendMessageToMatch, getMessagesForMatch, getMatches, getMyProfile };
