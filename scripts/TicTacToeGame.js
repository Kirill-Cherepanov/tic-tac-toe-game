export default class TicTacToeGame {
    constructor(cells, board, endMessage, endText, restartButton, modeButtons, multiPlayerMenu, usernameForm) {
        this.cells = cells;
        this.board = board;
        this.endMessage = endMessage;
        this.endText = endText;
        this.restartButton = restartButton;
        this.modeButtons = modeButtons;
        this.multiPlayerMenu = multiPlayerMenu;
        this.usernameForm = usernameForm;
        this.gameMode = this.findActiveModeButton().dataset.gameMode;
        this.sessions = [];
        this.xTurn = true;
        this.X_CLASS = 'x';
        this.O_CLASS = 'o';
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
        this.changeMode = this.changeMode.bind(this);
        this.addListeners();
    }
    addListeners() {
        this.restartButton.addEventListener('click', this.startGame.bind(this));
        this.usernameForm.addEventListener('submit', this.submitUsernameFormHandler.bind(this));
        this.modeButtons.forEach((button) => {
            button.addEventListener('click', this.changeMode);
        });
    }
    clearSessions() {
        this.sessions.forEach(session => {
            var _a;
            (_a = session.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(session);
        });
    }
    fetchSessions() {
        // Here we receive current sessions from the server. For now I will set const sessions
        return [
            {
                // Don't know what should be there besides username tbh
                username: 'KissMyUSSR',
                port: 'idk. useless for now'
            },
            {
                username: 'Kot-payk',
                port: '...'
            },
            {
                username: 'Teazzy',
                port: '...'
            }
        ];
    }
    addSessions() {
        // Should probably remake this into asynchronous
        this.clearSessions();
        const sessionsData = this.fetchSessions();
        sessionsData.forEach((sessionData) => {
            const sessionElement = this.createSessionElement(sessionData);
            const nicknameSpan = sessionElement.childNodes[0];
            const cancelIcon = sessionElement.childNodes[1];
            const acceptIcon = sessionElement.childNodes[2];
            this.sessions.push(sessionElement);
            sessionElement.addEventListener('click', (e) => {
                if ((e.target !== sessionElement &&
                    e.target !== nicknameSpan) ||
                    sessionElement.classList.contains('confirm') ||
                    sessionElement.classList.contains('active')) {
                    return;
                }
                sessionElement.classList.add('confirm');
                acceptIcon.addEventListener('click', () => {
                    // Send invitation to the selected player
                    sessionElement.classList.remove('confirm');
                    sessionElement.classList.add('active');
                }, { once: true });
                cancelIcon.addEventListener('click', () => {
                    sessionElement.classList.remove('confirm');
                    sessionElement.classList.remove('active');
                }, { once: true });
            });
            this.multiPlayerMenu.append(sessionElement);
        });
    }
    createSessionElement(sessionData) {
        const sessionElement = document.createElement('button');
        sessionElement.classList.add('multiplayer-session');
        const nicknameSpan = document.createElement('span');
        nicknameSpan.classList.add('multiplayer-nickname');
        nicknameSpan.dataset['sessionNickname'] = '';
        nicknameSpan.innerText = sessionData.username;
        const cancelIcon = document.createElement('i');
        cancelIcon.classList.add('cancel-icon');
        const acceptIcon = document.createElement('i');
        acceptIcon.classList.add('accept-icon');
        sessionElement.append(nicknameSpan, cancelIcon, acceptIcon);
        return sessionElement;
    }
    submitUsernameFormHandler(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const usernameInput = form.elements['username'];
        if (usernameInput.value === '')
            return;
        // Here we should send data about the user to the server
        localStorage.setItem('username', usernameInput.value);
        this.addSessions();
        this.multiPlayerMenu.classList.remove('entering-username');
        this.multiPlayerMenu.classList.add('search');
    }
    findActiveModeButton() {
        return this.modeButtons.filter((button) => {
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
        if (this.gameMode === 'multi') {
            this.multiPlayerMenu.classList.add('entering-username');
            const username = localStorage.getItem('username') || '';
            this.usernameForm.elements['username'].value = username;
        }
        else {
            this.multiPlayerMenu.classList.remove('entering-username');
            this.multiPlayerMenu.classList.remove('search');
        }
        this.startGame();
    }
    startGame() {
        if (this.gameMode === 'single') {
            this.setBoardHoverClass();
            this.endMessage.classList.remove('show');
            this.cells.forEach((cell) => {
                cell.classList.remove(this.X_CLASS);
                cell.classList.remove(this.O_CLASS);
                cell.addEventListener('click', this.makeMove, { once: true });
            });
        }
        else if (this.gameMode === 'multi') {
            /*
            
            При клике игроком по кнопке мультиплеера, поверх доски появляется окно запращивающее его никнейм.

            После ввода никнейма, это окно заменяется другим, отображающим список всех тех, кто ищет игру (также находится в мультиплеере, после ввода никнейма).

            Для всех остальных игроков в списке начинает отображаться никнейм нашего игрока.

            При выборе интересующего нас игрока, появляется сообщение с просьбой подождать.

            У игрока, которому выслали запрос на игру, игрок что выслал запрос появляется вверху списка и подсвечивается отдельным цветом. Также может где-нибудь появляется уведомление.

            На принятие игры дается 30 секунд и у обоих игроков идет таймер.

            При принятии игры начинается совместная игра...

            */
        }
        else {
            alert('The ai game mode is not yet configured!');
        }
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
