let DIFFICULT;
if (localStorage.getItem('difficult')) {
  DIFFICULT = JSON.parse(localStorage.getItem('difficult'));
} else {
  DIFFICULT = { easy: [100, 10], normal: [225, 25], hard: [625, 99] };
}

let result;
if (localStorage.getItem('results')) {
  result = JSON.parse(localStorage.getItem('results'));
} else {
  result = [];
}

function createInterface() {
  // create wrapper
  let wrapper = document.createElement('div');
  wrapper.className = 'wrapper';
  document.querySelector('body').appendChild(wrapper);
  wrapper = document.querySelector('.wrapper');
  let main = document.createElement('main');
  main.classList = 'main';
  wrapper.appendChild(main);
  main = document.querySelector('.main');
  let aside = document.createElement('aside');
  aside.classList = 'aside';
  main.appendChild(aside);
  aside = document.querySelector('.aside');
  // create game info
  let playersStatistic = document.createElement('div');
  playersStatistic.className = 'players-statistic';
  aside.appendChild(playersStatistic);
  playersStatistic = document.querySelector('.players-statistic');
  // create avatar
  const playersAvatar = document.createElement('div');
  playersAvatar.className = 'players-statistic__avatar';
  playersStatistic.appendChild(playersAvatar);
  // create timer
  let timer = document.createElement('div');
  timer.className = 'players-statistic__timer timer';
  playersStatistic.appendChild(timer);
  timer = document.querySelector('.players-statistic__timer');
  const timerIcon = document.createElement('div');
  timerIcon.className = 'timer__icon';
  timer.appendChild(timerIcon);
  const timerValue = document.createElement('div');
  timerValue.className = 'timer__time-value';
  timerValue.textContent = '00:00';
  timer.appendChild(timerValue);
  // create steps quantity
  let steps = document.createElement('div');
  steps.className = 'players-statistic__steps steps';
  playersStatistic.appendChild(steps);
  steps = document.querySelector('.players-statistic__steps');
  const stepsIcon = document.createElement('div');
  stepsIcon.className = 'steps__icon';
  steps.appendChild(stepsIcon);
  const stepsValue = document.createElement('div');
  stepsValue.className = 'steps__quanity';
  stepsValue.textContent = '000';
  steps.appendChild(stepsValue);
  // create mines quantity
  let mines = document.createElement('div');
  mines.className = 'players-statistic__mines mines';
  playersStatistic.appendChild(mines);
  mines = document.querySelector('.players-statistic__mines');
  const minesIcon = document.createElement('div');
  minesIcon.className = 'mines__icon';
  mines.appendChild(minesIcon);
  const minesValue = document.createElement('div');
  minesValue.className = 'mines__quanity';
  minesValue.textContent = '000';
  mines.appendChild(minesValue);
  // create conttrol panel
  let controlPanel = document.createElement('div');
  controlPanel.className = 'control-panel';
  aside.appendChild(controlPanel);
  controlPanel = document.querySelector('.control-panel');
  let buttons = document.createElement('div');
  buttons.classList = 'control-panel__buttons';
  controlPanel.appendChild(buttons);
  buttons = document.querySelector('.control-panel__buttons');
  const muteButton = document.createElement('div');
  muteButton.classList = 'control-panel__sound-button';
  buttons.appendChild(muteButton);
  const newGameButton = document.createElement('div');
  newGameButton.classList = 'control-panel__new-game-button';
  buttons.appendChild(newGameButton);
  const recordsButton = document.createElement('div');
  recordsButton.classList = 'control-panel__record-button';
  buttons.appendChild(recordsButton);
  let level = document.createElement('div');
  level.className = 'control-panel__level level';
  controlPanel.appendChild(level);
  level = document.querySelector('.control-panel__level');
  const levelIcon = document.createElement('div');
  levelIcon.className = 'level__img';
  level.appendChild(levelIcon);
  let selector = document.createElement('select');
  selector.className = 'level__selector';
  level.appendChild(selector);
  selector = document.querySelector('.level__selector');
  const easyLevel = document.createElement('option');
  easyLevel.className = 'level__item';
  easyLevel.textContent = 'easy';
  easyLevel.value = 'easy';
  selector.appendChild(easyLevel);
  const normalLevel = document.createElement('option');
  normalLevel.className = 'level__item';
  normalLevel.textContent = 'normal';
  normalLevel.value = 'normal';
  selector.appendChild(normalLevel);
  const hardLevel = document.createElement('option');
  hardLevel.className = 'level__item';
  hardLevel.textContent = 'hard';
  hardLevel.value = 'hard';
  selector.appendChild(hardLevel);
  const customLevel = document.createElement('option');
  customLevel.className = 'level__item';
  customLevel.textContent = 'custom';
  selector.appendChild(customLevel);
  const inputWith = document.createElement('input');
  inputWith.className = 'level__input-width';
  inputWith.setAttribute('placeholder', 'fields width');
  level.appendChild(inputWith);
  const inputMines = document.createElement('input');
  inputMines.className = 'level__input-mines';
  inputMines.setAttribute('placeholder', 'mines quantity');
  level.appendChild(inputMines);
  const okButton = document.createElement('button');
  okButton.className = 'level__button';
  okButton.textContent = 'ok';
  level.appendChild(okButton);
}
createInterface();
const main = document.querySelector('.main');

