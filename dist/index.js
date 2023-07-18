"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/utils/constants.ts
  var PENALTY_DURATION = 5e3;
  var SHAKE_DURATION = 500;
  var LEVEL_PROPERTIES = {
    1: {
      cssProperty: "-webkit-text-stroke-width",
      min: 1,
      max: 10
    },
    2: {
      cssProperty: "font-variation-settings",
      min: 25,
      max: 152
    },
    3: {
      cssProperty: "font-variation-settings",
      min: 100,
      max: 900
    },
    4: {
      cssProperty: "border-radius",
      min: 0,
      max: 32
    },
    5: {
      cssProperty: "opacity",
      min: 0,
      max: 100
    },
    6: {
      cssProperty: "box-shadow",
      min: 0,
      max: 30
    },
    7: {
      cssProperty: "box-shadow",
      min: 0,
      max: 360
    },
    8: {
      cssProperty: "padding",
      min: 0,
      max: 50
    }
  };
  var PERFECT_PERCENT = 4;
  var GOOD_PERCENT = 20;
  var POINTS_FOR_PERFECT = 2;
  var POINTS_FOR_GOOD = 1;
  var CLASSNAMES = {
    SUCCESS: "is-success",
    ERROR: "is-error",
    ACTIVE: "is-active",
    SHAKE: "shake-element"
  };

  // src/utils/helpers.ts
  function convertDegreeToBoxShadowOffset(angleInDegree, distance) {
    angleInDegree -= 90;
    if (angleInDegree < 0) {
      angleInDegree += 360;
    }
    const angleInRadians = angleInDegree * (Math.PI / 180);
    const offsetX = Math.floor(distance * Math.cos(angleInRadians));
    const offsetY = Math.floor(distance * Math.sin(angleInRadians));
    return { offsetX, offsetY };
  }
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = (time % 60).toFixed(2);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(5, "0")}`;
  }
  function formatHumanReadableTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const minuteStr = minutes === 1 ? "minute" : "minutes";
    const secondStr = seconds === 1 ? "second" : "seconds";
    if (minutes === 0) {
      return `${seconds.toFixed(2)} ${secondStr}`;
    }
    return `${minutes} ${minuteStr} and ${seconds.toFixed(2)} ${secondStr}`;
  }

  // src/utils/Stopwatch.ts
  var Stopwatch = class {
    // <-- Define an event callbacks object
    constructor(startTime, timeElement) {
      this.startTime = startTime;
      this.timeElement = timeElement;
      this.timeElapsed = this.startTime;
      this.timeElement.textContent = formatTime(this.timeElapsed);
    }
    countup = 0;
    // holds the setInterval
    timeElapsed;
    // holds the current elapsed time
    eventCallbacks = {};
    on(eventName, callback) {
      if (!this.eventCallbacks[eventName]) {
        this.eventCallbacks[eventName] = [];
      }
      this.eventCallbacks[eventName].push(callback);
    }
    emit(eventName) {
      if (this.eventCallbacks[eventName]) {
        this.eventCallbacks[eventName].forEach((callback) => callback());
      }
    }
    start() {
      const startTime = performance.now();
      let previousTime = startTime;
      const update = () => {
        const currentTime = performance.now();
        const elapsed = (currentTime - startTime) / 1e3;
        this.timeElapsed = this.startTime + elapsed;
        if (this.timeElement) {
          this.timeElement.textContent = formatTime(this.timeElapsed);
        }
        previousTime = currentTime;
        this.countup = requestAnimationFrame(update);
      };
      this.countup = requestAnimationFrame(update);
    }
    stop() {
      clearInterval(this.countup);
    }
    reset() {
      this.stop();
      this.timeElapsed = this.startTime;
      this.timeElement.textContent = formatTime(this.timeElapsed);
    }
    getTime() {
      const secondsAccurate = this.timeElapsed + performance.now() % 1e3 / 1e3;
      return Number(secondsAccurate.toFixed(2));
    }
    getAccurateTime() {
      const secondsAccurate = this.timeElapsed + performance.now() % 1e3 / 1e3;
      return secondsAccurate.toFixed(2);
    }
  };

  // src/utils/Level.ts
  var Level = class {
    targetValue;
    userSelection;
    displayUserSelectionElement;
    referenceEl;
    targetEl;
    targetElProperty;
    min;
    max;
    userSelectEl;
    levelNumber;
    messageEl;
    score;
    isCircular;
    constructor(levelNumber, targetValue, userSelection, displayUserSelectionElement, referenceEl, targetElProperty, min, max, targetEl, userSelectEl, messageEl2, score2, isCircular = false) {
      this.levelNumber = levelNumber;
      this.targetValue = targetValue;
      this.userSelection = userSelection;
      this.displayUserSelectionElement = displayUserSelectionElement;
      this.referenceEl = referenceEl;
      this.targetElProperty = targetElProperty;
      this.min = min;
      this.max = max;
      this.targetEl = targetEl;
      this.userSelectEl = userSelectEl;
      this.messageEl = messageEl2;
      this.score = score2;
      this.isCircular = isCircular;
      this.updateGameUI();
    }
    play() {
      this.referenceEl.style.setProperty(
        this.targetElProperty,
        this.formatPropertyValueToStringForLevel(this.levelNumber, this.targetValue)
      );
      this.userSelectEl.addEventListener("input", (e) => {
        this.userSelection = parseInt(e.target.value);
        this.updateGameUI();
      });
    }
    updateGameUI() {
      if (this.displayUserSelectionElement) {
        this.displayUserSelectionElement.textContent = `${this.userSelection}`;
      }
      if (this.targetEl) {
        this.targetEl.style.setProperty(
          this.targetElProperty,
          this.formatPropertyValueToStringForLevel(this.levelNumber, this.userSelection)
        );
      }
    }
    checkAnswer() {
      let difference;
      let percentageDifference;
      if (this.isCircular) {
        difference = Math.abs(this.targetValue - this.userSelection);
        difference = Math.min(difference, 360 - difference);
        percentageDifference = difference / 360 * 100;
      } else {
        difference = Math.abs(this.targetValue - this.userSelection);
        const range = this.max - this.min;
        percentageDifference = difference / range * 100;
      }
      console.log(`target: ${this.targetValue} user: ${this.userSelection}`);
      console.log(`difference: ${difference} percentage: ${percentageDifference}`);
      if (percentageDifference <= PERFECT_PERCENT) {
        return true;
      }
      return false;
    }
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    setTargetValue(min, max) {
      this.targetValue = this.getRandomInt(min, max);
    }
    formatPropertyValueToStringForLevel(level, value) {
      if (level === 1) {
        return `${value}px`;
      }
      if (level === 2) {
        return `"wdth" ${value}`;
      }
      if (level === 3) {
        return `"wght" ${value}`;
      }
      if (level === 4) {
        return `${value}px`;
      }
      if (level === 5) {
        return `${value}%`;
      }
      if (level === 6) {
        const boxShadowString = getComputedStyle(this.referenceEl).boxShadow;
        console.log("Box Shadow String:", boxShadowString);
        const splitString = boxShadowString.split(" ");
        splitString[5] = `${value}px`;
        const newBoxShadowString = splitString.join(" ");
        return newBoxShadowString;
      }
      if (level === 7) {
        const boxShadowString = getComputedStyle(this.referenceEl).boxShadow;
        const splitString = boxShadowString.split(" ");
        const horizontalOffset = parseInt(splitString[4], 10);
        const verticalOffset = parseInt(splitString[5], 10);
        const distance = Math.sqrt(
          horizontalOffset * horizontalOffset + verticalOffset * verticalOffset
        );
        const { offsetX, offsetY } = convertDegreeToBoxShadowOffset(value, distance);
        splitString[4] = `${offsetX}px`;
        splitString[5] = `${offsetY}px`;
        const newBoxShadowString = splitString.join(" ");
        return newBoxShadowString;
      }
      if (level === 8) {
        return `${value}px`;
      }
      return "";
    }
  };

  // src/utils/Score.ts
  var Score = class {
    constructor(scoreElement) {
      this.scoreElement = scoreElement;
      this.scoreElement.textContent = this.currentScore.toString();
    }
    currentScore = 0;
    updateScore(targetValue, userSelection, isCircular = false) {
      const points = this.calculateScore(targetValue, userSelection, isCircular);
      this.currentScore += points;
      this.scoreElement.textContent = this.currentScore.toString();
      return points;
    }
    calculateScore(targetValue, userSelection, isCircular = false) {
      let difference;
      let percentageDifference;
      if (isCircular) {
        difference = Math.abs(targetValue - userSelection);
        difference = Math.min(difference, 360 - difference);
        percentageDifference = difference / 360 * 100;
      } else {
        difference = Math.abs(targetValue - userSelection);
        percentageDifference = difference / targetValue * 100;
      }
      if (percentageDifference <= PERFECT_PERCENT) {
        return POINTS_FOR_PERFECT;
      }
      if (percentageDifference <= GOOD_PERCENT) {
        return POINTS_FOR_GOOD;
      }
      return 0;
    }
    reset() {
      this.currentScore = 0;
      this.scoreElement.textContent = this.currentScore.toString();
    }
    getScore() {
      return this.currentScore;
    }
  };

  // src/index.ts
  var { fetch } = window;
  var referenceEls = document.querySelectorAll('[data-game="reference-el"]' /* REFERENCE_ELEMENTS */);
  var targetEls = document.querySelectorAll('[data-game="target-el"]' /* TARGET_ELEMENTS */);
  var displaySelectEls = document.querySelectorAll('[data-game="display-user-selection"]' /* DISPLAY_SELECT */);
  var userSelectEls = document.querySelectorAll('[data-game="user-select-el"]' /* USER_SELECT_ELEMENTS */);
  var submitButtons = document.querySelectorAll('[data-game="submit-button"]' /* SUBMIT_BUTTONS */);
  var nextRoundButtons = document.querySelectorAll('[data-game="next-button"]' /* NEXT_ROUND_BUTTONS */);
  var messageEl = document.querySelector('[data-game="message-el"]' /* MESSAGE_ELEMENT */);
  var tabLinks = document.querySelectorAll(".w-tab-link" /* TAB_LINKS */);
  var timerEl = document.querySelector('[data-game="time-remaining"]' /* TIMER_ELEMENT */);
  var scoreEl = document.querySelector('[data-game="score"]' /* SCORE_ELEMENT */);
  var roundEl = document.querySelector('[data-game="round-number"]' /* ROUND_ELEMENT */);
  var startGameButton = document.querySelector('[data-game="start-game"]' /* START_GAME_BUTTON */);
  var countdownEl = document.querySelector('[data-game="countdown"]' /* COUNTDOWN_ELEMENT */);
  var introEl = document.querySelector('[data-game="intro"]' /* INTRO_ELEMENT */);
  var gameEl = document.querySelector('[data-game="game"]' /* GAME_ELEMENT */);
  var endEl = document.querySelector('[data-game="end"]' /* END_ELEMENT */);
  var endTextEl = document.querySelector('[data-game="end-text"]' /* END_TEXT_ELEMENT */);
  var tryAgainButton = document.querySelector('[data-game="try-again"]' /* TRY_AGAIN_BUTTON */);
  var glowTopEmbed = document.querySelector('[data-game="glow-top-embed"]' /* GLOW_TOP_EMBED */);
  var penaltyOverlay = document.querySelector('[data-game="penalty-overlay"]' /* PENALTY_OVERLAY */);
  var gameWindow = document.querySelector('[data-game="game-window"]' /* GAME_WINDOW */);
  var nameEl = document.querySelector('[data-game="name"]' /* NAME_ELEMENT */);
  var emailEl = document.querySelector('[data-game="email"]' /* EMAIL_ELEMENT */);
  var socialContentEl = document.querySelector('[fs-social-share="content"]' /* SOCIAL_CONTENT */);
  if (!nameEl || !emailEl) {
    throw new Error("Error retrieving name or email elements.");
  }
  var currentLevel = 1;
  var levels = [];
  var numLevels = Object.keys(LEVEL_PROPERTIES).length;
  if (!scoreEl || !roundEl || !messageEl || !timerEl || !countdownEl || !introEl || !gameEl || !endEl || !endTextEl || !tryAgainButton || !startGameButton || !glowTopEmbed || !penaltyOverlay || !gameWindow) {
    throw new Error("Error retrieving necessary game elements.");
  }
  var score = new Score(scoreEl);
  var stopwatch = new Stopwatch(0, timerEl);
  roundEl.textContent = currentLevel.toString().padStart(2, "0");
  hideNextShowSubmit();
  function createLevels() {
    levels.length = 0;
    for (let i = 1; i <= numLevels; i++) {
      if (!messageEl || !timerEl) {
        throw new Error("Message and timer elements are required");
      }
      const level = new Level(
        i,
        // level number
        getRandomInt(parseInt(userSelectEls[i - 1].min, 10), parseInt(userSelectEls[i - 1].max, 10)),
        // target value
        parseInt(userSelectEls[i - 1].value, 10),
        // user selection
        displaySelectEls[i - 1],
        // element displaying user selection
        referenceEls[i - 1],
        // reference element
        LEVEL_PROPERTIES[i].cssProperty,
        // target element property
        LEVEL_PROPERTIES[i].min,
        // target element unit
        LEVEL_PROPERTIES[i].max,
        // target element unit
        targetEls[i - 1],
        userSelectEls[i - 1],
        messageEl,
        score,
        i === 7 ? true : false
        // level 7 score is based on degrees
      );
      levels.push(level);
    }
  }
  function handleStartGameButtonClicked() {
    if (!introEl || !gameEl || !countdownEl) {
      throw new Error("Intro and game elements are required");
    }
    if (!countdownEl) {
      throw new Error("Countdown element is required");
    }
    introEl.style.setProperty("display", "none");
    gameEl.style.setProperty("display", "block");
    createLevels();
    levels[currentLevel - 1].play();
    const countdown = setInterval(() => {
      const currentCountdown = parseInt(countdownEl.textContent || "3", 10);
      if (currentCountdown === 1) {
        clearInterval(countdown);
        simulateClick(tabLinks[currentLevel]);
        stopwatch.start();
        levels[currentLevel - 1].play();
      } else {
        countdownEl.textContent = (currentCountdown - 1).toString();
      }
    }, 1e3);
  }
  function resetGame() {
    if (!roundEl || !countdownEl || !score || !stopwatch) {
      throw new Error("Error resetting the game");
    }
    countdownEl.textContent = "3";
    score.reset();
    stopwatch.reset();
    currentLevel = 1;
    simulateClick(tabLinks[0]);
    roundEl.textContent = currentLevel.toString().padStart(2, "0");
    createLevels();
    submitButtons.forEach((button) => {
      button.style.setProperty("display", "block");
    });
    nextRoundButtons.forEach((button) => {
      button.style.setProperty("display", "none");
    });
  }
  function gameOver() {
    stopwatch.stop();
    stopwatch.reset();
    if (!gameEl || !endEl || !endTextEl) {
      throw new Error("Game and end elements are required");
    }
    const socialContentEl2 = document.querySelector('[data-game="social-content"]');
    const timeDisplay = formatHumanReadableTime(stopwatch.getTime());
    const message = `I beat the Eyeballing Game in ${timeDisplay}! Can you beat my time? Give it a try!`;
    endTextEl.textContent = `Congratulations! You finished the game in ${timeDisplay}.`;
    if (socialContentEl2) {
      socialContentEl2.setAttribute("fs-social-share", message);
    }
    gameEl.style.setProperty("display", "none");
    endEl.style.setProperty("display", "block");
    fetch("https://hooks.zapier.com/hooks/catch/14554026/3my5lpi/", {
      method: "POST",
      body: JSON.stringify({
        time: stopwatch.getAccurateTime(),
        name: nameEl.value,
        email: emailEl.value
      })
    }).then((response) => response.json()).then((data) => console.log("Success:", data)).catch((error) => console.error("Error:", error));
  }
  function handleAnswer(isCorrect) {
    if (!messageEl || !glowTopEmbed || !penaltyOverlay || !gameWindow)
      return;
    if (isCorrect) {
      glowTopEmbed.classList.add(CLASSNAMES.SUCCESS);
      messageEl.classList.add(CLASSNAMES.SUCCESS);
      messageEl.textContent = "Congratulations! You nailed it";
      hideSubmitShowNext();
      setTimeout(() => {
        glowTopEmbed.classList.remove(CLASSNAMES.SUCCESS);
      }, 800);
    } else {
      let penaltyTime = (PENALTY_DURATION - 1) / 1e3;
      messageEl.textContent = `Incorrect! Try again in ${Math.round(penaltyTime)} ${penaltyTime === 1 ? "second" : "seconds"}.`;
      penaltyOverlay.classList.add(CLASSNAMES.ACTIVE);
      glowTopEmbed.classList.add(CLASSNAMES.ERROR);
      messageEl.classList.add(CLASSNAMES.ERROR);
      gameWindow.classList.add(CLASSNAMES.SHAKE);
      setTimeout(() => {
        gameWindow.classList.remove(CLASSNAMES.SHAKE);
      }, SHAKE_DURATION);
      const penaltyInterval = setInterval(() => {
        messageEl.textContent = `Incorrect! Try again in ${Math.round(penaltyTime)} ${penaltyTime === 1 ? "second" : "seconds"}.`;
        penaltyTime -= 1;
      }, 1e3);
      setTimeout(() => {
        clearInterval(penaltyInterval);
        penaltyOverlay.classList.remove(CLASSNAMES.ACTIVE);
        glowTopEmbed.classList.remove(CLASSNAMES.ERROR);
        messageEl.classList.remove(CLASSNAMES.ERROR);
      }, PENALTY_DURATION);
    }
  }
  startGameButton.addEventListener("click", () => {
    handleStartGameButtonClicked();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "q") {
      gameOver();
    }
  });
  submitButtons.forEach((button) => {
    button.addEventListener("click", handleSubmitButtonClicked);
  });
  nextRoundButtons.forEach((button) => {
    button.addEventListener("click", handleNextRoundButtonClicked);
  });
  tryAgainButton.addEventListener("click", () => {
    resetGame();
    endEl.style.setProperty("display", "none");
    introEl.style.setProperty("display", "block");
  });
  function handleSubmitButtonClicked() {
    if (!messageEl || !glowTopEmbed)
      return;
    const isCorrect = levels[currentLevel - 1].checkAnswer();
    handleAnswer(isCorrect);
  }
  function handleNextRoundButtonClicked() {
    if (!roundEl) {
      throw new Error("Round element is required");
    }
    if (!glowTopEmbed || !messageEl)
      return;
    currentLevel += 1;
    glowTopEmbed.classList.remove(CLASSNAMES.SUCCESS);
    messageEl.classList.remove(CLASSNAMES.SUCCESS);
    if (currentLevel <= levels.length) {
      roundEl.textContent = currentLevel.toString().padStart(2, "0");
      simulateClick(tabLinks[currentLevel]);
      levels[currentLevel - 1].play();
      setTimeout(() => {
        hideNextShowSubmit();
      }, 200);
    } else {
      gameOver();
    }
  }
  function hideSubmitShowNext() {
    submitButtons.forEach((button) => {
      button.style.setProperty("display", "none");
    });
    setTimeout(() => {
      handleNextRoundButtonClicked();
    }, 1e3);
  }
  function hideNextShowSubmit() {
    submitButtons.forEach((button) => {
      button.style.setProperty("display", "block");
    });
    nextRoundButtons.forEach((button) => {
      button.style.setProperty("display", "none");
    });
  }
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function simulateClick(element) {
    const clickEvent = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: false
    });
    element.dispatchEvent(clickEvent);
  }
})();
//# sourceMappingURL=index.js.map
