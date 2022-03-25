export default class TicTacToeGame {
    constructor(cells, board, endMessage, endText, restartButton, X_CLASS, O_CLASS, xTurn = true) {
        this.cells = cells;
        this.board = board;
        this.endMessage = endMessage;
        this.endText = endText;
        this.restartButton = restartButton;
        this.X_CLASS = X_CLASS;
        this.O_CLASS = O_CLASS;
        this.xTurn = xTurn;
        this.makeMove = this.makeMove.bind(this);
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
    }
    startGame() {
        this.setBoardHoverClass();
        this.endMessage.classList.remove('show');
        this.cells.forEach(cell => {
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
        return this.WINNING_COMBINATIONS.some(combination => {
            return combination.every(index => {
                return this.cells[index].classList.contains(currentClass);
            });
        });
    }
    checkDraw() {
        return [...this.cells].every(cell => {
            return cell.classList.contains(this.X_CLASS) ||
                cell.classList.contains(this.O_CLASS);
        });
    }
    gameOver(draw = false) {
        this.endText.innerText = draw ? 'Draw!' : `${this.xTurn ? 'Circle' : 'Cross'} player Wins!`;
        this.endMessage.classList.add('show');
    }
}
