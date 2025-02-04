import { PERFECT_PERCENT } from './constants';
import { convertDegreeToBoxShadowOffset } from './helpers';
import { Score } from './Score';

export class Level {
  targetValue: number;
  userSelection: number;
  displayUserSelectionElement: HTMLElement;
  referenceEl: HTMLElement;
  targetEl: HTMLElement;
  targetElProperty: string;
  min: number;
  max: number;
  userSelectEl: HTMLInputElement;
  levelNumber: number;
  messageEl: HTMLDivElement;
  score: Score;
  isCircular: boolean;

  constructor(
    levelNumber: number,
    targetValue: number,
    userSelection: number,
    displayUserSelectionElement: HTMLElement,
    referenceEl: HTMLElement,
    targetElProperty: string,
    min: number,
    max: number,
    targetEl: HTMLElement,
    userSelectEl: HTMLInputElement,
    messageEl: HTMLDivElement,
    score: Score,
    isCircular = false
  ) {
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
    this.messageEl = messageEl;
    this.score = score;
    this.isCircular = isCircular;

    this.updateGameUI();
  }

  play(): void {
    this.referenceEl.style.setProperty(
      this.targetElProperty,
      this.formatPropertyValueToStringForLevel(this.levelNumber, this.targetValue)
    );

    this.userSelectEl.addEventListener('input', (e) => {
      this.userSelection = parseInt((e.target as HTMLInputElement).value);
      this.updateGameUI();
    });
  }

  updateGameUI(): void {
    // Update the element that displays user selection if it exists
    if (this.displayUserSelectionElement) {
      this.displayUserSelectionElement.textContent = `${this.userSelection}`;
    }

    // Update the target element if it exists
    if (this.targetEl) {
      this.targetEl.style.setProperty(
        this.targetElProperty,
        this.formatPropertyValueToStringForLevel(this.levelNumber, this.userSelection)
      );
    }
  }

  checkAnswer(): boolean {
    let difference;
    let percentageDifference;

    if (this.isCircular) {
      difference = Math.abs(this.targetValue - this.userSelection);
      // Adjust difference for angle wrap-around
      difference = Math.min(difference, 360 - difference);

      // calculate percentage
      percentageDifference = (difference / 360) * 100;
    } else {
      difference = Math.abs(this.targetValue - this.userSelection);
      // calculate percentage difference based on the range
      const range = this.max - this.min;
      percentageDifference = (difference / range) * 100;
    }

    // console.log(`target: ${this.targetValue} user: ${this.userSelection}`);
    // console.log(`difference: ${difference} percentage: ${percentageDifference}`);

    if (percentageDifference <= PERFECT_PERCENT) {
      return true;
    }

    return false;
  }
  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  setTargetValue(min: number, max: number) {
    this.targetValue = this.getRandomInt(min, max);
  }

  formatPropertyValueToStringForLevel(level: number, value: number): string {
    //({ value });
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
      // opacity
      return `${value}%`;
    }
    if (level === 6) {
      // box shadow
      const boxShadowString = getComputedStyle(this.referenceEl).boxShadow;
      // console.log('Box Shadow String:', boxShadowString);
      const splitString = boxShadowString.split(' ');
      // Update the value at the position of the blur radius in the shadow (5rd value, index 4)
      splitString[5] = `${value}px`;
      const newBoxShadowString = splitString.join(' ');
      return newBoxShadowString;
    }

    if (level === 7) {
      // get reference box shadow value
      const boxShadowString = getComputedStyle(this.referenceEl).boxShadow;
      // 'rgba(0, 0px 0px 0.5) -14px 14px 10px 0px inset'
      const splitString = boxShadowString.split(' ');

      // split into components
      const horizontalOffset = parseInt(splitString[4], 10);
      const verticalOffset = parseInt(splitString[5], 10);
      const distance = Math.sqrt(
        horizontalOffset * horizontalOffset + verticalOffset * verticalOffset
      );

      const { offsetX, offsetY } = convertDegreeToBoxShadowOffset(value, distance);

      // Update the value at the position of the vertical offset in the shadow (4th value, index 3)
      splitString[4] = `${offsetX}px`;
      splitString[5] = `${offsetY}px`;
      const newBoxShadowString = splitString.join(' ');
      return newBoxShadowString;
    }
    if (level === 8) {
      // padding
      return `${value}px`;
    }
    return '';
  }
}
