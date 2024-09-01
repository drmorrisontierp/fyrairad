

//CHECK
function removeByValue(list, value) {
  for (let x = 0; x < list.length; x++) {
    if (list[x] === value) {
      newlist = list.splice(x, 1)
    }
  }
  return list;
}

function customConfirm(_use, text, _player) {
  return new Promise((resolve, reject) => {
    let svgInnerHtml = "";
    if (_use == "win") {
      svgInnerHtml = _player ? winSign + playerOneWin : winSign + playerTwoWin;
    } else if (_use == "gameWon") {
      svgInnerHtml = _player ? gameWonSignX : gameWonSignO;
    } else {
      svgInnerHtml = warningSign
    }
    const mainDiv = document.createElement("div")
    const textDiv = document.createElement("div")
    const buttonDiv = document.createElement("div")
    const warningDiv = document.createElement("div")
    const warning = createSVGElement("svg")
    const _okButton = document.createElement("div")
    const _cancelButton = document.createElement("div")
    warning.innerHTML = svgInnerHtml
    _cancelButton.id = "cancel-button"
    _cancelButton.className = "confirm-button"
    _okButton.id = "ok-button"
    _okButton.className = "confirm-button"
    buttonDiv.id = "button-div"
    textDiv.id = "text-div"
    mainDiv.id = "confirm"
    warningDiv.id = "warning-div"
    _okButton.innerHTML = "OK";
    _cancelButton.innerHTML = "Cancel";
    _okButton.addEventListener("click", async () => {
      mainDiv.remove(); // Remove the confirmation dialog
      await null; // Allow the DOM to update before resolving the promise
      resolve(true);
    });
    _cancelButton.addEventListener("click", async () => {
      mainDiv.remove(); // Remove the confirmation dialog
      await null; // Allow the DOM to update before resolving the promise
      resolve(false);
    });
    _cancelButton.focus()
    textDiv.innerHTML = text;
    if (_use == "win") {
      setAttributes(warning, {
        "viewBox": "0 0 200 200",
        "height": "100%",
        "width": "100%",
        "style": "margin-left: 1vw;",
      })
    } else if (_use == "gameWon") {
      setAttributes(warning, {
      "style": "margin: 4vh 5vw 0 -4vw;",
      "fill":"#000000",
      "width": "100%",
      "height": "100%",
      "viewBox": "0 0 150 150",
    })
    } else {
      setAttributes(warning, {
        "viewBox": "0 0 490 470",
        "height": "25vh",
        "style": "margin-left: 6vw;",
      })
    }
    buttonDiv.appendChild(_okButton)
    buttonDiv.appendChild(_cancelButton)
    warningDiv.appendChild(warning)
    mainDiv.appendChild(warningDiv)
    mainDiv.appendChild(textDiv)
    mainDiv.appendChild(buttonDiv)
    document.getElementById("app").appendChild(mainDiv)
  })
}

const ui = {
  confirm: async (use, message, player) => customConfirm(use, message, player),
}

async function confirmWin(player) {
  let winner = player ? playerNames[0] : playerNames[1];
  const confirm = await ui.confirm("win", `Congratulations ${winner} on a fine win. A rematch ?`, player);
  if (confirm) {
    reset(2);
  } else {
    reset(0);
  }
}

async function confirmWonGame(player) {
  let winner = player ? playerNames[0] : playerNames[1];
  const confirm = await ui.confirm("gameWon", `Congratulations ${winner}. You have won the match!`, player);
  if (confirm) {
    reset(0);
  } else {
    reset(0);
  }
}

async function confirmReset() {
  pauseTimer(true)
  changeClick(false)
  const confirm = await ui.confirm("warning", "Are you sure you want to reset", player);
  if (confirm) {
    reset(1);
  } else {
    changeClick(true)
    pauseTimer(false)
    return 0;
  }
}

async function confirmChoice(choice) {
  let _count = 0;
  let _text = "";
  let _flag = true;
  if (choice == "multi") {
    _text = `Are you sure you want to start a multiplication game, level ${level} ?`;
  }
  if (choice == "negative") {
    _text = `Are you sure you want to start a negative numbers game, option ${options} ?`;
  }
  if (choice == "custom") {
    for (const value of Object.values(customOpps)) {
      if (value) _count++;
    }
    if (_count > 0) {
      _text = `Are you sure you want to start a custom game?`
    } else {
      _text = "You have to select at least one operator!"
      _flag = false;
    }
  }
  const confirm = await ui.confirm("warning", _text, player);
  if (confirm && _flag) {
    start(choice);
  } else {
    return 0;
  }
}

function changeStyle(element, dict) {
  for ([key, value] of Object.entries(dict)) {
    element.style[key] = value
  }
}

function changeClick(flag) {
  const _delete = document.getElementById("delete")
  const _clear = document.getElementById("clearAll")
  const _check = document.getElementById("check")
  const _reset = document.getElementById("reset-button")
  if (flag) {
    _delete.onmousedown = () => deleteExpr();
    _clear.onmousedown = () => clearAll();
    _check.onmousedown = () => check();
    _reset.onmousedown = () => confirmReset();
    for (const [key, value] of Object.entries(ids)) {
      if (key === "smallGrid") {
        for (let _id of value) document.getElementById(_id).onmousedown = () => chooseNumber(_id);
      }
      if (key === "largeGridEnabled") {
        for (let _id of value) document.getElementById(_id).onmousedown = () => chooseElement(_id);
      }
      if (key === "operators") {
        for (let _id of value) document.getElementById(_id).onmousedown = () => chooseOperator(_id);
      }
    }
  } else {
    _delete.onmousedown = () => null
    _clear.onmousedown = () => null;
    _check.onmousedown = () => null;
    _reset.onmousedown = () => null;
    for (const [key, value] of Object.entries(ids)) {
      if (key === "smallGrid") {
        for (let _id of value) document.getElementById(_id).onmousedown = () => null;
      }
      if (key === "largeGridEnabled") {
        for (let _id of value) {
          let _button = document.getElementById(_id)
          _button.onmousedown = () => null;
        }
      }
      if (key === "operators") {
        for (let _id of value) { 
          console.log(value)
          document.getElementById(_id).onmousedown = () => null;}
      }
    }
  }
}

