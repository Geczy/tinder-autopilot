import get from "lodash/get";
import keyBy from "lodash/keyBy";
import { sendMessageToMatch, getMessagesForMatch, getMatches } from "./api";
import { randomDelay, logger, generateRandomNumber } from "./helper";
import { onToggle, offToggle } from "./templates";
import Sidebar from "./Sidebar";
import Interactions from "./Interactions";

class Swiper {
  isRunning = false;

  constructor() {
    this.interactions = new Interactions();
  }

  start = () => {
    logger("Starting to swipe using a randomized interval");
    this.isRunning = true;
    this.run();
  };

  stop = () => {
    this.isRunning = false;
    logger("Autopilot stopped ⛔️");
  };

  run = () => {
    if (!this.isRunning) {
      return;
    }

    // Must be on matches page
    if (!this.interactions.isOnMatchesPage()) {
      logger("Going to main page to start liking");
      this.interactions.goToMainPage();

      const waitForMatchPage = setInterval(() => {
        if (this.interactions.isOnMatchesPage()) {
          clearInterval(waitForMatchPage);
          return setTimeout(this.run, generateRandomNumber());
        }
      }, 100);
    }

    if (this.interactions.closeInstructions(this.run)) {
      return;
    }

    if (!this.interactions.canSwipe()) {
      logger("Waiting for photos...");
      return setTimeout(this.run, generateRandomNumber());
    }

    // Keep Swiping
    if (this.interactions.matchFound()) {
      return setTimeout(this.run, generateRandomNumber(3000, 4000));
    }

    // What we came here to do, swipe right!
    if (this.interactions.pressLike()) {
      return setTimeout(this.run, generateRandomNumber(500, 900));
    }

    logger("No profiles found. Waiting 4s");
    return setTimeout(this.run, generateRandomNumber(3000, 4000));
  };
}

export default Swiper;
