import get from 'lodash/get';
import { logger } from './misc/helper';
import Sidebar from './views/Sidebar';
import { getMyProfile } from './misc/api';

class TinderAssistant {
  boostRemaining = false;

  isBoosting = false;

  constructor() {
    getMyProfile().then((profileData) => {
      const d = new Date();
      const n = d.getTime();

      const expires = get(profileData, 'data.boost.expires_at');
      this.boostRemaining = get(profileData, 'data.boost.allotment_remaining');
      const boostMinutesLeft = Math.round(expires - n) / 1000 / 60;
      if (boostMinutesLeft > 0) {
        this.isBoosting = true;
      }

      localStorage.setItem('TinderAutopilot/ProfileData', JSON.stringify(profileData));

      new Sidebar();
      logger('Welcome to Tinder Autopilot');
    });
  }
}

setTimeout(() => {
  new TinderAssistant();
}, 500);
