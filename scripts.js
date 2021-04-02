let prevDispItem = document.querySelector(".display_previous-operand");
let selectedOperation = document.querySelector(".display_operation");
let currentDispItem1 = document.querySelector(".display_current-operand");

let digitBtnArray = document.querySelectorAll(".digit-button");
let actionBtnArray = document.querySelectorAll(".action-button");
let clearAll = document.getElementsByClassName("clear-btn")[0];
let delDigit = document.getElementsByClassName("del-btn")[0];
let equalButton = document.getElementsByClassName("button-equal")[0];
let logarithm = document.getElementsByClassName("logarithm-operation")[0];

class Calculator {
  constructor(prevDispItem, selectedOperationItem, currentDispItem1) {
    this.prevDispItem = prevDispItem;
    this.selectedOperationItem = selectedOperationItem;
    this.currentDispItem = currentDispItem1;
    this.isError = false;
    this.isCalculatedResult = false;
  }

  addDigitToCurrent(digit) {
    if (this.isError) return;
    if (this.isCalculatedResult) {
      this.currentDispItem.innerText = '0';
      this.isCalculatedResult = false;
    }
    switch (digit) {
      case "+/-":
        if (this.currentDispItem.innerText[0] === "-") {
          this.currentDispItem.innerText = this.currentDispItem.innerText.slice(
            1
          );
          return;
        }
        this.currentDispItem.innerText = `-${this.currentDispItem.innerText}`;
        return;
      case ".":
        if (!this.currentDispItem.innerText.includes(digit)) {
          this.currentDispItem.innerText =
            this.currentDispItem.innerText + digit;
        }
        return;
      default:
        if (
          this.currentDispItem.innerText.length === 1 &&
          this.currentDispItem.innerText === "0"
        ) {
          this.currentDispItem.innerText = "";
        }
        this.currentDispItem.innerText = `${this.currentDispItem.innerText}${digit}`;
        return;
    }
  }

  deleteDigit() {
    if (this.isError) return;
    if (this.currentDispItem.innerText.length > 0) {
      this.currentDispItem.innerText = this.currentDispItem.innerText.slice(
        0,
        this.currentDispItem.innerText.length - 1
      );
      if (
        this.currentDispItem.innerText === "-" ||
        this.currentDispItem.innerText === ""
      ) {
        this.currentDispItem.innerText = "0";
      }
    }
  }

  clearAll() {
    this.currentDispItem.innerText = "0";
    this.prevDispItem.innerText = "";
    this.selectedOperationItem.innerText = "";
    this.isError = false;
  }

  applyOperation(operator) {
    if (this.isError) return;
    this.getCalculateResult();
    function isReadyToApplyOperation() {
      if (this.currentDispItem.innerText !== "") {
        return true;
      }
      return false;
    }
    if (isReadyToApplyOperation.call(this)) {
      this.prevDispItem.innerText = this.currentDispItem.innerText;
      this.selectedOperationItem.innerText = operator;
      this.currentDispItem.innerText = "0";
    }
  }

  getCalculateResult() {
    if (this.isError) return;
    function clearOldData() {
      this.prevDispItem.innerText = "";
      this.selectedOperationItem.innerText = "";
    }
    function fixFraction(toFix, fixLevel) {
      return fixLevel > 0 ? parseFloat(toFix.toFixed(fixLevel)) : toFix;
    }
    if (
      this.selectedOperationItem.innerText === "" ||
      this.currentDispItem.innerText === ""
    )
      return;

    let y = this.currentDispItem.innerText;
    let x = this.prevDispItem.innerText;
    let xDigitAfterPoint = x.includes(".") ? x.slice(x.indexOf(".") + 1) : "";
    let yDigitAfterPoint = y.includes(".") ? y.slice(y.indexOf(".") + 1) : "";
    let digitAfterPoint =
      xDigitAfterPoint.length > yDigitAfterPoint.length
        ? xDigitAfterPoint.length
        : yDigitAfterPoint.length;
    y = parseFloat(y);
    x = parseFloat(x);

    this.isCalculatedResult = true;
    switch (this.selectedOperationItem.innerText) {
      case "+":
        this.currentDispItem.innerText = fixFraction
          .call(this, x + y, digitAfterPoint)
          .toString();
        clearOldData.call(this);
        return;
      case "-":
        this.currentDispItem.innerText = fixFraction
          .call(this, x - y, digitAfterPoint)
          .toString();
        clearOldData.call(this);
        return;
      case "*":
        this.currentDispItem.innerText = fixFraction
          .call(this, x * y, digitAfterPoint * 2)
          .toString();
        clearOldData.call(this);
        return;
      case "/":
        if (this.currentDispItem.innerText === "0") {
          this.showError();
          return;
        }
        this.currentDispItem.innerText = (x / y).toString();
        clearOldData.call(this);
        return;
      case "x^y":
        if (Math.trunc(y) !== y) {
          this.showError();
          return;
        }
        this.currentDispItem.innerText = fixFraction
          .call(this, x ** y, digitAfterPoint)
          .toString();
        clearOldData.call(this);
        return;
      case "root":
        if (Math.trunc(y) !== y) {
          this.showError();
          return;
        }
        this.currentDispItem.innerText = fixFraction
          .call(this, Math.pow(x, 1 / y), digitAfterPoint)
          .toString();
        if (this.currentDispItem.innerText === 'NaN')  this.showError();
        clearOldData.call(this);
        return;
      case "%":
        if (y < 0) {
          this.showError();
          return;
        }
        this.currentDispItem.innerText = fixFraction
          .call(this, (x * y) / 100, digitAfterPoint)
          .toString();
        clearOldData.call(this);
        return;
      case "RND":
        if (x >= 0 && digitAfterPoint === 0 && y > x) {
          this.currentDispItem.innerText =
            Math.floor(Math.random() * (y - x + 1)) + x;
          clearOldData.call(this);
          return;
        } else {
          this.showError();
          return;
        }
      default:
        showError();
        return;
    }
  }

  calculateLogarithm() {
    if (this.isError) return;
    if (
      this.currentDispItem.innerText === "" ||
      parseFloat(this.currentDispItem.innerText) <= 0
    ) {
      showError();
      return;
    }
    this.currentDispItem.innerText = Math.log(
      parseFloat(this.currentDispItem.innerText)
    );
  }

  showError() {
    this.isError = true;
    this.currentDispItem.innerText = "ERROR";
  }
}

calc = new Calculator(prevDispItem, selectedOperation, currentDispItem1);

digitBtnArray.forEach((el) => {
  el.addEventListener("click", (ev) =>
    calc.addDigitToCurrent(ev.target.innerText)
  );
});
actionBtnArray.forEach((el) => {
  el.addEventListener("click", (ev) =>
    calc.applyOperation(ev.target.innerText)
  );
});
delDigit.onclick = () => calc.deleteDigit();
clearAll.onclick = () => calc.clearAll();
equalButton.onclick = () => calc.getCalculateResult();
logarithm.onclick = () => calc.calculateLogarithm();
