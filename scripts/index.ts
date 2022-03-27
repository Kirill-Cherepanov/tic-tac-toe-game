import TicTacToeGame from '../scripts/TicTacToeGame.js';

const X_CLASS: string = 'x';
const O_CLASS: string = 'o';

const cellElements: NodeListOf<HTMLDivElement> =
    document.querySelectorAll('[data-cell]');
const board = <HTMLDivElement>document.getElementById('gameboard');
const endMessage = <HTMLDivElement>document.querySelector('[data-end-message]');
const endText = <HTMLDivElement>document.querySelector('[data-end-text]');
const restartButton = <HTMLDivElement>(
    document.querySelector('[data-restart-button]')
);
const singlePlayerButton = <HTMLButtonElement>(
    document.getElementById('single-button')
);
const multiPlayerButton = <HTMLButtonElement>(
    document.getElementById('multi-button')
);
const aiButton = <HTMLButtonElement>document.getElementById('ai-button');
const multiPlayerMenu = <HTMLDivElement>document.querySelector('[data-multiplayer-menu]');
const usernameForm = <HTMLFormElement>document.getElementById('username-form');

const ticTacToe: TicTacToeGame = new TicTacToeGame(
    cellElements,
    board,
    endMessage,
    endText,
    restartButton,
    [singlePlayerButton, multiPlayerButton, aiButton],
    multiPlayerMenu,
    usernameForm
);

ticTacToe.startGame();
