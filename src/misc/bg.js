chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  fetch(request.url, request.options).then(
    function (response) {
      return response.text().then(function (text) {
        sendResponse([
          {
            body: text,
            status: response.status,
            statusText: response.statusText
          },
          null
        ]);
      });
    },
    function (error) {
      sendResponse([null, error]);
    }
  );
  return true;
});