/*function changeClick(flag) {
  console.log(ids)

  const _delete = document.getElementById("delete")
  const _clear = document.getElementById("clearAll")
  const _check = document.getElementById("check")
  const _reset = document.getElementById("reset-button")

    _delete.onmousedown = flag ? () => deleteExpr() : () => null;
    _clear.onmousedown = flag ? () => clearAll() : () => null;
    _check.onmousedown = flag ? () => check() : () => null;
    _reset.onmousedown = flag ? () => confirmReset : () => null;
    for (const [key, value] of Object.entries(ids)) {
      if (key === "smallGrid") {
        for (let _id of value) document.getElementById(_id).onmousedown = flag ? () => chooseNumber(_id) : () => null;
      }
      if (key === "largeGridEnabled") {
        for (let _id of value) document.getElementById(_id).onmousedown = flag ? () => chooseElement(_id) : () => null;
      }
      if (key === "operators") {
        for (let _id of value) document.getElementById(_id).onmousedown = flag ? () => chooseOperator(_id) : () => null;
      }
    }
}
*/

function randomise() {
  let random = [];
  let count = 0;
  let y = 1;
  while (count < 15) {
    const x = Math.round(Math.random() * 99 + 1);
    if (stupidRandom01()) {
      y = 1;
    } else {
      y = -1;
    }
    random.push(x * y)
    count++;
  }
  let i = 0;
  for (const key of Object.keys(customNumbers)) {
    document.getElementById(key).value = random[i];
    customNumbers[key] = random[i];
    i++;
  }
  for (key of Object.keys(customOpps)) {
    if (customOpps[key]) onEnterOppsCustom(key);
  }
  let bools = []
  for (let n = 0; n < 4; n++) {
    bools.push(stupidRandom01())
  }
  console.log(bools)
  i = 0;
  for (key of Object.keys(customOpps)) {
    if (bools[i]) onEnterOppsCustom(key);
    i++;
  }

}

function unrandomise() {
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  for (key of Object.keys(customOpps)) {
    if (customOpps[key]) onEnterOppsCustom(key);
  }
  let i = 0;
  for (const key of Object.keys(customNumbers)) {
    document.getElementById(key).value = values[i];
    customNumbers[key] = values[i];
    i++;
  }
}

function onEnterNumbersCustom(id, value) {
  let _id = id;
  let _value = value;
  let _currentNumber = customNumbers[_id];
  let _check = _value.toString();
  if (!_check.includes("-")) {
    if (!_check.includes(".") && _check.length > 2) {
      document.getElementById(_id).value = _currentNumber;
      return 0;
    }
    if (_check.includes(".") && _check.length > 4) {
      document.getElementById(_id).value = _currentNumber;
      return 0;
    }
  } else {
    if (!_check.includes(".") && _check.length > 3) {
      document.getElementById(_id).value = _currentNumber;
      return 0;
    }
    if (_check.includes(".") && _check.length > 5) {
      document.getElementById(_id).value = _currentNumber;
      return 0;
    }
  }
  customNumbers[_id] = _value;
}

function onEnterOppsCustom(_id) {
  for (const [id, opp] of Object.entries(customOpps)) {
    if (id == _id && opp) {
      document.getElementById(_id).style.backgroundColor = "rgb(255, 255, 255)";
      document.getElementById("i" + _id).style.borderColor = "rgb(155, 155, 155) ";
      document.getElementById(_id).style.borderStyle = "inset";
      document.getElementById(_id).style.color = "rgb(0, 0, 0)";
      customOpps[_id] = !customOpps[_id]
      return 0;
    }
  }
  customOpps[_id] = !customOpps[_id]
  document.getElementById(_id).style.backgroundColor = "rgb(100, 100, 100) ";
  document.getElementById("i" + _id).style.borderColor = "rgb(80, 80, 80) ";
  document.getElementById(_id).style.borderStyle = "outset";
  document.getElementById(_id).style.color = "rgb(255, 255, 255)";
}

function negative(_id) {
  let id = "N" + _id;
  document.getElementById(old_id).style.backgroundColor = "rgb(255, 255, 255)";
  document.getElementById("i" + old_id).style.borderColor = "rgb(155, 155, 155) ";
  document.getElementById(old_id).style.borderStyle = "inset";
  document.getElementById(old_id).style.color = "rgb(0, 0, 0)";
  document.getElementById(id).style.backgroundColor = "rgb(100, 100, 100)";
  document.getElementById(id).style.borderStyle = "outset";
  document.getElementById("i" + id).style.borderColor = "rgb(80, 80, 80) ";
  document.getElementById(id).style.color = "rgb(255, 255, 255)";
  options = _id
  old_id = id
}

function chooseLevel(_id) {
  let id = "L" + _id;
  document.getElementById(old_level_id).style.backgroundColor = "rgb(255, 255, 255)";
  document.getElementById("i" + old_level_id).style.borderColor = "rgb(155, 155, 155) ";
  document.getElementById(old_level_id).style.borderStyle = "inset";
  document.getElementById(old_level_id).style.color = "rgb(0, 0, 0)";
  document.getElementById(id).style.backgroundColor = "rgb(100, 100, 100)";
  document.getElementById(id).style.borderStyle = "outset";
  document.getElementById("i" + id).style.borderColor = "rgb(80, 80, 80) ";
  document.getElementById(id).style.color = "rgb(255, 255, 255)";
  level = _id
  old_level_id = id
}


function start(flag) {
  playerNames[0] = document.getElementById("player-one").value;
  playerNames[1] = document.getElementById("player-two").value;
  if (playerNames[0] == "") playerNames[0] = "Player one"
  if (playerNames[1] == "") playerNames[1] = "Player two"
  document.getElementById("popup").style.visibility = "hidden";
  gameMode = flag
  if (flag === "multi") {
    operators = ["*", "/",]
    gameMode = "multi"
  }
  if (flag === "negative") {
    operators = ["+", "-"];
    gameMode = "negative"
  }
  if (flag === "custom") {
    gameMode = "custom"
    operators = []
    for (const [key, value] of Object.entries(customOpps)) {
      if (value) operators.push(key[1])
    }
  }
  reset(0);
}

function random_choice(_list, _number) {
  let list = []
  while (list.length < _number) {
    let x = Math.floor(Math.random() * _list.length)
    //FIX
    if (_list.length < 36) reset(0)
    if (_list[x]) {
      list.push(_list[x])
      _list.splice(x, 1, false)
    }
  }
  return list
}

