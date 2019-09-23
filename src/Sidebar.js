import { logger } from "./helper";
import {
  onToggle,
  offToggle,
  topBanner,
  autopilot,
  infoBanner,
  massMessage,
  loggerHeader,
  counterLogs
} from "./templates";
import Messeger from "./Messeger";

class Sidebar extends Messeger {
  constructor(run, stop) {
    super();

    this.runParent = run;
    this.stopParent = stop;
    this.sidebar();
    this.events();
  }

  sidebar = () => {
    document.querySelector("#content").style.marginLeft = `280px`;
    const el = document.createElement("div");
    el.innerHTML = infoBanner;
    document.body.appendChild(el);

    this.infoBanner = document.querySelector("#infoBanner");

    this.infoBanner.innerHTML =
      `<div style="height:100%">` +
      topBanner +
      counterLogs(0, 0) +
      autopilot +
      massMessage +
      loggerHeader +
      `<div class="txt" style="overflow-y: auto; height: 200px;"></div>` +
      `</div>`;
  };

  start = () => {
    logger("Starting to swipe using a randomized interval");
    this.isRunning = true;
    document.querySelector(
      ".infoBannerActions .toggleSwitch__empty"
    ).className = onToggle;
    this.runParent();
  };

  stop = () => {
    logger("Autopilot stopped ⛔️");
    this.isRunning = false;
    document.querySelector(
      ".infoBannerActions .toggleSwitch__empty"
    ).className = offToggle;
    this.stopParent();
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
      const toggleSwitch = document.querySelector(
        ".infoBannerActionsMessageNewOnly .toggleSwitch__empty"
      );

      const className = toggleSwitch.className;
      toggleSwitch.className = className === onToggle ? offToggle : onToggle;
    };
  };
}

export default Sidebar;
