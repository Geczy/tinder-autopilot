import get from "lodash/get";
import keyBy from "lodash/keyBy";
import { sendMessageToMatch, getMessagesForMatch, getMatches } from "./api";
import { generateRandomNumber, randomDelay } from "./helper";
import {
  offToggle,
  onToggle,
  topBanner,
  autopilot,
  infoBanner,
  massMessage,
  loggerHeader,
  counterLogs
} from "./templates";

class TinderAssistant {
  likeCount = 0;
  matchCount = 0;
  isRunning = false;
  isRunningMessage = false;
  infoBanner;
  newOnly = false;
  allMatches = [];
  nextPageToken = false;

  constructor() {
    this.setupSidebar();
    this.events();
    this.logger("Welcome to Tinder Autopilot");
  }

  setupSidebar = () => {
    document.querySelector("#content").style.marginLeft = `280px`;
    const el = document.createElement("div");
    el.innerHTML = infoBanner;
    document.body.appendChild(el);

    this.infoBanner = document.querySelector("#infoBanner");

    this.infoBanner.innerHTML =
      `<div style="height:100%">` +
      topBanner +
      counterLogs(this.likeCount, this.matchCount) +
      autopilot +
      massMessage +
      loggerHeader +
      `<div class="txt" style="overflow-y: auto; height: 100%;"></div>` +
      `</div>`;
  };

  events = () => {
    document.querySelector(".infoBannerActions").onclick = e => {
      e.preventDefault();
      this.toggle();
    };

    document.querySelector(".infoBannerActionsMessage").onclick = e => {
      e.preventDefault();
      this.toggleMessage();
    };

    document.querySelector(".infoBannerActionsMessageNewOnly").onclick = e => {
      e.preventDefault();
      this.newOnly = !this.newOnly;
      document.querySelector(
        ".infoBannerActionsMessageNewOnly .toggleSwitch__empty"
      ).className = this.newOnly ? onToggle : offToggle;
    };

    if (window.location.toString().indexOf("?start=1") > -1) {
      this.start();
    }
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
  runMessage = async () => {
    await this.loopMatches();
    while (this.nextPageToken) {
      await this.loopMatches();
    }

    this.logger(`Retrieved all match history: ${this.allMatches.length}`);

    // To start with old matches we can reverse the array
    // this.allMatches = this.allMatches.reverse();

    this.logger(`Looking for matches we have not sent yet to`);
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
          .then(messageList =>
            messageList ? !messageList.includes(messageToSendL) : false
          )
          .then(shouldSend => {
            if (shouldSend) {
              sendMessageToMatch(match.id, messageToSend).then(r => {
                if (get(r, "sent_date")) {
                  this.logger(`Message sent to ${get(match, "person.name")}`);
                }
              });
            }
          })
      );
    }

    if (pendingPromiseList === []) {
      this.logger("No more matches to send message to");
      this.stopMessage();
    }

