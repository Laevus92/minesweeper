const DIFFICULT = { easy: [100, 10], normal: [225, 25], hard: [625, 99] };
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
  stepsValue.className = 'steps__quanuty';
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
  minesValue.className = 'mines__quanuty';
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

const stepsQuantity = document.querySelector('.steps__quanuty');
const timeValue = document.querySelector('.timer__time-value');
let stepCounter = 0;
let timerId;
let timeCounter = 0;
let timerRunning = false;
let isWinID = '';
const clickSound = new Audio('/assets/sounds/open_cell.mp3');
const looseSound = new Audio('/assets/sounds/explosion.mp3');
const winSound = new Audio('/assets/sounds/yahoo.mp3');
const markSound = new Audio('/assets/sounds/hit.mp3');
const unmarkSound = new Audio('/assets/sounds/unmark.mp3');
const newGameSound = new Audio('/assets/sounds/new-game.mp3');
let mute = false;

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

let indexesBombs = [];
let cellsWithoutBomb = [];
let cellsWithBomb = [];

function createMatrix(level = DIFFICULT.easy) {
  indexesBombs = [];
  const [cellsQuantity, bombsQuantity] = level;
  const matrixWidth = Math.sqrt(cellsQuantity);
  const matrixHeight = matrixWidth;
  const matrix = [];
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
  console.log(matrix);
  return matrix;
}

function countStep(cell) {
  if (!cell.classList.contains('field__cell_opened')) {
    if (!cell.classList.contains('field__cell_marked')) {
      stepCounter += 1;
      stepsQuantity.textContent = stepCounter;
    }
  }
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

function createField(level = DIFFICULT.easy) {
  const [cellsQuantity, bombsQuantity] = level;
  const fieldWith = Math.sqrt(cellsQuantity) * (40 * (100 / 1280));
  const fieldHeight = Math.sqrt(cellsQuantity) * (40 * (100 / 1280));
  let field = document.createElement('div');
  field.className = 'field';
  field.style.width = `${fieldWith}vw`;
  field.style.height = `${fieldHeight}vw`;
  document.querySelector('main').appendChild(field);
  field = document.querySelector('.field');
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
  document.querySelector('.mines__quanuty').textContent = bombsQuantity;
  for (let i = 0; i < cellsQuantity; i += 1) {
    const randomCell = document.createElement('div');
    randomCell.className = 'field__cell';
    randomCell.style.width = `${100 / (Math.sqrt(cellsQuantity))}%`;
    randomCell.style.height = `${100 / (Math.sqrt(cellsQuantity))}%`;
    field.appendChild(randomCell);
  }
  const cells = document.querySelectorAll('.field__cell');
  let matrix = createMatrix(level);

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
        cellStyle.style.backgroundImage = 'url(/assets/img/png/bomb.png)';
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
      tableSubtitle.textContent = `time: ${document.querySelector('.timer__time-value').textContent} steps: ${document.querySelector('.steps__quanuty').textContent}`;
      clearInterval(isWinID);
      playSound(winSound, mute);
      showBombs();
    }
  }
  function markCell(cell) {
    let flagsCount = Number.parseInt(document.querySelector('.mines__quanuty').textContent, 10);
    if (flagsCount > 0 && !cell.classList.contains('field__cell_marked')
    && !cell.classList.contains('field__cell_opened')) {
      cell.classList.add('field__cell_marked');
      flagsCount -= 1;
      document.querySelector('.mines__quanuty').textContent = flagsCount;
      playSound(markSound, mute);
    } else if (cell.classList.contains('field__cell_marked')) {
      cell.classList.remove('field__cell_marked');
      flagsCount += 1;
      document.querySelector('.mines__quanuty').textContent = flagsCount;
      playSound(unmarkSound, mute);
    }
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
      if (columnNumber > 0) {
        checkCell(cells[Array.from(cells).indexOf(cell) - 1]);
      }
      if (columnNumber < Math.sqrt(cellsQuantity) - 1) {
        checkCell(cells[Array.from(cells).indexOf(cell) + 1]);
      }
      if (stringNumber > 0) {
        checkCell(cells[Array.from(cells).indexOf(cell) - Math.sqrt(cellsQuantity)]);
      }
      if (stringNumber < Math.sqrt(cellsQuantity) - 1) {
        checkCell(cells[Array.from(cells).indexOf(cell) + Math.sqrt(cellsQuantity)]);
      }
    } else if (matrix[stringNumber][columnNumber] === 'B' && !cell.classList.contains('field__cell_marked')) {
      stopTimer();
      clearInterval(isWinID);
      resultTable.classList.add('field__result-table_active');
      tableTitle.textContent = 'YOU LOOSE!';
      tableSubtitle.textContent = `time: ${document.querySelector('.timer__time-value').textContent} steps: ${document.querySelector('.steps__quanuty').textContent}`;
      document.querySelector('.players-statistic__avatar').style.backgroundImage = 'url(/assets/img/png/rip.png)';
      cell.classList.add('field__cell_opened');
      cellStyle.style.backgroundImage = 'url(/assets/img/png/bomb.png)';
      cellStyle.style.backgroundColor = '#47341e';
      showBombs();
      playSound(looseSound, mute);
    }
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
    });

    // eslint-disable-next-line no-use-before-define
    tableButton.addEventListener('click', startNewGame);
  });

  cells.forEach((cell) => {
    cell.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      markCell(event.target);
    });
  });
}

createField();

const levelSelector = document.querySelector('.level__selector');

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
  document.querySelector('.players-statistic__avatar').style.backgroundImage = 'url(/assets/img/png/soldier.png)';
  timeValue.textContent = '00:00';
  stepsQuantity.textContent = '000';
  // const field = document.querySelector('.field');
  // const inputWidth = document.querySelector('.level__input-width');
  // const inputMines = document.querySelector('.level__input-mines');
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
    muteButton.style.backgroundImage = 'url(/assets/img/png/no-sound.png)';
  } else {
    mute = false;
    muteButton.style.backgroundImage = 'url(/assets/img/png/sound.png)';
  }
});