function stupidRandom01() {
  let random = Math.floor(Math.random() * 1000)
  if (random > 500) {
    return true;
  } else {
    return false;
  }
}

function generateNumbers() {
  let _numbers = [];
  if (gameMode === "multi") {
    let x = 0;
    if (level === 1 || level === 2) {
      _numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      return _numbers;
    }
    if (level === 4) {
      _numbers = [0.1, 0.2, 0.3, 0.4, 0.5, 0.25, 0.75, 2, 3, 4, 5, 6, 7, 8, 10];
      return _numbers;
    }
    if (level === 3) {
      while (x < 8) {
        let i = Math.floor(Math.random() * 10 + 2);
        if (!_numbers.includes(i)) {
          _numbers.push(i);
          x++;
        }
      }
      while (x < 13) {
        let i = Math.floor(Math.random() * 9 + 11);
        if (!_numbers.includes(i)) {
          _numbers.push(i);
          x++;
        }
      }
      _numbers = [..._numbers, 10, 20];
      return _numbers;
    }
    if (level === 5) {
      let allNumbers = [];
      for (let x = 0.1; x < 10; x += 0.1) {
        x = Math.round(x * 10) / 10;
        allNumbers.push(x);
      }
      console.log(allNumbers);
      while (_numbers.length < 8) {
        let index = Math.floor(Math.random() * allNumbers.length);
        if (!_numbers.includes(allNumbers[index])) {
          _numbers.push(allNumbers[index]);
        }
      }
      let x = _numbers.length;
      while (x < 15) {
        let i = Math.floor(Math.random() * 8 + 2);
        if (!_numbers.includes(i)) {
          _numbers.push(i);
          x++;
        }
      }
    }

  } else if (gameMode === "negative") {
    if (options === 1) {
      _numbers = [-2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15, -16];
      return _numbers;
    } else if (options === 3) {
      _numbers = [-2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, 3, 4, 7, 8];
      return _numbers;
    } else {
      while (_numbers.length < 8) {
        let positive = stupidRandom01()
        if (positive) {
          let i = Math.floor(Math.random() * + 10 + 2);
          if (!_numbers.includes(i)) {
            _numbers.push(i);

          }
        } else {
          let i = Math.floor(Math.random() * - 10 - 2);
          if (!_numbers.includes(i)) {
            _numbers.push(i);

          }
        }
      }
      while (_numbers.length < 16) {
        let positive = stupidRandom01()
        if (positive) {
          let i = Math.floor(Math.random() * 9 + 11);
          if (!_numbers.includes(i)) {
            _numbers.push(i);

          }
        } else {
          let i = Math.floor(Math.random() * -9 - 11);
          if (!_numbers.includes(i)) {
            _numbers.push(i);
          }
        }
      }
      return _numbers;
    }
  } else {
    for (const _num of Object.values(customNumbers)) _numbers.push(_num)
  }
  return _numbers;
}

function createSmallGrid(numbers) {
  const smallGridIds = {
    SA: 1,
    SB: 2,
    SC: 3,
  };
  let pointer = 0;
  let target = document.getElementById("numbers");
  for (const [key, value] of Object.entries(smallGridIds)) {
    let row = value;
    for (let x = 1; x < 6; x++) {
      let _id = key + x;
      ids.smallGrid.push(_id)
      let _button = document.createElement("div");
      let _svg = createSVGElement("svg")
      let _base = createSVGElement("rect")
      let _text = createSVGElement("text")
      _text.innerHTML = numbers[pointer];
      _button.onmousedown = () => chooseNumber(_id);
      setAttributes(_button, {
        style: `grid-row-start: ${row};
                  grid-row-end: ${row + 1};
                  grid-column-start: ${x};
                  grid-column-end: ${x + 1};
                  width: 9vh;
                  height:9vh;
                  `,
        "class-name": "grid-button",
        id: _id,
      });
      setAttributes(_svg, {
        height: "100%",
        width: "100%",
      });
      setAttributes(_base, {
        id: "bs" + _id,
        x: "5%",
        y: "0",
        height: "95%",
        width: "95%",
        fill: "transparent",
        stroke: "black",
        "stroke-dasharray": "10",
        "stroke-width": "2",
      });
      setAttributes(_text, {
        id: "t" + _id,
        x: "50%",
        y: "65%",
        fill: "black",
        stroke: "black",
        "text-anchor": "middle",
        "font-size": "2em"
      });
      _svg.appendChild(_base);
      _svg.appendChild(_text);
      _button.appendChild(_svg);
      target.appendChild(_button);
      pointer++;
    }
  }
}

function _generateAllGridNumbers(_numbers, digits, operators, custom) {
  let _allGridNumbers = [];
  let savedNumbers = [];
  let extras = []
  for (let numOne of _numbers) {
    for (let numTwo of _numbers) {
      if (numOne !== numTwo) {
        for (let opp of operators) {
          switch (opp) {
            case "+":
              savedNumbers.push((parseFloat(numOne) + parseFloat(numTwo)).toString());
              break;
            case "-":
              savedNumbers.push((parseFloat(numOne) - parseFloat(numTwo)).toString());
              break;
            case "*":
              savedNumbers.push((parseFloat(numOne) * parseFloat(numTwo)).toString());
              break;
            case "/":
              savedNumbers.push((parseFloat(numOne) / parseFloat(numTwo)).toString());
              break;
          }
        }
      }
    }
  }
  for (let x = 0; x < savedNumbers.length; x++) {
    if (
      savedNumbers[x].includes(".") &&
      !_allGridNumbers.includes(savedNumbers[x]) &&
      savedNumbers[x].length < digits + 1
    ) {
      _allGridNumbers.push(savedNumbers[x]);
    } else if (
      !savedNumbers[x].includes(".") &&
      !_allGridNumbers.includes(savedNumbers[x]) &&
      savedNumbers[x].length < digits
    ) {
      _allGridNumbers.push(savedNumbers[x]);
    } else if (_allGridNumbers.includes(savedNumbers[x])) {
      extras.push(savedNumbers[x])
    }
  }
  if (_allGridNumbers.length < 36) {
    let dif = 36 - _allGridNumbers.length
    let extraList = random_choice(extras, dif)
    _allGridNumbers = [..._allGridNumbers, ...extraList]
    return _allGridNumbers;
  } else {
    _allGridNumbers = random_choice(_allGridNumbers, 36)
    return _allGridNumbers;
  }
}

