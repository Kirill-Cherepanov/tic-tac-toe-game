export default class TicTacToeGame {
    cells: NodeListOf<HTMLDivElement>;
    board: HTMLDivElement;
    endMessage: HTMLDivElement;
    endText: HTMLDivElement;
    restartButton: HTMLDivElement;
    modeButtons: HTMLButtonElement[];
    X_CLASS: string;
    O_CLASS: string;
    xTurn: boolean;
    gameMode: string;
    sessions: HTMLButtonElement[];
    WINNING_COMBINATIONS: [number, number, number][];
    multiPlayerMenu: HTMLDivElement;
    usernameForm: HTMLFormElement;

    constructor(
        cells: NodeListOf<HTMLDivElement>,
        board: HTMLDivElement,
        endMessage: HTMLDivElement,
        endText: HTMLDivElement,
        restartButton: HTMLDivElement,
        modeButtons: HTMLButtonElement[],
        multiPlayerMenu: HTMLDivElement,
        usernameForm: HTMLFormElement
    ) {
        this.cells = cells;
        this.board = board;
        this.endMessage = endMessage;
        this.endText = endText;
        this.restartButton = restartButton;
        this.modeButtons = modeButtons;
        this.multiPlayerMenu = multiPlayerMenu;
        this.usernameForm = usernameForm;

        this.gameMode = <string>this.findActiveModeButton().dataset.gameMode;
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

    protected addListeners(): void {
        this.restartButton.addEventListener('click', this.startGame.bind(this));
        this.usernameForm.addEventListener(
            'submit',
            this.submitUsernameFormHandler.bind(this)
        );
        this.modeButtons.forEach((button) => {
            button.addEventListener('click', this.changeMode);
        });
    }

    protected clearSessions() {
        this.sessions.forEach(session => {
            session.parentElement?.removeChild(session);
        });
    }

    protected fetchSessions() {
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

    protected addSessions() {
        // Should probably remake this into asynchronous
        this.clearSessions();

        type SessionData = {
            username: string;
            port: string;
        };
        const sessionsData: SessionData[] = this.fetchSessions();

        sessionsData.forEach((sessionData) => {
            const sessionElement: HTMLButtonElement = this.createSessionElement(sessionData);
            const nicknameSpan = <HTMLSpanElement>sessionElement.childNodes[0];
            const cancelIcon = <HTMLElement>sessionElement.childNodes[1];
            const acceptIcon = <HTMLElement>sessionElement.childNodes[2];
            
            this.sessions.push(sessionElement);

            sessionElement.addEventListener('click', (e: Event) => {
                if (
                    (e.target !== sessionElement &&
                        e.target !== nicknameSpan) ||
                    sessionElement.classList.contains('confirm') ||
                    sessionElement.classList.contains('active')
                ) {
                    return;
                }

                sessionElement.classList.add('confirm');

                acceptIcon.addEventListener(
                    'click',
                    () => {
                        // Send invitation to the selected player

                        sessionElement.classList.remove('confirm');
                        sessionElement.classList.add('active');
                    },
                    { once: true }
                );

                cancelIcon.addEventListener(
                    'click',
                    () => {
                        sessionElement.classList.remove('confirm');
                        sessionElement.classList.remove('active');
                    },
                    { once: true }
                );
            });

            this.multiPlayerMenu.append(sessionElement);
        });
    }

    protected createSessionElement(sessionData: {
        username: string;
        port: string;
    }): HTMLButtonElement {
        const sessionElement: HTMLButtonElement =
        document.createElement('button');
        sessionElement.classList.add('multiplayer-session');

        const nicknameSpan: HTMLSpanElement =
            document.createElement('span');
        nicknameSpan.classList.add('multiplayer-nickname');
        nicknameSpan.dataset['sessionNickname'] = '';
        nicknameSpan.innerText = sessionData.username;

        const cancelIcon: HTMLElement = document.createElement('i');
        cancelIcon.classList.add('cancel-icon');

        const acceptIcon: HTMLElement = document.createElement('i');
        acceptIcon.classList.add('accept-icon');

        sessionElement.append(nicknameSpan, cancelIcon, acceptIcon);

        return sessionElement;
    }

    protected submitUsernameFormHandler(e: Event): void {
        e.preventDefault();
        const form = <HTMLFormElement>e.currentTarget;
        const usernameInput = <HTMLInputElement>form.elements['username'];
        if (usernameInput.value === '') return;

        // Here we should send data about the user to the server
        localStorage.setItem('username', usernameInput.value);

        this.addSessions();

        this.multiPlayerMenu.classList.remove('entering-username');
        this.multiPlayerMenu.classList.add('search');
    }

    findActiveModeButton(): HTMLButtonElement {
        return this.modeButtons.filter((button) => {
            if (button.classList.contains('active')) return true;
            return false;
        })[0];
    }

    changeMode(e: Event): void {
        const button = <HTMLButtonElement>e.currentTarget;

        if (button.dataset.gameMode === this.gameMode) return;

        this.findActiveModeButton().classList.remove('active');
        this.gameMode = <string>button.dataset.gameMode;
        button.classList.add('active');

        if (this.gameMode === 'multi') {
            this.multiPlayerMenu.classList.add('entering-username');
            const username: string = localStorage.getItem('username') || '';
            this.usernameForm.elements['username'].value = username;
        } else {
            this.multiPlayerMenu.classList.remove('entering-username');
            this.multiPlayerMenu.classList.remove('search');
        }

        this.startGame();
    }

    startGame(): void {
        if (this.gameMode === 'single') {
            this.setBoardHoverClass();
            this.endMessage.classList.remove('show');
            this.cells.forEach((cell) => {
                cell.classList.remove(this.X_CLASS);
                cell.classList.remove(this.O_CLASS);
                cell.addEventListener('click', this.makeMove, { once: true });
            });
        } else if (this.gameMode === 'multi') {
            /*
            
            При клике игроком по кнопке мультиплеера, поверх доски появляется окно запращивающее его никнейм.

            После ввода никнейма, это окно заменяется другим, отображающим список всех тех, кто ищет игру (также находится в мультиплеере, после ввода никнейма).

            Для всех остальных игроков в списке начинает отображаться никнейм нашего игрока.

            При выборе интересующего нас игрока, появляется сообщение с просьбой подождать.

            У игрока, которому выслали запрос на игру, игрок что выслал запрос появляется вверху списка и подсвечивается отдельным цветом. Также может где-нибудь появляется уведомление.

            На принятие игры дается 30 секунд и у обоих игроков идет таймер.

            При принятии игры начинается совместная игра...

            */
        } else {
            alert('The ai game mode is not yet configured!');
        }
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
        return this.WINNING_COMBINATIONS.some((combination) => {
            return combination.every((index) => {
                return this.cells[index].classList.contains(currentClass);
            });
        });
    }

    protected checkDraw(): boolean {
        return [...this.cells].every((cell) => {
            return (
                cell.classList.contains(this.X_CLASS) ||
                cell.classList.contains(this.O_CLASS)
            );
        });
    }

    protected gameOver(draw: boolean = false): void {
        this.endText.innerText = draw
            ? 'Draw!'
            : `${this.xTurn ? 'Circle' : 'Cross'} player Wins!`;
        this.endMessage.classList.add('show');
    }
}
