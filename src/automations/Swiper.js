import { logger, generateRandomNumber } from '../misc/helper';
import Interactions from '../misc/Interactions';

class Swiper {
  selector = '.infoBannerActions';

  isRunning = false;

  constructor() {
    this.interactions = new Interactions();
  }

  start = () => {
    logger('Starting to swipe using a randomized interval');
    this.isRunning = true;
    this.run();
  };

  stop = () => {
    this.isRunning = false;
    logger('Autopilot stopped ⛔️');
  };

  canSwipe = () => {
    return (
      document.querySelectorAll('.recCard').length > 0 && !document.querySelector('.beacon__circle')
    );
  };

  hasLike = () => document.querySelector('[aria-label="Like"]');

  pressLike = () => {
    const likeButton = this.hasLike();
    if (!likeButton && !this.canSwipe()) {
      return false;
    }

    likeButton.click();
    document.getElementById('likeCount').innerHTML =
      parseInt(document.getElementById('likeCount').innerHTML, 10) + 1;
    return true;
  };

  matchFound = () => {
    const found = document.querySelectorAll('.itsAMatch');

    if (!found || !found.length) {
      return false;
    }

    document.getElementById('matchCount').innerHTML =
      parseInt(document.getElementById('matchCount').innerHTML, 10) + 1;
    logger("Congrats! We've got a match! 🤡");
    document.querySelectorAll('.itsAMatch a')[0].click();
    return true;
  };

  run = () => {
    if (!this.isRunning) {
      return;
    }

    // Must be on matches page
    if (!this.interactions.isOnMatchesPage()) {
      logger('Going to main page to start liking');
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

    if (!this.canSwipe()) {
      logger('Waiting for photos...');
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

    logger('No profiles found. Waiting 4s');
    return setTimeout(this.run, generateRandomNumber(3000, 4000));
  };
}

export default Swiper;
