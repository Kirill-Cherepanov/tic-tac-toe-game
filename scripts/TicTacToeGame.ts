export default class TicTacToeGame {
    cells: NodeListOf<HTMLDivElement>;
    board: HTMLDivElement;
    endMessage: HTMLDivElement;
    endText: HTMLDivElement;
    restartButton: HTMLDivElement;
    X_CLASS: string;
    O_CLASS: string;
    xTurn: boolean;
    WINNING_COMBINATIONS: [number, number, number][];

    constructor(cells: NodeListOf<HTMLDivElement>, board: HTMLDivElement, endMessage: HTMLDivElement, endText: HTMLDivElement, restartButton: HTMLDivElement, X_CLASS: string, O_CLASS: string, xTurn: boolean = true) {
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
        ]
    }

    startGame(): void {
        this.setBoardHoverClass();
        this.endMessage.classList.remove('show');
        this.cells.forEach(cell => {
            cell.classList.remove(this.X_CLASS);
            cell.classList.remove(this.O_CLASS);
            cell.addEventListener('click', this.makeMove, {once: true});
        });
        this.restartButton.addEventListener('click', this.startGame.bind(this));
    }

    protected makeMove(e: Event): void {
        const cell: HTMLDivElement = <HTMLDivElement>e.target;
        const currentClass: string = this.xTurn ? this.X_CLASS : this.O_CLASS;
        this.placeMark(cell, currentClass);
        this.swapTurns();
        if (this.checkWin(currentClass)) this.gameOver();
        else if (this.checkDraw()) this.gameOver(true);
    }

    protected placeMark(cell: HTMLDivElement, currentClass: string): void {
        cell.classList.add(currentClass);
    }

    protected swapTurns(): void {
        this.xTurn = !this.xTurn;
        this.setBoardHoverClass();
    }

    protected setBoardHoverClass(): void {
        this.board.classList.remove(this.O_CLASS);
        this.board.classList.remove(this.X_CLASS);
        if (this.xTurn) {
            this.board.classList.add(this.X_CLASS);
        } else {
            this.board.classList.add(this.O_CLASS);
        }
    }

    protected checkWin(currentClass: string): boolean {
        return this.WINNING_COMBINATIONS.some(combination => {
            return combination.every(index => {
                return this.cells[index].classList.contains(currentClass);
            });
        });
    }

    protected checkDraw(): boolean {
        return [...this.cells].every(cell => {
            return cell.classList.contains(this.X_CLASS) || 
                cell.classList.contains(this.O_CLASS);
        });
    }

    protected gameOver(draw: boolean = false): void {
        this.endText.innerText = draw ? 'Draw!' : `${this.xTurn ? 'Circle' : 'Cross'} player Wins!`;
        this.endMessage.classList.add('show');
    }
}
