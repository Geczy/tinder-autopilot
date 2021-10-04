import { logger } from './helper';

class Interactions {
  isOnMatchesPage = () => {
    return (
      window.location.toString().indexOf('app/recs') !== -1 ||
      window.location.toString().indexOf('app/matches') !== -1
    );
  };

  goToMainPage = () => {
    const matchesLink = document.querySelectorAll("a[href='/app/matches']");
    if (matchesLink && matchesLink.length) {
      return matchesLink[0].click();
    }

    const mainMenuLink = document.querySelectorAll("a[href='/app/recs']");
    if (mainMenuLink && mainMenuLink.length) {
      return mainMenuLink[0].click();
    }

    const matchesTab = document.querySelector('nav div:nth-child(1) > span');
    if (matchesTab) {
      return matchesTab.click();
    }
  };

  closeInstructions = () => {
    // Homescreen modal blocks us
    try {
      if (document.querySelector('[data-testid="addToHomeScreen"]')) {
        document
          .querySelector('[data-testid="addToHomeScreen"]')
          .parentElement.querySelector('button:nth-of-type(2)')
          .click();
        logger('Closing add to homescreen modal');
        return true;
      }
    } catch (e) {
      return false;
    }
  };

  closeMatchFound = () => {
    try {
      const modal = document.querySelector('[title="Back to Tinder"]');
      if (modal) {
        modal.click();
        logger('Closing match found');
        return true;
      }
    } catch (e) {
      return false;
    }
  };

  closeModal = () => {
    try {
      const modal = document.querySelector('[role="dialog"]').parentElement.parentElement;
      if (modal) {
        document.querySelector('[role="dialog"]').parentElement.click();
        logger('Closing modal');
        return true;
      }
    } catch (e) {
      return false;
    }
  };
}

export default Interactions;
