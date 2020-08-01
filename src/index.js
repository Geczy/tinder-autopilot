import { logger } from './misc/helper';
import Sidebar from './views/Sidebar';
import { getMyProfile } from './misc/api';

class TinderAssistant {
  constructor() {
    getMyProfile().then((profileData) => {});

    new Sidebar();
    logger('Welcome to Tinder Autopilot');
  }
}

setTimeout(() => {
  new TinderAssistant();
}, 500);
