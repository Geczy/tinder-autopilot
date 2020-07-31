import {
  onToggle,
  offToggle,
  topBanner,
  autopilot,
  infoBanner,
  massMessage,
  loggerHeader,
  counterLogs,
} from "./templates";
import Messenger from "./Messenger";
import Swiper from "./Swiper";
import HideUnanswered from "./HideUnanswered";
import { waitUntilElementExists } from "./helper";

class Sidebar {
  constructor() {
    this.hideUnanswered = new HideUnanswered();
    this.swiper = new Swiper();
    this.messenger = new Messenger();

    this.sidebar();
    this.events();
  }

  insertBefore = (el, referenceNode) => {
    referenceNode.parentNode.insertBefore(el, referenceNode);
  };

  toggleCheckbox = (selector, onCb = false, offCb = false) => {
    document.querySelector(selector).onclick = (e) => {
      e.preventDefault();

      const toggleStatus = document.querySelector(
        `${selector} .toggleSwitch__empty`
      );
      const className = toggleStatus.className;
      const isOn = className === onToggle;
      toggleStatus.className = isOn ? offToggle : onToggle;
      if (isOn && offCb) offCb();
      if (!isOn && onCb) onCb();
    };
  };

  sidebar = () => {
    const el = document.createElement("aside");
    el.className =
      "H(100%) Fld(c) Pos(r) Flxg(0) Fxs(0) Flxb(25%) Miw(325px) Maw(375px)";
    el.style.cssText = "background-color:white;z-index:9999999;";
    el.innerHTML = infoBanner;
    this.insertBefore(el, document.querySelector("aside:first-of-type"));

    this.infoBanner = document.querySelector("#infoBanner");

    this.infoBanner.innerHTML =
      `<nav class="Pos(r)  H(100%) gamepad-control-off">
          <div class="H(100%)"><div class="Ov(h) Bgc($c-bg-lite-blue) menu Pos(r) H(100%)">
          <div class="menu__content Bgc($c-bg-lite-blue) Pb(50px) Fz($responsiveLarge)--m H(100%) Ovs(touch) Ovx(h) Ovy(s) Ovsby(n)">` +
      topBanner +
      counterLogs(0, 0) +
      autopilot +
      massMessage +
      loggerHeader +
      `<div class="txt" style="overflow-y: auto; height: 100%;"></div>` +
      `</div></div></div></nav>`;
  };

  events = () => {
    // Auto unmatch
    waitUntilElementExists('img[alt="No Reason"]', () => {
      document.querySelector("ul li:last-of-type button").click();
      document
        .querySelector('.modal-slide-up div button[type="button"]')
        .click();
    });

    this.toggleCheckbox(
      ".infoBannerActions",
      this.swiper.start,
      this.swiper.stop
    );

    this.toggleCheckbox(
      ".infoBannerActionsMessage",
      this.messenger.start,
      this.messenger.stop
    );

    this.toggleCheckbox(
      ".infoBannerActionsHideMine",
      this.hideUnanswered.start,
      this.hideUnanswered.stop
    );

    this.toggleCheckbox(".infoBannerActionsMessageNewOnly");
  };

  static getCheckboxValue = (selector) => {
    return document.querySelector(selector).className === onToggle;
  };
}

export default Sidebar;
