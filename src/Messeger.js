import get from "lodash/get";
import keyBy from "lodash/keyBy";
import { sendMessageToMatch, getMessagesForMatch, getMatches } from "./api";
import { randomDelay, logger } from "./helper";
import { onToggle, offToggle } from "./templates";

class Messeger {
  newOnly;
  nextPageToken;
  isRunningMessage;
  allMatches = [];
  checkedMessage = 0;

  loopMatches = async () => {
    const response = await getMatches(this.newOnly, this.nextPageToken);
    this.nextPageToken = get(response, "data.next_page_token");
    this.allMatches.push.apply(
      this.allMatches,
      get(response, "data.matches", [])
    );
  };

  startMessage = () => {
    this.checkedMessage = 0;
    logger("Starting messages");
    this.newOnly =
      document.querySelector(
        ".infoBannerActionsMessageNewOnly .toggleSwitch__empty"
      ).className === onToggle;
    this.isRunningMessage = true;
    document.querySelector(
      ".infoBannerActionsMessage .toggleSwitch__empty"
    ).className = onToggle;
    this.nextPageToken = true;
    this.runMessage();
  };

  stopMessage = () => {
    logger("Messaging stopped ⛔️");
    this.isRunningMessage = false;
    document.querySelector(
      ".infoBannerActionsMessage .toggleSwitch__empty"
    ).className = offToggle;
    document.querySelector(
      ".infoBannerActionsMessageNewOnly .toggleSwitch__empty"
    ).className = offToggle;
  };

  runMessage = async () => {
    await this.loopMatches();
    while (this.nextPageToken) {
      logger(`Currently have ${this.allMatches.length} matches`);
      await this.loopMatches();
    }

    logger(`Retrieved all match history: ${this.allMatches.length}`);

    // To start with old matches we can reverse the array
    // this.allMatches = this.allMatches.reverse();

    logger(`Looking for matches we have not sent yet to`);
    this.sendMessagesTo(this.allMatches);
  };

  sendMessagesTo = async r => {
    const matchList = keyBy(r, "id");
    const pendingPromiseList = [];

    for (const matchID of Object.keys(matchList)) {
      await randomDelay();
      if (!this.isRunningMessage) break;

      const match = matchList[matchID];
      const messageToSend = get(
        document.getElementById("messageToSend"),
        "value",
        ""
      ).replace("{name}", get(match, "person.name"));

      const messageToSendL = messageToSend
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace("thanks", "thank");

      pendingPromiseList.push(
        getMessagesForMatch(match)
          .then(messageList => {
            this.checkedMessage += 1;
            logger(`Checked ${this.checkedMessage}/${this.allMatches.length}`);
            return messageList ? !messageList.includes(messageToSendL) : false;
          })
          .then(shouldSend => {
            if (shouldSend) {
              sendMessageToMatch(match.id, messageToSend).then(r => {
                if (get(r, "sent_date")) {
                  logger(`Message sent to ${get(match, "person.name")}`);
                }
              });
            }
          })
      );
    }

    if (pendingPromiseList === []) {
      logger("No more matches to send message to");
      this.stopMessage();
    } else {
      Promise.all(pendingPromiseList).then(r => {
        logger("No more matches to send message to");
        this.stopMessage();
      });
    }
  };
}

export default Messeger;