function createRecordTable() {
  let records = document.createElement('div');
  records.className = 'main__records';
  main.appendChild(records);
  records = document.querySelector('.main__records');
  const recordsTitle = document.createElement('h3');
  recordsTitle.classList = 'main__record-title';
  recordsTitle.textContent = 'Records';
  records.appendChild(recordsTitle);
  let recordsTable = document.createElement('ul');
  recordsTable.classList = 'main__records-table';
  records.appendChild(recordsTable);
  recordsTable = document.querySelector('.main__records-table');
  const recordButton = document.createElement('button');
  recordButton.classList = 'main__record-button';
  recordButton.textContent = 'Close';
  records.appendChild(recordButton);
}

createRecordTable();
const recordsTable = document.querySelector('.main__records-table');
const records = document.querySelector('.main__records');
const recordButton = document.querySelector('.main__record-button');
const stepsQuantity = document.querySelector('.steps__quanity');
const timeValue = document.querySelector('.timer__time-value');
const statisticButton = document.querySelector('.control-panel__record-button');
let stepCounter = 0;
let timerId;
let timeCounter = 0;
let timerRunning = false;
let isWinID = '';
const clickSound = new Audio('./assets/sounds/open_cell.mp3');
const looseSound = new Audio('./assets/sounds/explosion.mp3');
const winSound = new Audio('./assets/sounds/yahoo.mp3');
const markSound = new Audio('./assets/sounds/hit.mp3');
const unmarkSound = new Audio('./assets/sounds/unmark.mp3');
const newGameSound = new Audio('./assets/sounds/new-game.mp3');
let mute = false;
let currentGame;
let isContinue;