function generateAllGridNumbers(_numbers) {
  let x = 0;
  let digits;
  let allGridNumbers = [];
  if (gameMode === "custom") {
    allGridNumbers = _generateAllGridNumbers(_numbers, 3, operators, true)
  }
  if (gameMode === "multi") {
    if (level === 1) {
      console.log("multi L1")
      operators = ["*"]
      digits = 3;
    } else if (level === 2) {
      console.log("multi L2")
      operators = ["*", "/"]
      digits = 3;
    } else if (level === 3) {
      operators = ["*", "/"]
      digits = 3;
    } else if (level === 4) {
      operators = ["*", "/"]
      digits = 5;
    } else {
      operators = ["*", "/"]
      digits = 5;
    }
    allGridNumbers = _generateAllGridNumbers(_numbers, digits, operators, false)
  }

  if (gameMode === "negative") {
    if (options === 1) {
      operators = ["+", "-"]
      digits = 3;
    } else if (options === 2) {
      operators = ["+", "-"]
      digits = 5;
    } else if (options === 3) {
      operators = ["*", "/"]
      digits = 3;
    } else if (options === 4) {
      operators = ["*", "/"]
      digits = 5;
    } else if (options === 4) {
      operators = ["+", "-", "*", "/"]
      digits = 5;
    } else {
      operators = ["+", "-", "*", "/"]
      digits = 5;
    }
    allGridNumbers = _generateAllGridNumbers(_numbers, digits, operators, false)
  }
  return allGridNumbers;
}

function generateGridNumbers(_numbers) {
  let allNumbers = generateAllGridNumbers(_numbers);
  let gridNumbers = [];
  let randomIndices = [];
  while (randomIndices.length < 36) {
    let x = Math.floor(Math.random() * allNumbers.length);
    if (!randomIndices.includes(x)) {
      randomIndices.push(x);
    }
  }
  for (let index of randomIndices) {
    gridNumbers.push(allNumbers[index]);
  }
  return gridNumbers;
}

function createSVGElement(tag) {
  return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

function setAttributes(element, attributes) {
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
}

function createGrid(_numbers) {
  const rowsDict = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
  };
  let target = document.getElementById("board");
  for (const [key, value] of Object.entries(_numbers)) {
    let row = rowsDict[key.charAt(0)];
    let column = key.charAt(1);
    let _button = document.createElement("div");
    let _svg = createSVGElement("svg")
    let _text = createSVGElement("text")
    let _playerOne = createSVGElement("text")
    let _playerTwo = createSVGElement("text")
    _button.id = key;
    ids.largeGridEnabled.push(_button.id)
    _button.className = "grid-button";
    _button.onmousedown = () => chooseElement(key);
    _text.innerHTML = value
    _playerTwo.innerHTML = "O"
    _playerOne.innerHTML = "X"
    setAttributes(_button, {
      style: `
              grid-row-start: ${row};
              grid-row-end: ${parseInt(row) + 1}; 
              grid-column-start: ${column};
              grid-column-end: ${parseInt(column) + 1};
              height: 10vh;
              width: 10vh;
              margin: 2vh 0 0 1vh;
              `
    })
    setAttributes(_svg, {
      height: "100%",
      width: "100%",
    })
    setAttributes(_text, {
      id: "t" + key,
      stroke: "white",
      fill: "white",
      x: "52%",
      y: "65%",
      "font-size": "1.7em",
      "text-anchor": "middle",
    })
    setAttributes(_playerOne, {
      id: "p1" + key,
      stroke: "transparent",
      fill: "transparent",
      x: "52%",
      y: "90%",
      "font-size": "5em",
      "text-anchor": "middle",
    })
    setAttributes(_playerTwo, {
      id: "p2" + key,
      stroke: "transparent",
      fill: "transparent",
      x: "52%",
      y: "90%",
      "font-size": "5em",
      "text-anchor": "middle",
    })
    _svg.appendChild(_text)
    _svg.appendChild(_playerOne)
    _svg.appendChild(_playerTwo)
    _button.appendChild(_svg)
    target.appendChild(_button);
  }
}

function createGridDict(_numbers) {
  const rows = ["A", "B", "C", "D", "E", "F"];
  let gridDict = {};
  let pointer = 0;
  rows.map((row, i) => {
    let r = rows.indexOf(row);
    for (let x = 1; x < 7; x++) {
      let _id = row + x;
      gridDict[_id] = _numbers[pointer];
      pointer++;
    }
  });
  return gridDict;
}

function createOperators(_operators) {
  console.log(_operators, level, options)
  let buttons = [];
  let target = document.getElementById("block-operators");
  let row;
  let column;
  let margin;
  _operators.map((operator, i) => {
    if (i <= 1) {
      column = i + 1;
      row = 1;
      margin = 0;
    } else {
      column = i - 1;
      row = 2;
      margin = "-10%"
    }
    let _id = "O" + operator;
    ids.operators.push(_id);
    let _button = document.createElement("div");
    let _svg = createSVGElement("svg");
    let _shadow = createSVGElement("rect");
    let _base = createSVGElement("rect");
    let _shading = createSVGElement("rect");
    let _text = createSVGElement("text");
    setAttributes(_button, {
      style: `
              width: 10vh;
              height: 10vh;
              grid-column-start: ${column};
              grid-row-start: ${row};
              grid-column-end: ${column + 1};
              grid-row-end: ${row + 1};
              margin-top: ${margin};
                `,
      "class-name": "operator-button",
      id: _id,
    });
    setAttributes(_svg, {
      height: "100%",
      width: "100%",
    });
    setAttributes(_shadow, {
      id: "sh" + _id,
      x: "0%",
      y: "5%",
      height: "95%",
      width: "95%",
      fill: "#00000034",
      stroke: "transparent",
    });
    setAttributes(_base, {
      id: "bs" + _id,
      x: "5%",
      y: "0",
      height: "95%",
      width: "95%",
      fill: "black",
      stroke: "black",
    });
    setAttributes(_shading, {
      id: "sd" + _id,
      x: "7%",
      y: "0",
      height: "94%",
      width: "93%",
      fill: "url(#Bob)",
    });
    setAttributes(_text, {
      id: "t" + _id,
      x: "50%",
      y: "65%",
      fill: "white",
      stroke: "white",
      "text-anchor": "middle",
      "font-size": "2.5em"
    });
    _text.innerHTML = operator;
    _svg.appendChild(_shadow);
    _svg.appendChild(_base);
    _svg.appendChild(_shading);
    _svg.appendChild(_text);
    _button.appendChild(_svg);
    _button.onmousedown = () => chooseOperator(_id);
    buttons.push(_button);
  });
  if (level === "1") {
    target.appendChild(buttons[0]);
    return 0;
  } else {
    for (let button of buttons) {
      target.appendChild(button);
    }
  }
}

