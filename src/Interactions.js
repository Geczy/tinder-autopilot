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

  canSwipe = () => {
    return (
      document.querySelectorAll(".recCard").length > 0 &&
      !document.querySelector(".beacon__circle")
    );
  };

  hasLike = () => document.querySelector('[aria-label="Like"]');

  pressLike = () => {
    const likeButton = this.hasLike();
    if (!likeButton && !this.canSwipe()) {
      return false;
    }

    likeButton.click();
    document.getElementById("likeCount").innerHTML =
      parseInt(document.getElementById("likeCount").innerHTML, 10) + 1;
    return true;
  };

  matchFound = () => {
    const found = document.querySelectorAll(".itsAMatch");

    if (!found || !found.length) {
      return false;
    }

    document.getElementById("matchCount").innerHTML =
      parseInt(document.getElementById("matchCount").innerHTML, 10) + 1;
    logger("Congrats! We've got a match! 🤡");
    document.querySelectorAll(".itsAMatch a")[0].click();
    return true;
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