if (localStorage.getItem('isContinue')) {
  isContinue = JSON.parse(localStorage.getItem('isContinue'));
} else {
  isContinue = false;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

let indexesBombs = [];
let cellsWithoutBomb = [];
let cellsWithBomb = [];
let matrix;

function createMatrix(level = DIFFICULT.easy) {
  indexesBombs = [];
  const [cellsQuantity, bombsQuantity] = level;
  const matrixWidth = Math.sqrt(cellsQuantity);
  const matrixHeight = matrixWidth;
  matrix = [];
  for (let i = 0; i < matrixHeight; i += 1) {
    const string = [];
    for (let j = 0; j < matrixWidth; j += 1) {
      string.push(0);
    }
    matrix.push(string);
  }

  for (let i = 0; i < bombsQuantity; i += 1) {
    let columnNumber = getRandomNumber(0, matrixHeight);
    let stringNumber = getRandomNumber(0, matrixWidth);
    if (matrix[stringNumber][columnNumber] === 'B') {
      while (matrix[stringNumber][columnNumber] === 'B') {
        columnNumber = getRandomNumber(0, matrixHeight);
        stringNumber = getRandomNumber(0, matrixWidth);
      }
    }
    matrix[stringNumber][columnNumber] = 'B';
    indexesBombs.push(stringNumber * matrixWidth + columnNumber);
  }
  currentGame.bombs = indexesBombs;
  matrix.forEach((subArray, axisY) => {
    subArray.forEach((element, axisX) => {
      if (element === 'B') {
        if (axisX > 0) {
          if (subArray[axisX - 1] !== 'B') {
            subArray[axisX - 1] += 1;
          }
        }
        if (axisX < matrixWidth - 1) {
          if (subArray[axisX + 1] !== 'B') {
            subArray[axisX + 1] += 1;
          }
        }
        if (axisY > 0) {
          if (matrix[axisY - 1][axisX] !== 'B') {
            matrix[axisY - 1][axisX] += 1;
          }
          if (axisX > 0) {
            if (matrix[axisY - 1][axisX - 1] !== 'B') {
              matrix[axisY - 1][axisX - 1] += 1;
            }
          }
          if (axisX < matrixWidth - 1) {
            if (matrix[axisY - 1][axisX + 1] !== 'B') {
              matrix[axisY - 1][axisX + 1] += 1;
            }
          }
        }
        if (axisY < matrixHeight - 1) {
          if (matrix[axisY + 1][axisX] !== 'B') {
            matrix[axisY + 1][axisX] += 1;
          }
          if (axisX > 0) {
            if (matrix[axisY + 1][axisX - 1] !== 'B') {
              matrix[axisY + 1][axisX - 1] += 1;
            }
          }
          if (axisX < matrixWidth - 1) {
            if (matrix[axisY + 1][axisX + 1] !== 'B') {
              matrix[axisY + 1][axisX + 1] += 1;
            }
          }
        }
      }
    });
  });
  const cells = document.querySelectorAll('.field__cell');
  cellsWithBomb = [];
  cellsWithoutBomb = [];
  for (let i = 0; i < cellsQuantity; i += 1) {
    if (!indexesBombs.includes(Array.from(cells).indexOf(cells[i]))) {
      cellsWithoutBomb.push(cells[i]);
    } else {
      cellsWithBomb.push(cells[i]);
    }
  }
  currentGame.matrix = matrix;
  // console.log(matrix);
  return matrix;
}

function countStep(cell) {
  if (!cell.classList.contains('field__cell_opened')) {
    if (!cell.classList.contains('field__cell_marked')) {
      stepCounter += 1;
      stepsQuantity.textContent = stepCounter;
    }
  }
  currentGame.steps = stepCounter;
}

function time() {
  timeCounter += 1;
  if (timeCounter < 60) {
    timeValue.textContent = (`00:${timeCounter < 10 ? `0${timeCounter}` : timeCounter}`);
  } else {
    const minutes = Math.floor(timeCounter / 60);
    const secundes = timeCounter - (minutes * 60);
    timeValue.textContent = (`${minutes < 10 ? `0${minutes}` : minutes}:${secundes < 10 ? `0${secundes}` : secundes}`);
  }
  currentGame.time = timeCounter;
}

function startTimer() {
  if (timerRunning) {
    return;
  }
  timerRunning = true;
  timerId = setInterval(time, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  timerRunning = false;
}

function switchNumberColor(element) {
  const styleElement = element.style;
  switch (element.textContent) {
    case '1':
      styleElement.color = '#3F51B5';
      break;
    case '2':
      styleElement.color = '#4CAF50';
      break;
    case '3':
      styleElement.color = '#F44336';
      break;
    case '4':
      styleElement.color = '#FFEB3B';
      break;
    case '5':
      styleElement.color = '#9C27B0';
      break;
    case '6':
      styleElement.color = '#00BCD4';
      break;
    case '7':
      styleElement.color = '#FFFFFF';
      break;
    case '8':
      styleElement.color = '#000000';
      break;
    default:
      styleElement.color = '#000000';
      break;
  }
}

function playSound(sound, volume) {
  if (volume === false) {
    sound.play();
  }
}

function saveResult(win) {
  const currentResult = {};
  if (result.length < 10) {
    if (win) {
      currentResult.result = 'WIN';
    } else {
      currentResult.result = 'LOOSE';
    }
    currentResult.time = `time: ${document.querySelector('.timer__time-value').textContent}`;
    currentResult.steps = `steps: ${document.querySelector('.steps__quanity').textContent}`;
    result.push(currentResult);
  } else {
    result.shift();
    if (win) {
      currentResult.result = 'WIN';
    } else {
      currentResult.result = 'LOOSE';
    }
    currentResult.time = `time: ${document.querySelector('.timer__time-value').textContent}`;
    currentResult.steps = `steps: ${document.querySelector('.steps__quanity').textContent}`;
    result.push(currentResult);
  }
  console.log(result);
}
function openRecordsTab() {
  if (!records.classList.contains('main__records_active')) {
    records.classList.add('main__records_active');
    result.forEach((currentResult) => {
      const li = document.createElement('li');
      li.className = 'main__records-item';
      li.textContent = `${result.indexOf(currentResult) + 1}. ${currentResult.result} (${currentResult.time} ${currentResult.steps})`;
      recordsTable.appendChild(li);
    });
  } else {
    const list = document.querySelectorAll('.main__records-item');
    records.classList.remove('main__records_active');
    list.forEach((element) => element.remove());
  }
}
let flagsCount;
function createField(level = DIFFICULT.easy) {
  isContinue = false;
  currentGame = {};
  const [cellsQuantity, bombsQuantity] = level;
  const fieldWith = Math.sqrt(cellsQuantity) * (40 * (100 / 1280));
  const fieldHeight = Math.sqrt(cellsQuantity) * (40 * (100 / 1280));
  currentGame.fieldSize = fieldWith;
  let field = document.createElement('div');
  // create game field;
  field.className = 'field';
  field.style.width = `${fieldWith}vw`;
  field.style.height = `${fieldHeight}vw`;
  main.appendChild(field);
  field = document.querySelector('.field');
  // create results pop-up
  let resultTable = document.createElement('div');
  resultTable.className = 'field__result-table';
  field.appendChild(resultTable);
  resultTable = document.querySelector('.field__result-table');
  let tableTitle = document.createElement('h3');
  tableTitle.classList = 'field__table-title';
  resultTable.appendChild(tableTitle);
  tableTitle = document.querySelector('.field__table-title');
  let tableSubtitle = document.createElement('p');
  tableSubtitle.classList = 'field__table-subtitle';
  resultTable.appendChild(tableSubtitle);
  tableSubtitle = document.querySelector('.field__table-subtitle');
  let tableButton = document.createElement('button');
  tableButton.classList = 'field__table-button';
  tableButton.textContent = 'Try again!';
  resultTable.appendChild(tableButton);
  tableButton = document.querySelector('.field__table-button');
  document.querySelector('.mines__quanity').textContent = bombsQuantity;
  flagsCount = bombsQuantity;
  // create field cells
  for (let i = 0; i < cellsQuantity; i += 1) {
    const randomCell = document.createElement('div');
    randomCell.className = 'field__cell';
    randomCell.style.width = `${100 / (Math.sqrt(cellsQuantity))}%`;
    randomCell.style.height = `${100 / (Math.sqrt(cellsQuantity))}%`;
    field.appendChild(randomCell);
  }
  const cells = document.querySelectorAll('.field__cell');
  matrix = createMatrix(level);

  // eslint-disable-next-line no-use-before-define
  isWinID = setInterval(isWin, 500);

  function showBombs() {
    cells.forEach((cell) => {
      const cellStyle = cell;
      const allStringNumber = Math.floor(Array.from(cells).indexOf(cell)
      / Math.sqrt(cellsQuantity));
      const allColumnNumber = Array.from(cells).indexOf(cell)
      - (Math.sqrt(cellsQuantity) * allStringNumber);

      if (matrix[allStringNumber][allColumnNumber] === 'B') {
        cellStyle.style.backgroundImage = 'url(./assets/img/png/bomb.png)';
        cellStyle.style.backgroundColor = '#47341e';
      }

      cell.classList.add('field__cell_opened');
      cell.classList.remove('field__cell_marked');
      cell.removeEventListener('click', countStep);

      if (matrix[allStringNumber][allColumnNumber] !== 'B' && matrix[allStringNumber][allColumnNumber] !== 0) {
        cellStyle.textContent = matrix[allStringNumber][allColumnNumber];
        switchNumberColor(cell);
      }
    });
  }

  function isWin() {
    if (cellsWithoutBomb.every((element) => element.classList.contains('field__cell_opened'))
    && cellsWithBomb.every((element) => !element.classList.contains('field__cell_opened'))) {
      stopTimer();
      resultTable.classList.add('field__result-table_active');
      tableTitle.textContent = 'YOU WIN!';
      tableSubtitle.textContent = `time: ${document.querySelector('.timer__time-value').textContent} steps: ${document.querySelector('.steps__quanity').textContent}`;
      document.querySelector('.players-statistic__avatar').style.backgroundImage = 'url(./assets/img/png/winner.png)';
      clearInterval(isWinID);
      playSound(winSound, mute);
      showBombs();
      const win = true;
      saveResult(win);
    }
  }
  function markCell(cell) {
    if (flagsCount > 0 && !cell.classList.contains('field__cell_marked')
    && !cell.classList.contains('field__cell_opened')) {
      cell.classList.add('field__cell_marked');
      flagsCount -= 1;
      document.querySelector('.mines__quanity').textContent = flagsCount;
      playSound(markSound, mute);
    } else if (cell.classList.contains('field__cell_marked')) {
      cell.classList.remove('field__cell_marked');
      flagsCount += 1;
      document.querySelector('.mines__quanity').textContent = flagsCount;
      playSound(unmarkSound, mute);
    }
    currentGame.flags = flagsCount;
  }
  function checkCell(cell) {
    const cellStyle = cell;
    const stringNumber = Math.floor(Array.from(cells).indexOf(cell) / Math.sqrt(cellsQuantity));
    const columnNumber = Array.from(cells).indexOf(cell)
    - (Math.sqrt(cellsQuantity) * stringNumber);
    startTimer();
    if (Array.from(cells).every((element) => !element.classList.contains('field__cell_opened'))
    && !cell.classList.contains('field__cell_marked')) {
      while (matrix[stringNumber][columnNumber] === 'B') {
        matrix = createMatrix(level);
      }
    }
    if (matrix[stringNumber][columnNumber] !== 0 && matrix[stringNumber][columnNumber]
      !== 'B' && matrix[stringNumber][columnNumber] !== undefined && !cell.classList.contains('field__cell_marked')) {
      cell.classList.add('field__cell_opened');
      cellStyle.textContent = matrix[stringNumber][columnNumber];
      switchNumberColor(cell);
      playSound(clickSound, mute);
    } else if (matrix[stringNumber][columnNumber] === 0 && !cell.classList.contains('field__cell_opened')
    && !cell.classList.contains('field__cell_marked')) {
      cell.classList.add('field__cell_opened');
      // предыдущая ячейка
      if (columnNumber > 0) {
        checkCell(cells[Array.from(cells).indexOf(cell) - 1]);
      }
      // следующая ячейка
      if (columnNumber < Math.sqrt(cellsQuantity) - 1) {
        checkCell(cells[Array.from(cells).indexOf(cell) + 1]);
      }
      // ячейка ниже
      if (stringNumber > 0) {
        checkCell(cells[Array.from(cells).indexOf(cell) - Math.sqrt(cellsQuantity)]);
        // предыдущая ячейка
        if (columnNumber > 0) {
          checkCell(cells[Array.from(cells).indexOf(cell) - Math.sqrt(cellsQuantity) - 1]);
        }
        // следующая ячейка
        if (columnNumber < Math.sqrt(cellsQuantity) - 1) {
          checkCell(cells[Array.from(cells).indexOf(cell) - Math.sqrt(cellsQuantity) + 1]);
        }
      }
      // ячейка выше
      if (stringNumber < Math.sqrt(cellsQuantity) - 1) {
        checkCell(cells[Array.from(cells).indexOf(cell) + Math.sqrt(cellsQuantity)]);
        // предыдущая ячейка
        if (columnNumber > 0) {
          checkCell(cells[Array.from(cells).indexOf(cell) + Math.sqrt(cellsQuantity) - 1]);
        }
        // следующая ячейка
        if (columnNumber < Math.sqrt(cellsQuantity) - 1) {
          checkCell(cells[Array.from(cells).indexOf(cell) + Math.sqrt(cellsQuantity) + 1]);
        }
      }
    } else if (matrix[stringNumber][columnNumber] === 'B' && !cell.classList.contains('field__cell_marked')) {
      stopTimer();
      clearInterval(isWinID);
      resultTable.classList.add('field__result-table_active');
      tableTitle.textContent = 'YOU LOOSE!';
      tableSubtitle.textContent = `time: ${document.querySelector('.timer__time-value').textContent} steps: ${document.querySelector('.steps__quanity').textContent}`;
      document.querySelector('.players-statistic__avatar').style.backgroundImage = 'url(./assets/img/png/rip.png)';
      cell.classList.add('field__cell_opened');
      cellStyle.style.backgroundImage = 'url(./assets/img/png/bomb.png)';
      cellStyle.style.backgroundColor = '#47341e';
      showBombs();
      playSound(looseSound, mute);
      const win = false;
      saveResult(win);
    }
    isContinue = true;
  }
  // init steps counter
  cells.forEach((cell) => {
    cell.addEventListener('click', (event) => {
      countStep(event.target);
    });
  });
  // check cell
  cells.forEach((cell) => {
    cell.addEventListener('click', (event) => {
      checkCell(event.target);
      isWin();
      currentGame.cells = field.innerHTML;
      currentGame.flags = flagsCount;
    });

    // eslint-disable-next-line no-use-before-define
    tableButton.addEventListener('click', startNewGame);
  });

  cells.forEach((cell) => {
    cell.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      markCell(event.target);
      currentGame.cells = field.innerHTML;
      currentGame.flags = flagsCount;
    });
  });
  currentGame.cells = field.innerHTML;
}