function chooseElement(_id) {
  let target = document.getElementById("t" + _id);
  document.getElementById("chosenNumber").innerHTML = target.innerHTML;
  chosenNumber[0] = _id;
  chosenNumber[1] = parseFloat(target.innerHTML);
}

// Function to handle the button press when it's pressed down
function buttonDown(_id) {
  let _shadow = document.getElementById("sh" + _id)
  let _base = document.getElementById("bs" + _id)
  let _shading = document.getElementById("sd" + _id);
  let text = document.getElementById("t" + _id);
  setAttributes(_shadow, {
    fill: "transparent",
  });
  setAttributes(_base, {
    x: "3%",
    y: "5%",
    width: "95%",
    height: "95%",
  });
  setAttributes(_shading, {
    x: "3%",
    y: "5%",
    width: "95%",
    height: "95%",
  });
  setAttributes(text, {
    x: "48%",
    y: "70%",
  });
}

// Function to handle the button when it's released
function buttonUp(id) {
  let svg = document.getElementById(id).children[0];
  let shadow = svg.children[0];
  let base = svg.children[1];
  let front = svg.children[2];
  let text = svg.children[3];
  setAttributes(shadow, {
    fill: "#00000037",
  });
  setAttributes(base, {
    x: "5%",
    y: "0",
    width: "95%",
    height: "95%",
  });
  setAttributes(front, {
    x: "7%",
    y: "0",
    width: "93%",
    height: "94%",
  });
  setAttributes(text, {
    x: "50%",
    y: "65%",
  });
}

function chooseNumber(_id) {
  let target = document.getElementById("exprText");
  let choice = document.getElementById("t" + _id).innerHTML;
  let expr = target.innerHTML;
  let x = expr.slice(-1);
  if (lastEntered.length < 3) {
    if (x === "" || operators.includes(x)) {
      expr += choice;
      lastEntered.push(choice.length);
      enteredNumbers.push(choice);
      target.innerHTML = expr;
    }
  }
}

function chooseOperator(_id) {
  buttonDown(_id)
  setTimeout(() => {
    buttonUp(_id);
  }, 150)
  let target = document.getElementById("exprText");
  let expr = target.innerHTML;
  let choice = document.getElementById(_id).id[1];
  console.log(choice)
  let x = expr.slice(-1);
  if (lastEntered.length < 3) {
    if (x !== "" && !operators.includes(x)) {
      expr += choice;
      target.innerHTML = expr;
      lastEntered.push(choice.length);
      enteredNumbers.push(choice);
    }
  }
}

function deleteExpr() {
  buttonDown("delete")
  setTimeout(() => {
    buttonUp("delete");
  }, 150)
  let end = lastEntered.pop() * -1;
  let target = document.getElementById("exprText");
  let expr = target.innerHTML;
  let x = expr.slice(-1);
  if (x) {
    target.innerHTML = expr.slice(0, end);
    enteredNumbers.pop();
  }
}

function clearAll(flag) {
  buttonDown("clearAll")
  setTimeout(() => {
    buttonUp("clearAll");
  }, 150)
  document.getElementById("exprText").innerHTML = "";
  lastEntered = [];
  enteredNumbers = [];
  if (flag) {
    chosenNumber = ["", 0];
    document.getElementById("chosenNumber").innerHTML = "";
  }
}

function check() {
  buttonDown("check")
  setTimeout(() => {
    buttonUp("check");
  }, 150)
  const rows = ["A", "B", "C", "D", "E", "F"];
  if (lastEntered.length === 3) {
    console.log("checking, entered numbers: ", enteredNumbers)
    clearInterval(newTimer);
    let playerTextID = player ? "p1" : "p2";
    let fill = player ? "#2053c2cf" : "#de423fcf";
    let answer;
    switch (enteredNumbers[1]) {
      case "+":
        answer = Math.round((parseFloat(enteredNumbers[0]) + parseFloat(enteredNumbers[2]))*10000)/10000;
        break;
      case "-":
        answer = Math.round((parseFloat(enteredNumbers[0]) - parseFloat(enteredNumbers[2]))*10000)/10000;
        break;
      case "/":
        answer = Math.round((parseFloat(enteredNumbers[0]) / parseFloat(enteredNumbers[2]))*10000)/10000;
        break;
      case "*":
        answer = Math.round((parseFloat(enteredNumbers[0]) * parseFloat(enteredNumbers[2]))*10000)/10000;
        break;
    }
    console.log("Answer:", answer)
    let toCheckId = chosenNumber[0];
    playerTextID += toCheckId
    let textID = "t" + toCheckId
    if (answer === chosenNumber[1]) {
      disabledNumbers.push(toCheckId);
      let _div = document.getElementById(toCheckId)
      let _text = document.getElementById(textID)
      let _playerText = document.getElementById(playerTextID)
      ids.largeGridDisabled.push(toCheckId)
      ids.largeGridEnabled = removeByValue(ids.largeGridEnabled, toCheckId)
      _div.onmousedown = () => null;
      setAttributes(_text, {
        "fill": "#FFFFFF45",
        "stroke": "#FFFFFF45",
      });
      setAttributes(_playerText, {
        "fill": fill,
        "stroke": fill,
      });
      let saveScore = player ? scoreCount.playerOne : scoreCount.playerTwo;
      saveScore.allCorrect.push(toCheckId);
      saveScore.vertical[toCheckId.charAt(1)].push(
        rows.indexOf(toCheckId.charAt(0)) + 1
      );
      saveScore.horizontal[toCheckId.charAt(0)].push(
        parseInt(toCheckId.charAt(1))
      );
      let hasWon = checkWinner();
      if (hasWon) {
        player ? (scores.playerOne += 1) : (scores.playerTwo += 1);
        let score = player ? scores.playerOne : scores.playerTwo;
        let color = player ? "#2053c275" : "#de423f75";
        if (score < 6) {
          let _id = player ? "p1" + score : "p2" + score;
          document.getElementById(_id).style.backgroundColor = color;
        } else {
          confirmWonGame(player)
        }
        confirmWin(player)
      }
    }
    getReady();
  }
}

