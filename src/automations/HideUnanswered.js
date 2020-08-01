import { logger } from "../misc/helper";

class HideUnanswered {
  selector = ".infoBannerActionsHideMine";
  totalMessages = 0;
  counter = 0;

  finishHiding = () => {
    document.querySelectorAll(".messageListItem__message svg").forEach((t) => {
      t.closest(".messageListItem").style.display = "none";
    });

    const unansweredCount = Array.prototype.slice
      .call(document.querySelectorAll(".messageListItem"))
      .filter((item) => item.style.display !== "none").length;

    logger(`Total matches that need a response: ${unansweredCount}`);
  };

  scrollMatchesToEnd = (cb) => {
    const currHeight = document.querySelector("#matchListWithMessages")
      .scrollTop;
    const totalHeight = document.querySelector("#matchListWithMessages")
      .scrollHeight;
    const newTotal = document.querySelector("div.messageList").children.length;

    if (this.counter < 30 && currHeight < totalHeight) {
      this.counter += 1;
      document.querySelector("#matchListWithMessages").scrollTop +=
        window.outerHeight;
      setTimeout(() => this.scrollMatchesToEnd(cb), 100);
    } else {
      logger(`Finished scrolling, total matches found: ${newTotal}`);
      cb();
    }

    if (newTotal > this.totalMessages) {
      this.counter = 0;
    }

    this.totalMessages = newTotal;
  };

  start = () => {
    if (document.querySelector("#messages-tab")) {
      document.querySelector("#messages-tab").click();
    } else {
      document.querySelector('a[href="/app/recs"]').click();
    }

    this.totalMessages = document.querySelector(
      "div.messageList"
    ).children.length;
    this.counter = 0;

    this.scrollMatchesToEnd(this.finishHiding);
  };

  stop = () => {
    document.querySelectorAll(".messageListItem__message svg").forEach((t) => {
      t.closest(".messageListItem").style.display = "flex";
    });
  };
}

export default HideUnanswered;
