"use strict";

class GameState {
  constructor() {
    this.isActive = false;
    this.shownCount = 0;
    this.markedCount = 0;
    this.lives = GAME_CONFIG.SETTINGS.INITIAL_LIVES;
    this.isFirstClick = true;
    this.currentLevel = "beginner";
    this.board = null;
    this.timer = {
      interval: null,
      milliseconds: 0,
      seconds: 0,
    };
  }

  reset() {
    this.isActive = true;
    this.shownCount = 0;
    this.markedCount = 0;
    this.lives = GAME_CONFIG.SETTINGS.INITIAL_LIVES;
    this.isFirstClick = true;
    this.clearTimer();
  }

  clearTimer() {
    if (this.timer.interval) {
      clearInterval(this.timer.interval);
      this.timer.interval = null;
    }
    this.timer.milliseconds = 0;
    this.timer.seconds = 0;
  }

  startTimer() {
    if (!this.timer.interval) {
      this.timer.interval = setInterval(() => {
        this.timer.milliseconds += GAME_CONFIG.SETTINGS.TIMER_INTERVAL;
        if (this.timer.milliseconds === 1000) {
          this.timer.milliseconds = 0;
          this.timer.seconds++;
        }
        this.updateTimerDisplay();
      }, GAME_CONFIG.SETTINGS.TIMER_INTERVAL);
    }
  }

  updateTimerDisplay() {
    const timerElement = document.querySelector(".box.stop-watch");
    if (timerElement) {
      timerElement.textContent = this.timer.seconds.toString();
    }
  }
}

class Board {
  constructor(size) {
    this.size = size;
    this.grid = [];
    this.createGrid();
  }

  createGrid() {
    this.grid = [];
    for (let i = 0; i < this.size; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.grid[i][j] = {
          isMine: false,
          isShown: false,
          isMarked: false,
          minesAroundCount: 0,
        };
      }
    }
  }

  placeMines(mineCount, excludeRow = -1, excludeCol = -1) {
    let placedMines = 0;
    const maxAttempts =
      mineCount * GAME_CONFIG.SETTINGS.MAX_MINE_PLACEMENT_ATTEMPTS;
    let attempts = 0;

    while (placedMines < mineCount && attempts < maxAttempts) {
      const row = getRandomIntInclusive(0, this.size - 1);
      const col = getRandomIntInclusive(0, this.size - 1);

      if (
        (row !== excludeRow || col !== excludeCol) &&
        !this.grid[row][col].isMine
      ) {
        this.grid[row][col].isMine = true;
        placedMines++;
      }
      attempts++;
    }

    this.calculateMinesAround();
  }

  calculateMinesAround() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (!this.grid[i][j].isMine) {
          this.grid[i][j].minesAroundCount = this.countMinesAround(i, j);
        }
      }
    }
  }

  countMinesAround(row, col) {
    let count = 0;
    for (
      let i = Math.max(0, row - 1);
      i <= Math.min(this.size - 1, row + 1);
      i++
    ) {
      for (
        let j = Math.max(0, col - 1);
        j <= Math.min(this.size - 1, col + 1);
        j++
      ) {
        if (this.grid[i][j].isMine) {
          count++;
        }
      }
    }
    return count;
  }

  isValidPosition(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  getCell(row, col) {
    return this.isValidPosition(row, col) ? this.grid[row][col] : null;
  }
}

class GameUI {
  constructor() {
    this.table = document.querySelector("table");
    this.livesElement = document.querySelector(".box.lives");
    this.smileyElement = document.querySelector(".box.smily");
    this.timerElement = document.querySelector(".box.stop-watch");
    this.gameStatusElement = document.getElementById("game-status");
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.table.addEventListener("click", (e) => this.handleCellClick(e));
    this.table.addEventListener("contextmenu", (e) =>
      this.handleCellRightClick(e)
    );
    document.addEventListener("keydown", (e) => this.handleKeyboard(e));
  }

  handleCellClick(e) {
    const cell = e.target.closest("td");
    if (!cell) return;

    const { row, col } = this.getCellCoordinates(cell);
    if (row !== -1 && col !== -1) {
      game.handleCellClick(row, col);
    }
  }

  handleCellRightClick(e) {
    e.preventDefault();
    const cell = e.target.closest("td");
    if (!cell) return;

    const { row, col } = this.getCellCoordinates(cell);
    if (row !== -1 && col !== -1) {
      game.handleCellRightClick(row, col);
    }
  }

  handleKeyboard(e) {
    if (!game.state.isActive) return;

    switch (e.key) {
      case "r":
      case "R":
        if (e.ctrlKey) {
          e.preventDefault();
          game.initGame();
        }
        break;
      case "Escape":
        game.initGame();
        break;
    }
  }