function checkWinner() {
  let flag = [];
  let target = player ? scoreCount.playerOne : scoreCount.playerTwo;
  if (target.allCorrect.length > 3) {
    flag.push(checkFIR(target.vertical));
    flag.push(checkFIR(target.horizontal));
    flag.push(checkDiag(target.allCorrect));
  }
  for (item of flag) {
    if (item) {
      return true;
    }
  }
  return false;
}

function checkFIR(test) {
  for (key in test) {
    let counter = 0;
    let sortedTest = test[key].sort();
    for (let x = 0; x < sortedTest.length - 1; x++) {
      if (sortedTest[x + 1] - sortedTest[x] === 1) {
        counter += 1;
      } else {
        counter = 0;
      }
    }
    if (counter >= 3) {
      return true;
    }
  }
  return false;
}

function checkDiag(test) {
  for (group of diagonals) {
    let counter = 0;
    for (let e1 of group) {
      for (let e2 of test) {
        if (e1 == e2) {
          counter++;
        }
      }
    }
    if (counter == 4) return true;
  }
  return false;
}

function timerUp() {
  let color = player ? "#2053c275" : "#de423f75";
  document.getElementById("timer-fill").setAttribute("fill", color)
  timerDirectionUp = true;
  if (!timerPaused) {
    timerHeight = 0;
  } else {
    timerPaused = false;
  }
  newTimer = setInterval(() => {
    let _height = (100 - timerHeight).toString() + "%"
    document.getElementById("timer-bar").setAttribute("height", _height)
    timerHeight += 1;
    if (timerHeight > 100) newPlayer();
  }, 50);
}

function timerDown() {
  let color = player ? "rgb(32,83,194)" : "rgb(222,66,63)";
  document.getElementById("timer-fill").setAttribute("fill", color);
  timerDirectionUp = false;
  if (!timerPaused) {
    timerHeight = 100;
  } else {
    timerPaused = false;
  }
  newTimer = setInterval(() => {
    let _height = (100 - timerHeight).toString() + "%";
    document.getElementById("timer-bar").setAttribute("height", _height);
    timerHeight -= 0.5;
    if (timerHeight < 0) getReady();
  }, 150);
}

function pauseTimer(flag) {
  if (flag) {
    clearInterval(newTimer);
  } else {
    timerPaused = true;
    if (timerDirectionUp) {
      timerUp()
    } else {
      timerDown()
    }
  }
}

function getReady() {
  try {
    clearInterval(newTimer);
  } catch (e) { }
  clearAll(true);
  player = player ? false : true;
  playerName = player ? playerNames[0] : playerNames[1];
  let sbcolor = player ? "#2053c275" : "#de423f75";
  let sycolor = player ? "blue" : "red";
  let symbol = player ? "X" : "O";
  let stcolor = player ? "white" : "black";
  let playerNameTimer = document.getElementById("player-name");
  let playerSymbol = document.getElementById("player-symbol");
  let getReady = document.getElementById("get-ready");
  changeClick(false)
  playerNameTimer.innerHTML = playerName;
  playerSymbol.innerHTML = symbol;
  getReady.innerHTML = "GET READY!";
  setAttributes(playerNameTimer, {
    "fill": stcolor,
    "stroke": stcolor,
  });
  setAttributes(getReady, {
    "fill": stcolor,
    "stroke": stcolor,
  });
  document.getElementById("timer-text-box").setAttribute("fill", sbcolor);
  playerSymbol.setAttribute("fill", sycolor);
  timerUp();
}

function newPlayer() {
  clearInterval(newTimer);
  document.getElementById("get-ready").innerHTML = "GO!";
  changeClick(true)
  timerDown();
}

function reset(flag) {
  clearAll(true);
  timerPaused = false;
  if (flag === 1 || flag === 2) {
    clearInterval(newTimer);
    document.getElementById("board").innerHTML = "";
    document.getElementById("numbers").innerHTML = "";
    for (opp of operators) {
      let _id = "O" + opp;
      document.getElementById(_id).remove();
    }
  }
  scoreCount = {
    playerOne: {
      allCorrect: [],
      vertical: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
      },
      horizontal: {
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        F: []
      }
    },
    playerTwo: {
      allCorrect: [],
      vertical: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
      },
      horizontal: {
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        F: []
      }
    }
  };
  if (flag === 1) {
    document.getElementById("popup").style.visibility = "visible";
    return 0;
  }
  if (flag === 0) {
    scores = {
      playerOne: 0,
      playerTwo: 0
    };
    document.getElementById("player-name").innerHTML = playerNames[0];
    document.getElementById("player-one-label").innerHTML = playerNames[0];
    document.getElementById("player-two-label").innerHTML = playerNames[1];
  }
  disabledNumbers = [];
  numbers = generateNumbers();
  gridNumbers = generateGridNumbers(numbers);
  createSmallGrid(numbers);
  gridNumbersDict = createGridDict(gridNumbers);
  createGrid(gridNumbersDict);
  createOperators(operators);
  getReady();
}