const levelSelector = document.querySelector('.level__selector');

function loadGame() {
  if (localStorage.getItem('currentGame')) {
    currentGame = JSON.parse(localStorage.getItem('currentGame'));
  } else {
    currentGame = {};
  }
  let field = document.createElement('div');
  field.className = 'field';
  field.innerHTML = currentGame.cells;
  field.style.width = `${currentGame.fieldSize}vw`;
  field.style.height = `${currentGame.fieldSize}vw`;
  main.appendChild(field);
  matrix = currentGame.matrix;
  const cells = document.querySelectorAll('.field__cell');
  field = document.querySelector('.field');
  const resultTable = document.querySelector('.field__result-table');
  const tableTitle = document.querySelector('.field__table-title');
  const tableSubtitle = document.querySelector('.field__table-subtitle');
  const tableButton = document.querySelector('.field__table-button');
  indexesBombs = currentGame.bombs;
  cellsWithBomb = [];
  cellsWithoutBomb = [];
  if (localStorage.getItem('level')) {
    levelSelector.value = localStorage.getItem('level');
  }
  const [cellsQuantity, bombsQuantity] = DIFFICULT[levelSelector.value];
  for (let i = 0; i < cellsQuantity; i += 1) {
    if (!indexesBombs.includes(Array.from(cells).indexOf(cells[i]))) {
      cellsWithoutBomb.push(cells[i]);
    } else {
      cellsWithBomb.push(cells[i]);
    }
  }

  function showBombs() {
    cells.forEach((cell) => {
      const cellStyle = cell;
      const allStringNumber = Math.floor(Array.from(cells).indexOf(cell)
      / Math.sqrt(cellsQuantity));
      const allColumnNumber = Array.from(cells).indexOf(cell)
      - (Math.sqrt(cellsQuantity) * allStringNumber);

      if (matrix[allStringNumber][allColumnNumber] === 'B') {
        cellStyle.style.backgroundImage = 'url(./assets/img/png/bomb.png)';
        cellStyle.style.backgroundColor = '#47341e';
      }

      cell.classList.add('field__cell_opened');
      cell.classList.remove('field__cell_marked');
      cell.removeEventListener('click', countStep);

      if (matrix[allStringNumber][allColumnNumber] !== 'B' && matrix[allStringNumber][allColumnNumber] !== 0) {
        cellStyle.textContent = matrix[allStringNumber][allColumnNumber];
        switchNumberColor(cell);
      }
    });
  }

  function isWin() {
    if (cellsWithoutBomb.every((element) => element.classList.contains('field__cell_opened'))
    && cellsWithBomb.every((element) => !element.classList.contains('field__cell_opened'))) {
      stopTimer();
      resultTable.classList.add('field__result-table_active');
      tableTitle.textContent = 'YOU WIN!';
      tableSubtitle.textContent = `time: ${document.querySelector('.timer__time-value').textContent} steps: ${document.querySelector('.steps__quanity').textContent}`;
      document.querySelector('.players-statistic__avatar').style.backgroundImage = 'url(./assets/img/png/winner.png)';
      clearInterval(isWinID);
      playSound(winSound, mute);
      showBombs();
      const win = true;
      saveResult(win);
    }
  }

  isWinID = setInterval(isWin, 500);
  timeCounter = currentGame.time;
  startTimer();

  stepCounter = currentGame.steps;
  stepsQuantity.textContent = stepCounter;

  document.querySelector('.mines__quanity').textContent = currentGame.flags;

  function markCell(cell) {
    flagsCount = Number.parseInt(document.querySelector('.mines__quanity').textContent, 10);
    if (flagsCount > 0 && !cell.classList.contains('field__cell_marked')
    && !cell.classList.contains('field__cell_opened')) {
      cell.classList.add('field__cell_marked');
      flagsCount -= 1;
      document.querySelector('.mines__quanity').textContent = flagsCount;
      playSound(markSound, mute);
    } else if (cell.classList.contains('field__cell_marked')) {
      cell.classList.remove('field__cell_marked');
      flagsCount += 1;
      document.querySelector('.mines__quanity').textContent = flagsCount;
      playSound(unmarkSound, mute);
    }
  }

  function checkCell(cell) {
    const cellStyle = cell;
    const stringNumber = Math.floor(Array.from(cells).indexOf(cell) / Math.sqrt(cellsQuantity));
    const columnNumber = Array.from(cells).indexOf(cell)
    - (Math.sqrt(cellsQuantity) * stringNumber);
    // if (Array.from(cells).every((element) => !element.classList.contains('field__cell_opened'))
    // && !cell.classList.contains('field__cell_marked')) {
    //   while (matrix[stringNumber][columnNumber] === 'B') {
    //     matrix = createMatrix(level);
    //   }
    // }
    if (matrix[stringNumber][columnNumber] !== 0 && matrix[stringNumber][columnNumber]
      !== 'B' && matrix[stringNumber][columnNumber] !== undefined && !cell.classList.contains('field__cell_marked')) {
      cell.classList.add('field__cell_opened');
      cellStyle.textContent = matrix[stringNumber][columnNumber];
      switchNumberColor(cell);
      playSound(clickSound, mute);
    } else if (matrix[stringNumber][columnNumber] === 0 && !cell.classList.contains('field__cell_opened')
    && !cell.classList.contains('field__cell_marked')) {
      cell.classList.add('field__cell_opened');
      // предыдущая ячейка
      if (columnNumber > 0) {
        checkCell(cells[Array.from(cells).indexOf(cell) - 1]);
      }
      // следующая ячейка
      if (columnNumber < Math.sqrt(cellsQuantity) - 1) {
        checkCell(cells[Array.from(cells).indexOf(cell) + 1]);
      }
      // ячейка ниже
      if (stringNumber > 0) {
        checkCell(cells[Array.from(cells).indexOf(cell) - Math.sqrt(cellsQuantity)]);
        // предыдущая ячейка
        if (columnNumber > 0) {
          checkCell(cells[Array.from(cells).indexOf(cell) - Math.sqrt(cellsQuantity) - 1]);
        }
        // следующая ячейка
        if (columnNumber < Math.sqrt(cellsQuantity) - 1) {
          checkCell(cells[Array.from(cells).indexOf(cell) - Math.sqrt(cellsQuantity) + 1]);
        }
      }
      // ячейка выше
      if (stringNumber < Math.sqrt(cellsQuantity) - 1) {
        checkCell(cells[Array.from(cells).indexOf(cell) + Math.sqrt(cellsQuantity)]);
        // предыдущая ячейка
        if (columnNumber > 0) {
          checkCell(cells[Array.from(cells).indexOf(cell) + Math.sqrt(cellsQuantity) - 1]);
        }
        // следующая ячейка
        if (columnNumber < Math.sqrt(cellsQuantity) - 1) {
          checkCell(cells[Array.from(cells).indexOf(cell) + Math.sqrt(cellsQuantity) + 1]);
        }
      }
    } else if (matrix[stringNumber][columnNumber] === 'B' && !cell.classList.contains('field__cell_marked')) {
      stopTimer();
      clearInterval(isWinID);
      resultTable.classList.add('field__result-table_active');
      tableTitle.textContent = 'YOU LOOSE!';
      tableSubtitle.textContent = `time: ${document.querySelector('.timer__time-value').textContent} steps: ${document.querySelector('.steps__quanity').textContent}`;
      document.querySelector('.players-statistic__avatar').style.backgroundImage = 'url(./assets/img/png/rip.png)';
      cell.classList.add('field__cell_opened');
      cellStyle.style.backgroundImage = 'url(./assets/img/png/bomb.png)';
      cellStyle.style.backgroundColor = '#47341e';
      showBombs();
      playSound(looseSound, mute);
      const win = false;
      saveResult(win);
    }
    isContinue = true;
  }

  cells.forEach((cell) => {
    cell.addEventListener('click', (event) => {
      countStep(event.target);
    });
  });
  // check cell
  cells.forEach((cell) => {
    cell.addEventListener('click', (event) => {
      checkCell(event.target);
      isWin();
      currentGame.cells = field.innerHTML;
      currentGame.flags = flagsCount;
    });

    // eslint-disable-next-line no-use-before-define
    tableButton.addEventListener('click', startNewGame);
  });

  cells.forEach((cell) => {
    cell.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      markCell(event.target);
      currentGame.cells = field.innerHTML;
      currentGame.flags = flagsCount;
    });
  });
  currentGame.cells = field.innerHTML;
}