    Promise.all(pendingPromiseList).then(r => {
      this.logger("No more matches to send message to");
      this.stopMessage();
    });
  };
  start = () => {
    this.logger("Starting to swipe using a randomized interval");
    this.isRunning = true;
    this.infoBanner.querySelector(
      ".infoBannerActions .toggleSwitch__empty"
    ).className = onToggle;
    this.run();
  };
  stop = () => {
    this.logger("Autopilot stopped ⛔️");
    this.isRunning = false;
    this.infoBanner.querySelector(
      ".infoBannerActions .toggleSwitch__empty"
    ).className = offToggle;
  };
  startMessage = () => {
    this.logger("Starting messages");
    this.isRunningMessage = true;
    this.infoBanner.querySelector(
      ".infoBannerActionsMessage .toggleSwitch__empty"
    ).className = onToggle;
    this.nextPageToken = true;
    this.runMessage();
  };
  stopMessage = () => {
    this.logger("Messaging stopped ⛔️");
    this.isRunningMessage = false;
    this.infoBanner.querySelector(
      ".infoBannerActionsMessage .toggleSwitch__empty"
    ).className = offToggle;
    this.infoBanner.querySelector(
      ".infoBannerActionsMessageNewOnly .toggleSwitch__empty"
    ).className = offToggle;
  };
  toggle = () => {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
  };
  toggleMessage = () => {
    if (this.isRunningMessage) {
      this.stopMessage();
    } else {
      this.startMessage();
    }
  };
  onMatchesPage = () => {
    return (
      window.location.toString().indexOf("app/recs") !== -1 ||
      window.location.toString().indexOf("app/matches") !== -1
    );
  };
  sendMessage = () => {
    document.querySelector("a.button").click();
    setTimeout(() => {
      this.logger("Let's send a random GIF!");
      document.querySelectorAll("img")[1].click();
      setTimeout(() => {
        this.logger("GIF chosen");
        const imgs = document.querySelectorAll(".gif__messages__item");
        console.log(new Date(), imgs.length);
        const random = Math.floor(imgs.length * Math.random());
        console.log(new Date(), random, imgs[random]);
        // find a random gif
        imgs[random].click();
        setTimeout(() => {
          document.querySelector(".chatNavBar a").click();
          setTimeout(this.run, generateRandomNumber());
        }, generateRandomNumber());
      }, generateRandomNumber());
    }, generateRandomNumber());
  };
  matchFound = () => {
    const matchFound = document.querySelectorAll(".itsAMatch");

    if (!matchFound || !matchFound.length) {
      return false;
    }

    this.matchCount += 1;
    document.getElementById("matchCount").innerHTML = matchCount;
    this.logger("Congrats! We've got a match! 🤡");
    document.querySelectorAll(".itsAMatch a")[0].click();
    return true;
  };
  canSwipe = () => {
    return (
      document.querySelectorAll(".recCard").length > 0 &&
      !document.querySelector(".beacon__circle")
    );
  };
  hasLike = () => {
    const likeButton = document.querySelector('[aria-label="Like"]');
    return likeButton;
  };
  pressLike = () => {
    const likeButton = this.hasLike();
    console.log("ye", likeButton);
    if (!likeButton && !this.canSwipe()) {
      return false;
    }

    likeButton.click();
    this.likeCount += 1;
    document.getElementById("likeCount").innerHTML = this.likeCount;
    return true;
  };
  closeIntrustions = () => {
    // Homescreen modal blocks us
    try {
      if (document.querySelector('[data-testid="addToHomeScreen"]')) {
        document
          .querySelector('[data-testid="addToHomeScreen"]')
          .parentElement.querySelector("button:nth-of-type(2)")
          .click();
        this.logger("Closing add to homescreen modal");
        return true;
      }
    } catch (e) {}

    // Must be on matches page
    if (!this.onMatchesPage()) {
      this.logger("Going to main page to start liking");
      this.goToMainPage();

      const waitForMatchPage = setInterval(() => {
        if (this.onMatchesPage()) {
          clearInterval(waitForMatchPage);
          this.run();
        }
      }, 100);

      return true;
    }
  };
  run = () => {
    if (!this.isRunning) {
      return;
    }

    if (this.closeIntrustions()) {
      return;
    }

    if (!this.canSwipe()) {
      this.logger("Waiting for photos...");
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

    this.logger("No profiles found. Waiting 4s");
    return setTimeout(this.run, generateRandomNumber(3000, 4000));
  };

  logger = v => {
    console.log(v);
    const now = new Date();
    const txt = this.infoBanner.querySelector(".txt");
    const message = /*html*/ `<p class="settings__bottomSubtitle Px(12px)--s Px(17px)--ml Lts(0) Fw($regular) C($c-secondary) Fz($xs) Ta(s)"><span>
    ${`0${now.getHours()}`.slice(-2)}:${`0${now.getMinutes()}`.slice(
      -2
    )}:${`0${now.getSeconds()}`.slice(-2)}.</span> 
    ${v}</span></p>`;
    txt.innerHTML += message;
    txt.scrollTop = txt.scrollHeight;
  };

  loopMatches = async () => {
    const response = await getMatches(this.newOnly);
    this.nextPageToken = get(response, "data.this.nextPageToken");
    this.allMatches.push.apply(
      this.allMatches,
      get(response, "data.matches", [])
    );
  };
}

new TinderAssistant();