// Global variables
let newTimer = null;
let tries = 0;
let timerHeight = 0;
let timerDirectionUp = true;
let timerPaused = false;
let old_id = "N1";
let old_level_id = "L3";
let gameMode = "multi";
let ids = {
  "largeGridEnabled": [],
  "largeGridDisabled": [],
  "smallGrid": [],
  "operators": [],
}
let customNumbers = {
  "CN1": 1,
  "CN2": 2,
  "CN3": 3,
  "CN4": 4,
  "CN5": 5,
  "CN6": 6,
  "CN7": 7,
  "CN8": 8,
  "CN9": 9,
  "CN10": 10,
  "CN11": 11,
  "CN12": 12,
  "CN13": 13,
  "CN14": 14,
  "CN15": 15,
}
let customOpps = {
  "C+": false,
  "C-": false,
  "C*": false,
  "C/": false,
}
let operators = [];
let numbers = [];
let gridNumbersDict = {};
let gridNumbers = [];
let scores = {
  playerOne: 0,
  playerTwo: 0
};
let level = 3;
let options = 2;
let lastEntered = [];
let disabledNumbers = [];
let chosenNumber = ["", 0];
let player = false;
let playerNames = ["Player One", "Player Two"];
let scoreCount = {};
const diagonals = [
  ["A1", "B2", "C3", "D4"],
  ["A2", "B3", "C4", "D5"],
  ["A3", "B4", "C5", "D6"],
  ["A4", "B3", "C2", "D1"],
  ["A5", "B4", "C3", "D2"],
  ["A6", "B5", "C4", "D3"],
  ["B1", "C2", "D3", "E4"],
  ["B2", "C3", "D4", "E5"],
  ["B3", "C4", "D5", "E6"],
  ["B4", "C3", "D2", "E1"],
  ["B5", "C4", "D3", "E2"],
  ["B6", "C5", "D4", "E3"],
  ["C1", "D2", "E3", "F4"],
  ["C2", "D3", "E4", "F5"],
  ["C3", "D4", "E5", "F6"],
  ["C4", "D3", "E2", "F1"],
  ["C5", "D4", "E3", "F2"],
  ["C6", "D5", "E4", "F3"]
];
const warningSign = `
  <g>
    <path d="M85.57,446.25H426.43a32,32,0,0,0,28.17-47.17L284.18,82.58c-12.09-22.44-44.27-22.44-56.36,0L57.4,399.08A32,32,0,0,0,85.57,446.25Z"
      style="fill:none;stroke:#de7737;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/>
    <path d="M250.26,195.39l5.74,122,5.73-121.95a5.74,5.74,0,0,0-5.79-6h0A5.74,5.74,0,0,0,250.26,195.39Z" 
      style="fill:none;stroke:#de7737;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/>
    <path d="M256,397.25a20,20,0,1,1,20-20A20,20,0,0,1,256,397.25Z" stroke="#de7737" fill="#de7737"/>
  </g>
  `
const winSign = `
  <circle
    style="stroke-width:0.25913602"
    r="12.586607"
    cy="75.127968"
    cx="43.089287"
    id="path3715" />
  <path
    id="path3717"
    d="m 32.902922,87.288065 c 8.647597,7.319114 18.501838,1.825029 18.501838,1.825029 0,0 9.685121,-7.468759 16.646688,-11.595428 6.961567,-4.12667 25.308669,-12.595047 25.308669,-12.595047 0,0 -25.756103,21.220391 -31.093626,28.89062 -5.221814,7.503951 -11.260649,21.597681 -11.62555,34.128561 -0.364901,12.53088 -0.352544,27.16427 2.783402,41.72608 3.585361,16.64867 13.888525,52.27142 14.01198,52.27142 0,0 -14.117267,-30.23273 -17.543466,-40.18405 -3.426199,-9.95133 -9.735668,-26.80945 -9.735668,-26.80945 0,0 -5.180904,13.59759 -8.628602,24.7394 -3.447698,11.14181 -12.267536,41.86826 -12.267536,41.86826 0,0 5.800917,-29.84822 6.559903,-45.15473 0.758987,-15.30651 4.81709,-32.85212 5.005404,-44.74988 0.188313,-11.89776 -2.100168,-26.28278 -2.100168,-26.28278 0,0 -4.849428,8.75114 -9.242011,23.77839 -4.392582,15.02725 -6.422702,34.72407 -6.422702,34.72407 0,0 0.408171,-30.97555 2.233127,-42.52327 1.824957,-11.54772 4.32339,-20.54497 7.292255,-24.794476 3.394188,-4.858292 10.316063,-9.262719 10.316063,-9.262719 z"
    style="fill:#000000;stroke:#000000;stroke-width:0.26458332px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
  <path
    id="path3719"
    d="m 93.360117,64.922619 c 0,0 15.944053,10.858053 22.367593,13.985447 6.42354,3.127393 13.89801,5.07812 13.89801,5.07812 0,0 4.0295,2.959613 6.94624,4.121162 2.91674,1.161549 8.44064,1.005317 10.6582,-0.06632 2.21755,-1.07164 5.64801,-2.985762 5.64801,-2.985762 0,0 10.5025,-4.531426 18.17432,-9.087165 7.67183,-4.555739 27.2615,-18.976135 27.2615,-18.976135 0,0 -15.37504,14.638108 -22.18337,21.916101 -6.80833,7.277993 -14.68128,13.174656 -18.70887,21.648825 -4.02759,8.47417 -4.50141,18.39796 -4.81085,27.2615 -0.30944,8.86354 0.13609,9.92996 2.67269,25.3906 2.5366,15.46064 14.9671,66.81738 14.9671,66.81738 l -28.0633,-64.94649 -24.5888,65.48103 c 0,0 9.06237,-55.7017 11.22532,-71.36096 2.16295,-15.65926 3.13401,-13.94051 2.6727,-22.45064 -0.46131,-8.51013 -0.54378,-16.75109 -6.41447,-27.796031 -5.87069,-11.044945 -31.722023,-34.03066 -31.722023,-34.03066 z"
    style="fill:#000000;stroke:#000000;stroke-width:0.26458332px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
  <circle
    style="stroke-width:0.25913602"
    r="12.586608"
    cy="73.028137"
    cx="141.65285"
    id="path3715-7" />
    `

const playerOneWin = `
  <text
    transform="matrix(0.93250628,0.24835641,-0.21775761,1.014383,0,0)"
    id="text3738"
    y="97.603447"
    x="60.391994"
    style="font-style:normal;font-weight:normal;font-size:21.4730835px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:0.53682709"
    xml:space="preserve"><tspan
    style="fill:#de423f75;stroke-width:0.53682709"
    y="97.603447"
    x="60.391994"
    id="tspan3736">O</tspan></text>
  <text
    transform="matrix(0.94239531,0.07132527,-0.0287215,1.058952,0,0)"
    id="text3742"
    y="98.435966"
    x="143.74713"
    style="font-style:normal;font-weight:normal;font-size:24.73922539px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:0.61848068"
    xml:space="preserve"><tspan
    style="fill:#2053c275;stroke-width:0.61848068"
    y="98.435966"
    x="143.74713"
    id="tspan3740">X</tspan></text>
    `

