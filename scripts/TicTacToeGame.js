export default class TicTacToeGame {
    constructor(cells, board, endMessage, endText, restartButton, modeButtons) {
        this.cells = cells;
        this.board = board;
        this.endMessage = endMessage;
        this.endText = endText;
        this.restartButton = restartButton;
        this.modeButtons = modeButtons;
        this.X_CLASS = 'x';
        this.O_CLASS = 'o';
        this.xTurn = true;
        this.WINNING_COMBINATIONS = [
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        this.makeMove = this.makeMove.bind(this);
        this.gameMode = this.findActiveModeButton().dataset.gameMode;
        this.modeButtons.forEach(button => {
            button.addEventListener('click', this.changeMode.bind(this));
        });
    }
    findActiveModeButton() {
        return this.modeButtons.filter(button => {
            if (button.classList.contains('active'))
                return true;
            return false;
        })[0];
    }
    changeMode(e) {
        const button = e.currentTarget;
        if (button.dataset.gameMode === this.gameMode)
            return;
        this.findActiveModeButton().classList.remove('active');
        this.gameMode = button.dataset.gameMode;
        button.classList.add('active');
    }
    startGame() {
        this.setBoardHoverClass();
        this.endMessage.classList.remove('show');
        this.cells.forEach((cell) => {
            cell.classList.remove(this.X_CLASS);
            cell.classList.remove(this.O_CLASS);
            cell.addEventListener('click', this.makeMove, { once: true });
        });
        this.restartButton.addEventListener('click', this.startGame.bind(this));
    }
    makeMove(e) {
        const cell = e.target;
        const currentClass = this.xTurn ? this.X_CLASS : this.O_CLASS;
        this.placeMark(cell, currentClass);
        this.swapTurns();
        if (this.checkWin(currentClass))
            this.gameOver();
        else if (this.checkDraw())
            this.gameOver(true);
    }
    placeMark(cell, currentClass) {
        cell.classList.add(currentClass);
    }
    swapTurns() {
        this.xTurn = !this.xTurn;
        this.setBoardHoverClass();
    }
    setBoardHoverClass() {
        this.board.classList.remove(this.O_CLASS);
        this.board.classList.remove(this.X_CLASS);
        if (this.xTurn) {
            this.board.classList.add(this.X_CLASS);
        }
        else {
            this.board.classList.add(this.O_CLASS);
        }
    }
    checkWin(currentClass) {
        return this.WINNING_COMBINATIONS.some((combination) => {
            return combination.every((index) => {
                return this.cells[index].classList.contains(currentClass);
            });
        });
    }
    checkDraw() {
        return [...this.cells].every((cell) => {
            return (cell.classList.contains(this.X_CLASS) ||
                cell.classList.contains(this.O_CLASS));
        });
    }
    gameOver(draw = false) {
        this.endText.innerText = draw
            ? 'Draw!'
            : `${this.xTurn ? 'Circle' : 'Cross'} player Wins!`;
        this.endMessage.classList.add('show');
    }
}
