import { generateRandomNumber, logger } from "./helper";
import Interactions from "./Interactions";
import Sidebar from "./Sidebar";
import { getMyProfile } from "./api";

class TinderAssistant {
  constructor() {
    getMyProfile().then((profileData) => {
      this.profileData = profileData;
    });

    new Sidebar();
    logger("Welcome to Tinder Autopilot");
  }
}

setTimeout(() => {
  new TinderAssistant();
}, 500);