  getCellCoordinates(cell) {
    const className = cell.className;
    const match = className.match(/cell(\d+)(\d+)/);
    return match
      ? { row: parseInt(match[1]), col: parseInt(match[2]) }
      : { row: -1, col: -1 };
  }

  renderBoard(board) {
    let html = "";
    for (let i = 0; i < board.size; i++) {
      html += "<tr>";
      for (let j = 0; j < board.size; j++) {
        const cell = board.getCell(i, j);
        html += this.renderCell(cell, i, j);
      }
      html += "</tr>";
    }
    this.table.innerHTML = html;
  }

  renderCell(cell, row, col) {
    const cellClass = `cell${row}${col}`;
    const content = this.getCellContent(cell);
    const ariaLabel = this.getCellAriaLabel(cell, row, col);

    return `<td class="${cellClass}" 
                    data-row="${row}" 
                    data-col="${col}"
                    aria-label="${ariaLabel}"
                    tabindex="0"
                    role="gridcell">
                    <span class="cell-content">${content}</span>
                </td>`;
  }

  getCellContent(cell) {
    if (cell.isMarked) return GAME_CONFIG.EMOJIS.FLAG;
    if (!cell.isShown) return "";
    if (cell.isMine) return GAME_CONFIG.EMOJIS.MINE;
    return cell.minesAroundCount || "";
  }

  getCellAriaLabel(cell, row, col) {
    if (cell.isMarked)
      return `Flagged cell at row ${row + 1}, column ${col + 1}`;
    if (!cell.isShown)
      return `Hidden cell at row ${row + 1}, column ${col + 1}`;
    if (cell.isMine) return `Mine at row ${row + 1}, column ${col + 1}`;
    return `Cell at row ${row + 1}, column ${col + 1} with ${
      cell.minesAroundCount
    } mines around`;
  }

  updateCell(row, col, cell) {
    const cellElement = document.querySelector(`.cell${row}${col}`);
    if (cellElement) {
      const contentElement = cellElement.querySelector(".cell-content");
      if (contentElement) {
        contentElement.textContent = this.getCellContent(cell);
      }

      cellElement.classList.toggle("active", cell.isShown);
      cellElement.classList.toggle("marked", cell.isMarked);
      cellElement.setAttribute(
        "aria-label",
        this.getCellAriaLabel(cell, row, col)
      );
    }
  }

  updateLives(lives) {
    this.livesElement.innerHTML = GAME_CONFIG.EMOJIS.LIVES.repeat(lives);
    this.announceToScreenReader(`Lives remaining: ${lives}`);
  }

  updateSmiley(emoji) {
    this.smileyElement.textContent = emoji;
  }

  updateTimer(seconds) {
    this.timerElement.textContent = seconds.toString();
  }

  announceToScreenReader(message) {
    if (this.gameStatusElement) {
      this.gameStatusElement.textContent = message;
    }
  }

  showGameOver(won) {
    const message = won ? "Congratulations! You won!" : "Game Over! You lost!";
    this.announceToScreenReader(message);

    this.table.classList.add(won ? "game-won" : "game-lost");
    setTimeout(() => {
      this.table.classList.remove("game-won", "game-lost");
    }, GAME_CONFIG.SETTINGS.GAME_OVER_ANIMATION_DURATION);
  }
}

// Main Game Controller
class MinesweeperGame {
  constructor() {
    this.state = new GameState();
    this.ui = new GameUI();
    this.board = null;
    this.initGame();
  }

  initGame() {
    const config = GAME_CONFIG.LEVELS[this.state.currentLevel];
    this.board = new Board(config.size);
    this.state.reset();
    this.ui.renderBoard(this.board);
    this.ui.updateLives(this.state.lives);
    this.ui.updateSmiley(GAME_CONFIG.EMOJIS.SMILE);
    this.ui.updateTimer(0);
    this.ui.announceToScreenReader("New game started");
  }

  handleCellClick(row, col) {
    if (!this.state.isActive) return;

    const cell = this.board.getCell(row, col);
    if (!cell || cell.isMarked) return;

    if (this.state.isFirstClick) {
      this.handleFirstClick(row, col);
    } else {
      this.handleRegularClick(row, col);
    }
  }

  handleFirstClick(row, col) {
    const config = GAME_CONFIG.LEVELS[this.state.currentLevel];
    this.board.placeMines(config.mines, row, col);
    this.state.isFirstClick = false;
    this.state.startTimer();
    this.handleRegularClick(row, col);
  }

