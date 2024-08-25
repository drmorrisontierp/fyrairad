function onEnterNumbersCustom(id, value) {
  console.log("fired oECN")
  let _id = id;
  let _value = value;
  let _currentNumber = customNumbers[_id];
  let _check = _value.toString();
  console.log(_id, _value, _currentNumber)
  if (!_check.includes("-")) {
  if (!_check.includes(".") && _check.length > 2) {
    document.getElementById(_id).value = _currentNumber;
    return 0;
  }
  if (_check.includes(".") && _check.length > 4) {
    console.log("check")
    document.getElementById(_id).value = _currentNumber;
    return 0;
    
  }} else {
  if (!_check.includes(".") && _check.length > 3) {
    document.getElementById(_id).value = _currentNumber;
    return 0;
  }
  if (_check.includes(".") && _check.length > 5) {
    console.log("check")
    document.getElementById(_id).value = _currentNumber;
    return 0;}}
  customNumbers[_id] = _value;
}


function start() {
  playerNames[0] = document.getElementById("player-one").value;
  playerNames[1] = document.getElementById("player-two").value;
  if (playerNames[0] == "") playerNames[0] = "Player one"
  if (playerNames[1] == "") playerNames[1] = "Player two"
  document.getElementById("popup").style.zIndex = -1;
  level = document.getElementById("level").value;
  reset(0);
}

function generateNumbers() {
  let _numbers = [];
  let x = 0;
  if (level === "1" || level === "2") {
    _numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 20];
    return _numbers;
  }
  if (level === "4") {
    _numbers = ["0.1", "0.2", "0.3", "0.4", "0.5", "0.25","0.75", "2", "3", "4", "5", "10"];
    return _numbers;
  }
  if (level === "3") {
    while (x < 6) {
      let i = Math.floor(Math.random() * 10 + 2);
      if (!_numbers.includes(i)) {
        _numbers.push(i);
        x++;
      }
    }
    while (x < 10) {
      let i = Math.floor(Math.random() * 9 + 11);
      if (!_numbers.includes(i)) {
        _numbers.push(i);
        x++;
      }
    }
    _numbers = [..._numbers, 10, 20];
    console.log(_numbers)
    return _numbers;
  }
  if (level === "5") {
    let allNumbers = [];
    for (let x = 0.1; x < 10; x += 0.1) {
      x = Math.round(x * 10) / 10;
      allNumbers.push(x);
    }
    console.log(allNumbers);
    while (_numbers.length < 6) {
      let index = Math.floor(Math.random() * allNumbers.length);
      if (!_numbers.includes(allNumbers[index])) {
        _numbers.push(allNumbers[index]);
      }
    }
    let x = _numbers.length;
    while (x < 12) {
      let i = Math.floor(Math.random() * 8 + 2);
      if (!_numbers.includes(i)) {
        _numbers.push(i);
        x++;
      }
    }
    return _numbers;
  }
}

