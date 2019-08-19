const randomDelay = async () => {
  const rand = generateRandomNumber(800, 1200);
  return new Promise(resolve => setTimeout(resolve, rand));
};

function generateRandomNumber(min = 800, max = 1500) {
  return (highlightedNumber = Math.random() * (max - min) + min);
}

var tinderAssistant = (function() {
  var defaultMessage = "What’s something you’re good at?";
  var newOnly = false;
  var onToggle = `toggleSwitch__empty Pos(r) Bdrs(15px) Bd Cnt($blank)::a Bdrs(50%)::a Bgc(#fff)::a D(b)::a Bdc($c-divider)::a Bd::a Trstf(eio) Trsdu($fast) Trstf(eio)::a Trsdu($fast)::a W(50px) H(30px) Sq(28px)::a Bdc($c-pink) Bg($c-pink) Bdc($c-pink)::a TranslateX(20px)::a`;
  var offToggle = `toggleSwitch__empty Pos(r) Bdrs(15px) Bd Cnt($blank)::a Bdrs(50%)::a Bgc(#fff)::a D(b)::a Bdc($c-divider)::a Bd::a Trstf(eio) Trsdu($fast) Trstf(eio)::a Trsdu($fast)::a W(50px) H(30px) Sq(28px)::a Bdc($c-disabled) Bgc($c-bg)`;
  var likeCount = 0,
      matchCount = 0;
  let isRunning = false,
      isRunningMessage = false,
      infoBanner;

  return {
    events() {
      infoBanner.querySelector(".infoBannerActions").onclick = function(e) {
        e.preventDefault();
        tinderAssistant.toggle();
      };
      infoBanner.querySelector(".infoBannerActionsMessage").onclick = function(
          e
      ) {
        e.preventDefault();
        tinderAssistant.toggleMessage();
      };

      infoBanner.querySelector(
          ".infoBannerActionsMessageNewOnly"
      ).onclick = function(e) {
        e.preventDefault();
        newOnly = !newOnly;
        infoBanner.querySelector(
            ".infoBannerActionsMessageNewOnly .toggleSwitch__empty"
        ).className = newOnly ? onToggle : offToggle;
      };

      if (window.location.toString().indexOf("?start=1") > -1) {
        tinderAssistant.start();
      }
    },
    goToMainPage() {
      var matchesLink = document.querySelectorAll("a[href='/app/matches']");
      if (matchesLink && matchesLink.length) {
        matchesLink[0].click();
      }

      var mainMenuLink = document.querySelectorAll("a[href='/app/recs']");
      if (mainMenuLink && mainMenuLink.length) {
        mainMenuLink[0].click();
      }

      var matchesTab = document.querySelector("nav div:nth-child(1) > span");
      if (matchesTab) {
        matchesTab.click();
      }
    },
    runMessage() {
      this.goToMainPage();

      if (newOnly) {
        // No message sent to these
        var newMatches = document.querySelectorAll(
            ".matchListItem[href^='/app/messages/']"
        );
        if (newMatches && newMatches.length) {
          this.sendMessagesTo(newMatches);
        }
      } else {
        var messagesTab = document.querySelector("nav div:nth-child(2) > span");
        if (messagesTab) {
          messagesTab.click();
        }

        // Already messaged but should check to see if the new pickup line has been sent or not
        var existingMatches = document.querySelectorAll(
            ".messageListItem[href^='/app/messages/']"
        );
        if (existingMatches && existingMatches.length) {
          this.sendMessagesTo(existingMatches);
        }
      }
    },
    async sendMessagesTo(matchList) {
      const messageToSend = document.getElementById("messageToSend").value;

      for (const [index, match] of matchList.entries()) {
        if (!isRunningMessage) break;

        let alreadySent = false;
        match.click();

        // Wait for messages to load
        await randomDelay();

        // Check for messages sent
        document.querySelectorAll(".msgWrp .text").forEach(t => {
          if (
              t.innerHTML.trim().toLowerCase() ===
              messageToSend.trim().toLowerCase()
          ) {
            alreadySent = true;
            break;
          }
        });

        if (alreadySent) {
          this.logger("Already sent to this person");
          return;
        }
          this.logger("Sending a message to this person");

        const el = document.querySelector("#content div > form > textarea");
        if (!el) return;

          el.value = messageToSend;

          // As @wOxxOm pointed out, we need to pass `{ bubbles: true }` to the options,
          // as React listens on the document element and not the individual input elements
          el.dispatchEvent(new Event("change", {bubbles: true}));
          el.dispatchEvent(new Event("blur", {bubbles: true}));
        const submitButton = document.querySelector("div > form > button");
        if (submitButton) submitButton.click();
      }

      tinderAssistant.logger("Sent messages to all matches");
      tinderAssistant.stopMessage();
    },
    start() {
      tinderAssistant.logger("Starting to swipe using a randomized interval");
      isRunning = true;
      infoBanner.querySelector(
          ".infoBannerActions .toggleSwitch__empty"
      ).className = onToggle;
      tinderAssistant.run();
    },
    stop() {
      tinderAssistant.logger("Autopilot stopped ⛔️");
      isRunning = false;
      infoBanner.querySelector(
          ".infoBannerActions .toggleSwitch__empty"
      ).className = offToggle;
    },
    startMessage() {
      tinderAssistant.logger("Starting messages");
      isRunningMessage = true;
      infoBanner.querySelector(
          ".infoBannerActionsMessage .toggleSwitch__empty"
      ).className = onToggle;
      tinderAssistant.runMessage();
    },
    stopMessage() {
      tinderAssistant.logger("Messaging stopped ⛔️");
      isRunningMessage = false;
      infoBanner.querySelector(
          ".infoBannerActionsMessage .toggleSwitch__empty"
      ).className = offToggle;
    },
    toggle() {
      if (isRunning) {
        tinderAssistant.stop();
      } else {
        tinderAssistant.start();
      }
    },
    toggleMessage() {
      if (isRunningMessage) {
        tinderAssistant.stopMessage();
      } else {
        tinderAssistant.startMessage();
      }
    },
    run() {
      const sendMessage = function() {
        document.querySelector("a.button").click();
        setTimeout(() => {
          tinderAssistant.logger("Let's send a random GIF!");
          document.querySelectorAll("img")[1].click();
          setTimeout(() => {
            tinderAssistant.logger("GIF chosen");
            const imgs = document.querySelectorAll(".gif__messages__item");
            console.log(new Date(), imgs.length);
            const random = Math.floor(imgs.length * Math.random());
            console.log(new Date(), random, imgs[random]);
            // find a random gif
            imgs[random].click();
            setTimeout(() => {
              document.querySelector(".chatNavBar a").click();
              setTimeout(tinderAssistant.run, generateRandomNumber());
            }, generateRandomNumber());
          }, generateRandomNumber());
        }, generateRandomNumber());
      };

      if (isRunning) {
          try {
              if(document.querySelector('[data-testid="addToHomeScreen"]')) {
                  document.querySelector('[data-testid="addToHomeScreen"]').parentElement.querySelector("button:nth-of-type(2)").click();
                  tinderAssistant.logger("Closing add to homescreen modal");
              }
          } catch(e) {}

        if (
            window.location.toString().indexOf("app/recs") > -1 ||
            window.location.toString().indexOf("app/matches") > -1
        ) {
          const btns = document.querySelectorAll("button");

          if (btns.length > 0) {
            if (btns.length === 7) {
              tinderAssistant.logger(
                  "Congrats! <strong>We</strong>'ve got a match! 🤡"
              );
              matchCount += 1;
              document.getElementById("matchCount").innerHTML = matchCount;

              const matchFound = document.querySelectorAll(".itsAMatch");
              if (matchFound && matchFound.length) {
                // Keep Swiping
                document.querySelectorAll(".itsAMatch button")[0].click();
                setTimeout(
                    tinderAssistant.run,
                    generateRandomNumber(3000, 4000)
                );
              }
              //   sendMessage();
            } else if (
                document.querySelectorAll(".recCard").length > 0 &&
                !document.querySelector(".beacon__circle")
            ) {
              btns[4].click();
              likeCount += 1;
              document.getElementById("likeCount").innerHTML = likeCount;
              setTimeout(tinderAssistant.run, generateRandomNumber());
            } else {
              tinderAssistant.logger("No profiles found. Waiting 4s");
              setTimeout(tinderAssistant.run, generateRandomNumber(3000, 4000));
            }
          } else {
            tinderAssistant.logger("Waiting for photos...");
            setTimeout(tinderAssistant.run, generateRandomNumber());
          }
        } else {
          tinderAssistant.logger("Going to main page to start liking");
          tinderAssistant.goToMainPage();
          setTimeout(tinderAssistant.run, generateRandomNumber(3000, 4000));
        }
      }
    },
    logger(v) {
      const size = 280;
      let txt;
      infoBanner = document.querySelector("#infoBanner");
      if (!infoBanner) {
        document.querySelector("#content").style.marginLeft = `${size}px`;
        const el = document.createElement("div");
        el.id = "infoBanner";
        el.className = "Ov(h) Bgc($c-bg-lite-blue) menu Pos(r) H(100%)";
        el.style.position = "fixed";
        el.style.top = "0px";
        el.style.left = "0px";
        el.style.width = `${size}px`;
        el.style.height = "100%";
        el.style.borderRight = "2px solid #eee";
        el.style.zIndex = 99999;
        document.body.appendChild(el);
        txt = document.createElement("div");
        txt.className = "txt";
        txt.style.overflowY = "auto";
        txt.style.height = "500px";

        infoBanner = document.querySelector("#infoBanner");

        const topBanner = /*html*/ `
          <div class="desktopNavbar Pos(r) Z(2) Trsdu($normal) Tsrdu($regular) CenterAlign Bg($blue-gradient)">
            <a class="Pos(a) D(f) Ai(c) C(#fff) Trsdu($normal) T(50%) Fz($m) Fz($responsiveLarge)--m Fz($ml)--l Whs(nw) Start(50%) Translate(-50%,-50%)" href="/app/profile">
              <span><span>Autopilot</span></span>
            </a>
        </div>        
        `;

        const autopilot = /*html*/ `
              <div class="Mt(20px)--ml Mt(16px)--s">
                <h2 class="settings__title Lts($ls-s) Tt(u) M(0) Fz($xs) Fw($semibold)"><span>Main Settings</span></h2>
                <div class="settings__container Px(8px) settings__section Bgc(#fff)">
                  <div class="menuItem Bgc(#fff)">
                      <label class="menuItem__contents D(f) Jc(c) Fld(c) W(100%) Bgc(#fff) Cur(p)">
                      <a href="#" class="infoBannerActions" style="display: block" title="Click to toggle">
                        <div class="D(f) Jc(sb) Ai(c)">
                            <div class="menuItem__text Ov(h) Tov(e) Py(14px)"><span>Auto like</span></div>
                            <div class="Py(14px)">
                              <div class="toggleSwitch Cur(p) Pe(n)">
                                  <input class="toggleSwitch__input D(n)" name="discoverable" type="checkbox" >
                                  <div class="${offToggle}"></div>
                              </div>
                            </div>
                        </div>
                        </a>    
                      </label>
                  </div>
                </div>
                <p class="settings__bottomSubtitle Px(12px)--s Px(17px)--ml Lts(0) Fw($regular) C($c-secondary) Fz($xs) Ta(s)"><span>Begin automatically swiping right on all profiles.</span></p>
            </div>            
        `;

        const massMessage = /*html*/ `
        <div class="Mt(20px)--ml Mt(16px)--s">
          <h2 class="settings__title Lts($ls-s) Tt(u) M(0) Fz($xs) Fw($semibold)"><span>Messaging Settings</span></h2>
          <div class="settings__container Px(8px) settings__section Bgc(#fff)">
            <div class="menuItem Bgc(#fff)">
                <label class="menuItem__contents D(f) Jc(c) Fld(c) W(100%) Bgc(#fff) Cur(p)">
                <a href="#" class="infoBannerActionsMessage" style="display: block" title="Click to toggle">
                  <div class="D(f) Jc(sb) Ai(c)">
                      <div class="menuItem__text Ov(h) Tov(e) Py(14px)"><span>Auto message</span></div>
                      <div class="Py(14px)">
                        <div class="toggleSwitch Cur(p) Pe(n)">
                            <input class="toggleSwitch__input D(n)" name="discoverable" type="checkbox" >
                            <div class="${offToggle}"></div>
                        </div>
                      </div>
                  </div>
                  </a>    
                </label>
            </div>
          </div>
          <div class="settings__container Px(8px) settings__section Bgc(#fff)">
            <div class="menuItem Bgc(#fff)">
                <label class="menuItem__contents D(f) Jc(c) Fld(c) W(100%) Bgc(#fff) Cur(p)">
                <a href="#" class="infoBannerActionsMessageNewOnly" style="display: block" title="Click to toggle">
                  <div class="D(f) Jc(sb) Ai(c)">
                      <div class="menuItem__text Ov(h) Tov(e) Py(14px)"><span>New matches only</span></div>
                      <div class="Py(14px)">
                        <div class="toggleSwitch Cur(p) Pe(n)">
                            <input class="toggleSwitch__input D(n)" name="discoverable" type="checkbox" >
                            <div class="${offToggle}"></div>
                        </div>
                      </div>
                  </div>
                  </a>    
                </label>
            </div>
          </div>          
          <div class="settings__container Px(8px) settings__section Bgc(#fff)">
          <div class="menuItem Bgc(#fff)">
             <label class="menuItem__contents D(f) Jc(c) Fld(c) W(100%) Bgc(#fff) Cur(t)">
                <div class="D(f) Jc(sb) Ai(c)"></div>
                <div class="menuItem__input Pos(r) W(100%) Cur(t)">
                   <textarea class="Expand D(b) Bd(0) Px(0) Py(15px)" id="messageToSend" placeholder="Your message to send">${defaultMessage}</textarea>
                </div>
             </label>
          </div>
       </div>          
       <p class="settings__bottomSubtitle Px(12px)--s Px(17px)--ml Lts(0) Fw($regular) C($c-secondary) Fz($xs) Ta(s)"><span>The message to send to matches.</span></p>
      </div>            
    `;

        const loggerHeader = /*html*/ `
      <div class="Mt(20px)--ml Mt(16px)--s">
        <h2 class="settings__title Lts($ls-s) Tt(u) M(0) Fz($xs) Fw($semibold)"><span>Activity</span></h2>
      </div>
      `;

        const counterLogs = /*html*/ `
        <div class="Mb(0) Mt(40px) D(f) Jc(sb) Flxb(50%) W(100%)">
          <div class="iconCombo Pos(r) P(16px) W(100%) CenterAlign Bdrs(4px) Bxsh($bxsh-btn) Pt(30px) Mstart(12px)--s Mstart(24px)--ml Mend(5px) Cur(p) Bgc(#fff) Ta(c)">
            <div class="iconCombo__icon Pos(a) Start(50%) T(0) Translate(-50%,-50%)">
                <span class="Sq(48px) Bxsh($bxsh-btn) Bgc(#fff) Bdrs(50%) P(0) CenterAlign Mx(a) productIcon__button productIcon__button--medium">
                  <svg class="Expand" viewBox="0 0 51 51">
                      <path d="M34.6 32.7c1-1 .8-2-.3-2.7l-2-1.2c-1-.6-1.8-2-1.5-3.3L33.3 15c.3-1.2-.2-1.5-1.2-.7l-12.5 12c-1 1-.8 2 .3 2.7l2 1.2c1 .6 1.8 2 1.5 3.4L20.8 44c-.3 1.3.3 1.6 1.2.7l12.6-12z" transform="translate(-1.62 -4.56)" stroke="none" fill="url(#svg-fill-radial__boost)" stroke-width="1" fill-rule="evenodd"></path>
                  </svg>
                </span>
            </div>
            <div class="Heading Flx($flx1)">
                <h3 class="Heading__title Fz($s) Fw($semibold) Fz($ms)--m Mb(10px) My(4px)"><span id="likeCount">${likeCount}</span><br/><span> Liked</span></h3>
            </div>
          </div>
          <div class="iconCombo Pos(r) P(16px) W(100%) CenterAlign Bdrs(4px) Bxsh($bxsh-btn) Pt(30px) Mend(12px)--s Mend(24px)--ml Mstart(5px)--ml Cur(p) Bgc(#fff) Ta(c)">
            <div class="iconCombo__icon Pos(a) Start(50%) T(0) Translate(-50%,-50%)">
                <span class="Sq(48px) Bxsh($bxsh-btn) Bgc(#fff) Bdrs(50%) P(0) CenterAlign Mx(a) productIcon__button productIcon__button--medium">
                  <svg class="Expand" viewBox="0 0 54 54">
                      <path d="M38.87 23.28c2.72.3 3.57 2.9 1.55 4.76l-2.37 2.16-2.57 2.35c.26-.24.35-.5.28-.84l.7 3.42c.3 1.54.54 2.65.64 3.14.55 2.7-1.67 4.3-4.05 2.94l-2.78-1.58-3.02-1.72c.3.17.58.17.88 0-.2.1-.2.1-.94.53l-2.1 1.2-2.77 1.57c-2.38 1.36-4.6-.25-4.05-2.94l.64-3.14.5-2.34.2-1.07c-.07.35.02.6.28.85l-.8-.74-1.77-1.6-2.37-2.16c-2.02-1.85-1.18-4.46 1.55-4.76l3.2-.36 3.45-.38c-.35.04-.58.2-.72.52l1.44-3.18 1.3-2.9c1.15-2.52 3.9-2.52 5.03 0l1.3 2.9 1 2.2.45.98c-.14-.32-.37-.48-.72-.52l3.46.38 3.17.36z" transform="translate(-0.87, -2.56)" fill-rule="evenodd" fill="url(#svg-fill-linear__super-like)" stroke="none" stroke-width="1"></path>
                  </svg>
                </span>
            </div>
            <div class="Heading Flx($flx1)">
                <h3 class="Heading__title Fz($s) Fw($semibold) Fz($ms)--m Mb(10px) My(4px)"><span id="matchCount">${matchCount}</span><br/><span> Matched</span></h3>
            </div>
          </div>
      </div>      
      `;

        infoBanner.innerHTML =
            topBanner + counterLogs + autopilot + massMessage + loggerHeader;
        el.appendChild(txt);
      }

      const now = new Date();
      txt = infoBanner.querySelector(".txt");
      const message = /*html*/ `<p class="settings__bottomSubtitle Px(12px)--s Px(17px)--ml Lts(0) Fw($regular) C($c-secondary) Fz($xs) Ta(s)"><span>${`0${now.getHours()}`.slice(
          -2
      )}:${`0${now.getMinutes()}`.slice(-2)}:${`0${now.getSeconds()}`.slice(
          -2
      )}.</span> ${v}</span></p>`;
      txt.innerHTML += message;
      txt.scrollTop = txt.scrollHeight;
    },
    init() {
      tinderAssistant.logger("Welcome to Tinder Autopilot");
      tinderAssistant.events();
    }
  };
})();

tinderAssistant.init();
