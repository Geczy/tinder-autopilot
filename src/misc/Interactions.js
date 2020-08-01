import { logger } from "./helper";

class Interactions {
  isOnMatchesPage = () => {
    return (
      window.location.toString().indexOf("app/recs") !== -1 ||
      window.location.toString().indexOf("app/matches") !== -1
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

    const matchesTab = document.querySelector("nav div:nth-child(1) > span");
    if (matchesTab) {
      return matchesTab.click();
    }
  };

  closeInstructions = (cb) => {
    // Homescreen modal blocks us
    try {
      if (document.querySelector('[data-testid="addToHomeScreen"]')) {
        document
          .querySelector('[data-testid="addToHomeScreen"]')
          .parentElement.querySelector("button:nth-of-type(2)")
          .click();
        logger("Closing add to homescreen modal");
        cb();
        return true;
      }
    } catch (e) {}
  };
}

export default Interactions;
