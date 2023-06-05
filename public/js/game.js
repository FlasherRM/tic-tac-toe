document.addEventListener("DOMContentLoaded", function() {
    const cells = document.querySelectorAll('.cell');
    const host = window.location.origin;

    function getCookieValue(cookieName) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(cookieName + '=')) {
                return cookie.substring(cookieName.length + 1);
            }
        }
        return null;
    }

    const guestToken = getCookieValue('guest_token');

    const socket = io();

    socket.on('enemy moved', (data) => {
        console.log('somebody moved')
        if (data.secondToken === guestToken) {
            console.log(data)
            moved(data.gameTurn, data.cellId);

            yourTurn = true
        }
    });

    const roomId = document.getElementById('roomId').getAttribute('data-value');

    let gameState = {
        cell1: '',
        cell2: '',
        cell3: '',
        cell4: '',
        cell5: '',
        cell6: '',
        cell7: '',
        cell8: '',
        cell9: ''
    };

    let gameTurn = 'X';
    let gameEnded = false;
    let yourTurn = true

    function moved(player = gameTurn, cellId) {
        let cellName = 'cell' + cellId;
        gameState[cellName] = gameTurn;
        cells[cellId - 1].textContent = gameTurn;
        gameTurn = gameTurn === 'X' ? 'O' : 'X';
        console.log('Game state:', gameState);

        checkWin();
    }

    yourTurn = document.getElementById('your-turn').getAttribute('data-value') === "yes";

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if(!yourTurn) {
                console.log('wtf are you doing?')
                return
            }
            if (gameEnded) {
                console.log('GAME ENDED!');
                return;
            }
            const cellId = cell.getAttribute('id')
            const cellName = 'cell' + cellId;

            if (gameState[cellName] !== '') {
                console.log('ALREADY CLICKED!');
                return;
            }

            moved(gameTurn, cellId)

            console.log(roomId)

            socket.emit('playerMove', {roomId, gameTurn, cellId});

            yourTurn = false
        });
    });

    const buttonReset = document.querySelector('#button_reset');
    buttonReset.addEventListener('click', () => {
        gameState = {
            cell1: '',
            cell2: '',
            cell3: '',
            cell4: '',
            cell5: '',
            cell6: '',
            cell7: '',
            cell8: '',
            cell9: ''
        };
        gameEnded = false;
        gameTurn = 'X';
        cells.forEach(cell => {
            cell.textContent = '';
        });
        changeGameState(4)
        console.log('Game state:', gameState);
    });

    function checkWin() {
        const winningCombinations = [
            ['cell1', 'cell2', 'cell3'],
            ['cell4', 'cell5', 'cell6'],
            ['cell7', 'cell8', 'cell9'],
            ['cell1', 'cell4', 'cell7'],
            ['cell2', 'cell5', 'cell8'],
            ['cell3', 'cell6', 'cell9'],
            ['cell1', 'cell5', 'cell9'],
            ['cell3', 'cell5', 'cell7']
        ];

        for (const combination of winningCombinations) {
            const [cellA, cellB, cellC] = combination;
            if (
                gameState[cellA] &&
                gameState[cellA] === gameState[cellB] &&
                gameState[cellA] === gameState[cellC]
            ) {
                console.log(`${gameState[cellA]} wins!`);
                if (gameState[cellA] === 'X') {
                    changeGameState(1)
                } else if (gameState[cellA] === 'O') {
                    changeGameState(2)
                }
                gameEnded = true;
                break;
            }
        }

        if (!gameEnded) {
            let isAllCellsClicked = true;
            for (const cell in gameState) {
                if (gameState[cell] === '') {
                    isAllCellsClicked = false;
                    break;
                }
            }
            if (isAllCellsClicked) {
                console.log('Game over. It\'s a draw!');
                changeGameState(3)
                gameEnded = true;
            }
        }
    }

    const element_of_status = document.querySelector('#game-status')

    function changeGameState(condition) {
        // 1 - X wins
        // 2 - 0 wins
        // 3 - Draw
        // 4 - to Base
        switch (condition) {
            case 1:
                element_of_status.textContent = 'X won!';
                element_of_status.classList.add('blue')
                break
            case 2:
                element_of_status.textContent = 'O won!';
                element_of_status.classList.add('red')
                break
            case 3:
                element_of_status.textContent = 'DRAW!';
                element_of_status.classList.add('gray')
                break
            case 4:
                element_of_status.textContent = '';
                element_of_status.classList.remove('gray')
                element_of_status.classList.remove('red')
                element_of_status.classList.remove('blue')
                break
        }
    }
})