if (isContinue === true) {
  loadGame();
} else {
  createField();
}

function startNewCustomGame() {
  const inputWidth = document.querySelector('.level__input-width');
  const inputMines = document.querySelector('.level__input-mines');
  const okButton = document.querySelector('.level__button');
  let field = document.querySelector('.field');
  if (levelSelector.value !== 'custom') {
    inputWidth.classList.remove('level__input-width_active');
    inputMines.classList.remove('level__input-mines_active');
    okButton.classList.remove('level__button_active');
    if ((field) === null) {
      createField(DIFFICULT[levelSelector.value]);
    } else {
      field.remove();
      createField(DIFFICULT[levelSelector.value]);
    }
  } else {
    inputWidth.classList.add('level__input-width_active');
    inputMines.classList.add('level__input-mines_active');
    okButton.classList.add('level__button_active');
    if ((field) === null) {
      createField(DIFFICULT[levelSelector.value]);
    } else {
      field.remove();
      createField(DIFFICULT[levelSelector.value]);
    }
    if (inputWidth.value !== '' && inputMines.value !== '') {
      if ((inputWidth.value > 9 && inputWidth.value < 26)
      && (inputMines.value > 9 && inputMines.value < 100)) {
        field = document.querySelector('.field');
        DIFFICULT.custom = [inputWidth.value ** 2, parseInt(inputMines.value, 10)];
        if ((field) === null) {
          createField(DIFFICULT[levelSelector.value]);
        } else {
          field.remove();
          createField(DIFFICULT[levelSelector.value]);
        }
      } else {
        // eslint-disable-next-line no-alert
        alert('Ширина поля должна быть от 10 до 25!\nКоличество мин должно быть от 10 до 99!');
      }
    }
  }
  playSound(newGameSound, mute);
}

