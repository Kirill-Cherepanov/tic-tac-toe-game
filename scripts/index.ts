import TicTacToeGame from '../scripts/TicTacToeGame.js';

const X_CLASS: string = 'x';
const O_CLASS: string = 'o';

const cellElements: NodeListOf<HTMLDivElement> = document.querySelectorAll('[data-cell]');
const board = <HTMLDivElement>document.querySelector('.gameboard');
const endMessage = <HTMLDivElement>document.querySelector('.end-message');
const endText = <HTMLDivElement>document.querySelector('[data-end-text]');
const restartButton = <HTMLDivElement>document.querySelector('[data-restart-button]');

const ticTacToe: TicTacToeGame = new TicTacToeGame(cellElements, board, endMessage, endText, restartButton, X_CLASS, O_CLASS);

ticTacToe.startGame();