const playerTwoWin = `
  <text
    transform="matrix(0.93250628,0.24835641,-0.21775761,1.014383,0,0)"
    id="text3738"
    y="97.603447"
    x="60.391994"
    style="font-style:normal;font-weight:normal;font-size:21.4730835px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:0.53682709"
    xml:space="preserve"><tspan
    style="fill:#2053c275;stroke-width:0.53682709"
    y="97.603447"
    x="60.391994"
    id="tspan3736">X</tspan></text>
  <text
    transform="matrix(0.94239531,0.07132527,-0.0287215,1.058952,0,0)"
    id="text3742"
    y="98.435966"
    x="143.74713"
    style="font-style:normal;font-weight:normal;font-size:24.73922539px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:0.61848068"
    xml:space="preserve"><tspan
    style="fill:#de423f75;stroke-width:0.61848068"
    y="98.435966"
    x="143.74713"
    id="tspan3740">O</tspan></text>
    `
const gameWonSign = `
  <path d="M190.878,111.272c31.017-11.186,53.254-40.907,53.254-75.733l-0.19-8.509h-48.955V5H64.222v22.03H15.266l-0.19,8.509
	  c0,34.825,22.237,64.546,53.254,75.733c7.306,18.421,22.798,31.822,41.878,37.728v20c-0.859,15.668-14.112,29-30,29v18h-16v35H195
	  v-35h-16v-18c-15.888,0-29.141-13.332-30-29v-20C168.08,143.094,183.572,129.692,190.878,111.272z M195,44h30.563
	  c-0.06,0.427-0.103,1.017-0.171,1.441c-3.02,18.856-14.543,34.681-30.406,44.007C195.026,88.509,195,44,195,44z M33.816,45.441
	  c-0.068-0.424-0.111-1.014-0.171-1.441h30.563c0,0-0.026,44.509,0.013,45.448C48.359,80.122,36.837,64.297,33.816,45.441z
	  M129.604,86.777l-20.255,13.52l6.599-23.442L96.831,61.77l24.334-0.967l8.44-22.844l8.44,22.844l24.334,0.967L143.26,76.856
	  l6.599,23.442L129.604,86.777z"/>
    
    `
const gameWonSignX = `<path
d="m 157.73698,61.742239 c 15.45308,-5.64853 26.53185,-20.656573 26.53185,-38.242458 l -0.0947,-4.296741 H 159.78414 V 8.0786773 H 94.6353 V 19.20304 H 70.24478 l -0.0947,4.296741 c 0,17.58538 11.07876,32.593423 26.53184,38.242458 3.63995,9.301947 11.35826,16.068973 20.86417,19.051292 v 10.099285 c -0.42797,7.91178 -7.03078,14.643964 -14.94639,14.643964 v 9.08936 h -7.97141 v 17.67375 h 65.16229 v -17.67375 h -7.97141 v -9.08936 c -7.91561,0 -14.51843,-6.732184 -14.94639,-14.643964 V 80.793531 c 9.5059,-2.982319 17.22422,-9.74985 20.86416,-19.051292 z m 2.05364,-33.969956 h 15.22689 c -0.0299,0.21562 -0.0513,0.513549 -0.0852,0.727654 -1.50461,9.521606 -7.24552,17.512665 -15.14867,22.221962 0.0199,-0.474161 0.007,-22.949616 0.007,-22.949616 z m -80.30399,0.727654 c -0.0339,-0.214105 -0.0553,-0.512034 -0.0852,-0.727654 h 15.22689 c 0,0 -0.013,22.475455 0.006,22.949616 C 86.73214,46.012602 80.99173,38.021543 79.48663,28.499937 Z"
id="path1"
style="stroke-width:0.501577" />
<text
xml:space="preserve"
style="font-style:normal;font-weight:normal;font-size:65.1062px;line-height:1.25;font-family:sans-serif;fill:#130ece;fill-opacity:1;stroke:none;stroke-width:1.62766"
x="93.529381"
y="65.359543"
id="text1"
transform="scale(1.0980905,0.91067174)"><tspan
  id="tspan1"
  x="93.529381"
  y="65.359543"
  style="stroke-width:1.62766">X</tspan></text>`

const gameWonSignO = `<path
d="m 157.73698,61.742239 c 15.45308,-5.64853 26.53185,-20.656573 26.53185,-38.242458 l -0.0947,-4.296741 H 159.78414 V 8.0786773 H 94.6353 V 19.20304 H 70.24478 l -0.0947,4.296741 c 0,17.58538 11.07876,32.593423 26.53184,38.242458 3.63995,9.301947 11.35826,16.068973 20.86417,19.051292 v 10.099285 c -0.42797,7.91178 -7.03078,14.643964 -14.94639,14.643964 v 9.08936 h -7.97141 v 17.67375 h 65.16229 v -17.67375 h -7.97141 v -9.08936 c -7.91561,0 -14.51843,-6.732184 -14.94639,-14.643964 V 80.793531 c 9.5059,-2.982319 17.22422,-9.74985 20.86416,-19.051292 z m 2.05364,-33.969956 h 15.22689 c -0.0299,0.21562 -0.0513,0.513549 -0.0852,0.727654 -1.50461,9.521606 -7.24552,17.512665 -15.14867,22.221962 0.0199,-0.474161 0.007,-22.949616 0.007,-22.949616 z m -80.30399,0.727654 c -0.0339,-0.214105 -0.0553,-0.512034 -0.0852,-0.727654 h 15.22689 c 0,0 -0.013,22.475455 0.006,22.949616 C 86.73214,46.012602 80.99173,38.021543 79.48663,28.499937 Z"
id="path1"
style="stroke-width:0.501577" />
<text
xml:space="preserve"
style="font-style:normal;font-weight:normal;font-size:69.481px;line-height:1.25;font-family:sans-serif;fill:#e01509;fill-opacity:1;stroke:none;stroke-width:1.73703"
x="101.41006"
y="67.451561"
id="text1"
transform="scale(0.9878688,1.0122802)"><tspan
  id="tspan1"
  x="101.41006"
  y="67.451561"
  style="fill:#e01509;fill-opacity:1;stroke-width:1.73703">O</tspan></text>`