function startNewGame() {
  clearInterval(isWinID);
  stopTimer();
  stepCounter = 0;
  timeCounter = 0;
  document.querySelector('.players-statistic__avatar').style.backgroundImage = 'url(./assets/img/png/soldier.png)';
  timeValue.textContent = '00:00';
  stepsQuantity.textContent = '000';
  const okButton = document.querySelector('.level__button');
  startNewCustomGame();
  okButton.addEventListener('click', startNewCustomGame);
}

levelSelector.addEventListener('change', startNewGame);

const newGameButton = document.querySelector('.control-panel__new-game-button');
newGameButton.addEventListener('click', startNewGame);

const muteButton = document.querySelector('.control-panel__sound-button');
muteButton.addEventListener('click', () => {
  if (mute === false) {
    mute = true;
    muteButton.style.backgroundImage = 'url(./assets/img/png/no-sound.png)';
  } else {
    mute = false;
    muteButton.style.backgroundImage = 'url(./assets/img/png/sound.png)';
  }
});

statisticButton.addEventListener('click', openRecordsTab);

recordButton.addEventListener('click', openRecordsTab);

function setLocalStorage() {
  localStorage.setItem('results', JSON.stringify(result));
  localStorage.setItem('currentGame', JSON.stringify(currentGame));
  localStorage.setItem('difficult', JSON.stringify(DIFFICULT));
  localStorage.setItem('level', levelSelector.value);
  localStorage.setItem('isContinue', JSON.stringify(isContinue));
}

window.addEventListener('beforeunload', setLocalStorage);
