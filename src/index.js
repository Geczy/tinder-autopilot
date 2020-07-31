import { generateRandomNumber, logger } from "./helper";
import Interactions from "./Interactions";
import Sidebar from "./Sidebar";
import { getMyProfile } from "./api";

class TinderAssistant extends Interactions {
  isRunning = false;
  constructor() {
    super();

    getMyProfile().then((profileData) => {
      this.profileData = profileData;
    });

    new Sidebar(this.start, this.stop);
    logger("Welcome to Tinder Autopilot");
  }

  start = () => {
    this.isRunning = true;
    this.run();
  };

  stop = () => (this.isRunning = false);

  run = () => {
    if (!this.isRunning) {
      return;
    }

    // Must be on matches page
    if (!this.isOnMatchesPage()) {
      logger("Going to main page to start liking");
      this.goToMainPage();

      const waitForMatchPage = setInterval(() => {
        if (this.isOnMatchesPage()) {
          clearInterval(waitForMatchPage);
          return setTimeout(this.run, generateRandomNumber());
        }
      }, 100);
    }

    if (this.closeInstructions(this.run)) {
      return;
    }

    if (!this.canSwipe()) {
      logger("Waiting for photos...");
      return setTimeout(this.run, generateRandomNumber());
    }

    // Keep Swiping
    if (this.matchFound()) {
      return setTimeout(this.run, generateRandomNumber(3000, 4000));
    }

    // What we came here to do, swipe right!
    if (this.pressLike()) {
      return setTimeout(this.run, generateRandomNumber(500, 900));
    }

    logger("No profiles found. Waiting 4s");
    return setTimeout(this.run, generateRandomNumber(3000, 4000));
  };
}

setTimeout(() => {
  new TinderAssistant();
}, 500);