  handleRegularClick(row, col) {
    const cell = this.board.getCell(row, col);
    if (!cell) return;

    if (cell.isMine) {
      this.handleMineClick(row, col);
    } else {
      this.revealCell(row, col);
    }
  }

  handleMineClick(row, col) {
    const cell = this.board.getCell(row, col);
    cell.isShown = true;
    this.state.lives--;

    this.ui.updateCell(row, col, cell);
    this.ui.updateLives(this.state.lives);
    this.ui.updateSmiley(GAME_CONFIG.EMOJIS.LOSE);

    if (this.state.lives <= 0) {
      this.endGame(false);
    } else {
      setTimeout(() => {
        cell.isShown = false;
        this.ui.updateCell(row, col, cell);
        this.ui.updateSmiley(GAME_CONFIG.EMOJIS.SMILE);
      }, GAME_CONFIG.SETTINGS.ANIMATION_DURATION);
    }
  }

  revealCell(row, col) {
    const cell = this.board.getCell(row, col);
    if (!cell || cell.isShown || cell.isMarked) return;

    cell.isShown = true;
    this.state.shownCount++;
    this.ui.updateCell(row, col, cell);

    if (cell.minesAroundCount === 0) {
      this.expandEmptyCells(row, col);
    }

    this.checkVictory();
  }

  expandEmptyCells(row, col) {
    for (
      let i = Math.max(0, row - 1);
      i <= Math.min(this.board.size - 1, row + 1);
      i++
    ) {
      for (
        let j = Math.max(0, col - 1);
        j <= Math.min(this.board.size - 1, col + 1);
        j++
      ) {
        this.revealCell(i, j);
      }
    }
  }

  handleCellRightClick(row, col) {
    if (!this.state.isActive) return;

    const cell = this.board.getCell(row, col);
    if (!cell || cell.isShown) return;

    cell.isMarked = !cell.isMarked;
    this.state.markedCount += cell.isMarked ? 1 : -1;

    this.ui.updateCell(row, col, cell);
    this.checkVictory();
  }

  checkVictory() {
    const config = GAME_CONFIG.LEVELS[this.state.currentLevel];
    const totalCells = config.size * config.size;
    const revealedCells = this.state.shownCount;
    const correctMarks = this.state.markedCount === config.mines;

    if (revealedCells === totalCells - config.mines && correctMarks) {
      this.endGame(true);
    }
  }

  endGame(won) {
    this.state.isActive = false;
    this.state.clearTimer();

    if (won) {
      this.ui.updateSmiley(GAME_CONFIG.EMOJIS.WIN);
      this.revealAllMines();
    } else {
      this.ui.updateSmiley(GAME_CONFIG.EMOJIS.LOSE);
      this.revealAllMines();
    }

    this.ui.showGameOver(won);
    this.saveGameStats(won);
  }

  revealAllMines() {
    for (let i = 0; i < this.board.size; i++) {
      for (let j = 0; j < this.board.size; j++) {
        const cell = this.board.getCell(i, j);
        if (cell.isMine) {
          cell.isShown = true;
          this.ui.updateCell(i, j, cell);
        }
      }
    }
  }

  saveGameStats(won) {
    const stats = JSON.parse(
      localStorage.getItem(GAME_CONFIG.STORAGE.GAME_STATS) || "{}"
    );
    const level = this.state.currentLevel;

    if (!stats[level]) {
      stats[level] = { wins: 0, losses: 0, bestTime: null };
    }

    if (won) {
      stats[level].wins++;
      const time = this.state.timer.seconds;
      if (!stats[level].bestTime || time < stats[level].bestTime) {
        stats[level].bestTime = time;
      }
    } else {
      stats[level].losses++;
    }

    localStorage.setItem(GAME_CONFIG.STORAGE.GAME_STATS, JSON.stringify(stats));
  }

  changeLevel(level) {
    if (GAME_CONFIG.LEVELS[level]) {
      this.state.currentLevel = level;
      this.updateLevelButtons(level);
      this.initGame();
    }
  }

  updateLevelButtons(activeLevel) {
    document.querySelectorAll(".levels-box .box").forEach((button) => {
      const level = button.dataset.level;
      button.setAttribute(
        "aria-pressed",
        level === activeLevel ? "true" : "false"
      );
    });
  }
}

let game;

document.addEventListener("DOMContentLoaded", () => {
  game = new MinesweeperGame();

  document.querySelectorAll(".levels-box .box").forEach((button) => {
    button.addEventListener("click", () => {
      game.changeLevel(button.dataset.level);
    });
  });

  document.querySelector(".box.smily").addEventListener("click", () => {
    game.initGame();
  });
});

// Disable context menu
window.addEventListener("contextmenu", (e) => e.preventDefault());