function createSmallGrid(numbers) {
  const smallGridIds = {
    SA: 1,
    SB: 2,
    SC: 3,
  };
  let smallGridDict = {};
  let pointer = 0;
  let target = document.getElementById("numbers");
  for (const [key, value] of Object.entries(smallGridIds)) {
    let row = value;
    for (let x = 1; x < 5; x++) {
      let _id = key + x;
      let _button = document.createElement("div");
      let _svg = createSVGElement("svg")
      let _base = createSVGElement("rect")
      let _text = createSVGElement("text")
      _text.innerHTML = numbers[pointer];
      _button.onclick = () => chooseNumber(_id);
      setAttributes(_button, {
        style: `grid-row-start: ${row};
                  grid-row-end: ${row + 1};
                  grid-column-start: ${x};
                  grid-column-end: ${x + 1};
                  width: 10vh;
                  height: 10vh;
                  padding:"2%";
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
        "stroke-dasharray":"10",
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

function generateAllGridNumbers(_numbers) {
  let x = 0;
  //let y = 0;
  //let o = "";
  let digits;
  //let flag = false;
  let allGridNumbers = [];
  //let gridNumbers = [];
  if (level === "1") {
    for (let numOne of _numbers) {
      for (let numTwo of _numbers) {
        let multiNum = (parseFloat(numOne) * parseFloat(numTwo)).toString();
        if (multiNum.length < 3 && !allGridNumbers.includes(multiNum)) {
          allGridNumbers.push(multiNum);
        }
      }
    }
  } else {
    switch (level) {
      case "2":
        digits = 3;
        break;
      case "3":
        digits = 3;
        break;
      case "4":
        digits = 5;
        break;
      case "5":
        digits = 5;
        break;
    }
    for (let numOne of _numbers) {
      for (let numTwo of _numbers) {
        if (numOne !== numTwo) {
          let divNum = (parseFloat(numOne) / parseFloat(numTwo)).toString();
          let multiNum = (parseFloat(numOne) * parseFloat(numTwo)).toString();
          if (
            divNum.includes(".") &&
            !allGridNumbers.includes(divNum) &&
            divNum.length < digits + 1
          ) {
            allGridNumbers.push(divNum);
          }
          if (
            !divNum.includes(".") &&
            !allGridNumbers.includes(divNum) &&
            divNum.length < digits
          ) {
            allGridNumbers.push(divNum);
          }
          if (
            multiNum.includes(".") &&
            !allGridNumbers.includes(multiNum) &&
            multiNum.length < digits + 1
          ) {
            allGridNumbers.push(multiNum);
          }
          if (
            !multiNum.includes(".") &&
            !allGridNumbers.includes(multiNum) &&
            multiNum.length < digits
          ) {
            allGridNumbers.push(multiNum);
          }
        }
      }
    }
  }
  //console.log(allGridNumbers.length)
  if (allGridNumbers.length < 36) {
    console.log("logged rerun");
    let newNumbers = generateNumbers;
    return generateAllGridNumbers(newNumbers);
  } else {
    return allGridNumbers;
  }
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
    F: 6
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
    _button.className = "grid-button";
    _button.onclick = () => chooseElement(key);
    _text.innerHTML = value
    _playerTwo.innerHTML = "O"
    _playerOne.innerHTML = "X"
    setAttributes(_button, {
      style: `
              grid-row-start: ${row};
              grid-row-end: ${parseInt(row)+1}; 
              grid-column-start: ${column};
              grid-column-end: ${parseInt(column)+1};
              height: 13vh;
              width: 14vh;
              margin-top: -2vh;
              `
    })
    setAttributes(_svg, {
      height: "13vh",
      width: "13vh",
      
    })
    setAttributes(_text, {
      id: "t"+key,
      stroke: "white",
      fill: "white",
      x: "52%",
      y: "65%",
      "font-size": "2em",
      "text-anchor": "middle",
    })
    setAttributes(_playerOne, {
      id: "p1"+key,
      stroke: "transparent",
      fill: "transparent",
      x: "52%",
      y: "85%",
      "font-size": "5em",
      "text-anchor": "middle",
    })
    setAttributes(_playerTwo, {
      id: "p2"+key,
      stroke: "transparent",
      fill: "transparent",
      x: "52%",
      y: "85%",
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

function createOperators() {
  let buttons = [];
  let target = document.getElementById("buttons");
  ["*", "/"].map((operator, i) => {
    let _id = "O" + operator;
    let _button = document.createElement("div");
    let _svg = createSVGElement("svg")
    let _shadow = createSVGElement("rect")
    let _base = createSVGElement("rect")
    let _shading = createSVGElement("rect")
    let _text = createSVGElement("text")
    setAttributes(_button, {
      style: `
              width: 12vh;
              height: 12vh;
              grid-column-start: ${i + 1};
              grid-column-end: ${i + 2}; 
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
    _button.onclick = () => chooseOperator(_id);
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
  let target = document.getElementById("t"+_id);
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
      y: "65%",
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
      y: "55%",
  });
}

function chooseNumber(_id) { 
  let target = document.getElementById("exprText");
  let choice = document.getElementById("t" +_id).innerHTML;
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
    clearInterval(newTimer);
    let playerTextID = player ? "p1" : "p2";
    let fill = player ? "#2053c2cf" : "#de423fcf";
    
    let answer;
    switch (enteredNumbers[1]) {
      case "/":
        answer = parseFloat(enteredNumbers[0]) / parseFloat(enteredNumbers[2]);
        break;
      case "*":
        answer = parseFloat(enteredNumbers[0]) * parseFloat(enteredNumbers[2]);
        break;
    }
    let toCheckId = chosenNumber[0];
    playerTextID += toCheckId
    let textID = "t" + toCheckId
    if (answer === chosenNumber[1]) {
      disabledNumbers.push(toCheckId);
      let _div = document.getElementById(toCheckId)
      let _text = document.getElementById(textID)
      let _playerText = document.getElementById(playerTextID)
      _div.onclick = () => null;
      
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
        let winner = player ? playerNames[0] : playerNames[1];
        let text = "Congratulations to " + winner + " for a fine win!";
        document.getElementById("player-name").innerHTML = text;
        player ? (scores.playerOne += 1) : (scores.playerTwo += 1);
        let score = player ? scores.playerOne : scores.playerTwo;
        let color = player ? "#2053c275" : "#de423f75";
        if (score < 6) {
          let _id = player ? "p1" + score : "p2" + score;
          document.getElementById(_id).style.backgroundColor = color;
        }
        document.getElementById("tcheck").innerHTML = "new game";
        document.getElementById("check").onclick = () => newGame();
        return 0;
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
  let y = 0;
  newTimer = setInterval(() => {
    document.getElementById("timer-bar").setAttribute("height", (100 - y).toString() + "%")
    y += 1;
    if (y > 100) newPlayer();
  }, 50);
}

function timerDown() {
  let color = player ? "rgb(32,83,194)" : "rgb(222,66,63)";
  document.getElementById("timer-fill").setAttribute("fill", color)
  let y = 100;
  newTimer = setInterval(() => {
    document.getElementById("timer-bar").setAttribute("height", (100 - y).toString() + "%")
    y -= 0.5;
    if (y < 0) getReady();
  }, 150);
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
  let cover = document.getElementById("cover");
  let playerSymbol = document.getElementById("player-symbol");
  let getReady = document.getElementById("get-ready");



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
  

  cover.style.zIndex = 1
  
  document.getElementById("timer-text-box").setAttribute("fill", sbcolor);
  playerSymbol.setAttribute("fill", sycolor);
  
  timerUp();
}

function newPlayer() {
  clearInterval(newTimer);
  document.getElementById("cover").style.zIndex = -1 
  document.getElementById("get-ready").innerHTML = "GO!";
  timerDown();
}

function newGame() {
  document.getElementById("tcheck").innerHTML = "Check";
  document.getElementById("check").onclick = () => check();
  reset(2);
}

function reset(flag) {
  clearAll(true);
  if (flag === 1 || flag === 2) {
    clearInterval(newTimer);
    document.getElementById("board").innerHTML="";
    document.getElementById("numbers").innerHTML="";
    document.getElementById("O*").remove();
    if (level !== "1") document.getElementById("O/").remove();
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
    document.getElementById("popup").style.zIndex = 2;
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
  console.log(gridNumbersDict)
  createGrid(gridNumbersDict);
  createOperators(operators);
  getReady();
}

// Global variables
let customNumbers = {
  "CN1": 0,
  "CN2": 0, 
  "CN3": 0, 
  "CN4": 0, 
  "CN5": 0, 
  "CN6": 0, 
  "CN7": 0, 
  "CN8": 0, 
  "CN9": 0, 
  "CN10": 0, 
  "CN11": 0, 
  "CN12": 0, 
}
let operators = ["*", "/", "/"];
let numbers = [];
let gridNumbersDict = {};
let gridNumbers = [];
let scores = {
  playerOne: 0,
  playerTwo: 0
};
let level = 1;
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