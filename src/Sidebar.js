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

    this.isMyReplyHidden = false;
    this.runParent = run;
    this.stopParent = stop;
    this.sidebar();
    this.events();
  }
  insertBefore = (el, referenceNode) => {
    referenceNode.parentNode.insertBefore(el, referenceNode);
  };
  sidebar = () => {
    const el = document.createElement("aside");
    el.className =
      "H(100%) Fld(c) Pos(r) Flxg(0) Fxs(0) Flxb(25%) Miw(325px) Maw(375px)";
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

  scrollDown = cb => {
    var currHeight = document.querySelector("#matchListWithMessages").scrollTop;
    var totalHeight = document.querySelector("#matchListWithMessages")
      .scrollHeight;
    var newTotal = document.querySelector("div.messageList").children.length;

    if (this.counter < 30 && currHeight < totalHeight) {
      this.counter += 1;
      document.querySelector("#matchListWithMessages").scrollTop +=
        window.outerHeight;
      setTimeout(() => this.scrollDown(cb), 100);
    } else {
      logger(`Finished scrolling, total matches found: ${newTotal}`);
      cb();
    }

    if (newTotal > this.totalMessages) {
      this.counter = 0;
    }

    this.totalMessages = newTotal;
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

    document.querySelector(".infoBannerActionsHideMine").onclick = e => {
      e.preventDefault();

      if (document.querySelector("#messages-tab")) {
        document.querySelector("#messages-tab").click();
      } else {
        document.querySelector('a[href="/app/recs"]').click();
      }

      if (this.isMyReplyHidden) {
        this.isMyReplyHidden = false;
        document.querySelector(
          ".infoBannerActionsHideMine .toggleSwitch__empty"
        ).className = offToggle;

        document.querySelectorAll(".messageListItem__myReply").forEach(t => {
          t.closest(".messageListItem").style.display = "flex";
        });
      } else {
        this.isMyReplyHidden = true;
        document.querySelector(
          ".infoBannerActionsHideMine .toggleSwitch__empty"
        ).className = onToggle;

        const cb = () => {
          document.querySelectorAll(".messageListItem__myReply").forEach(t => {
            t.closest(".messageListItem").style.display = "none";
          });

          var unansweredCount = Array.prototype.slice
            .call(document.querySelectorAll(".messageListItem"))
            .filter(function(item, index) {
              return item.style.display != "none";
            }).length;

          logger(`Total matches that need a response: ${unansweredCount}`);
        };

        this.totalMessages = document.querySelector(
          "div.messageList"
        ).children.length;
        this.counter = 0;

        this.scrollDown(cb);
      }
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
