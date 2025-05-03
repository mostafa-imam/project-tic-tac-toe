const gameboard = (function() {
    const rows = 3;
    const columns = 3;
    let board = [];
    let cellNum = 0;

    for (let i = 0; i < rows; i++) {
        board[i] = []; 
        for (let j = 0; j < columns; j++) {
            board[i].push( {
                cellNum: ++cellNum,
                col: j,
                mark: ''});
        }
    }

    function addMark(pos, player) {
        for (let row of board) {
            row.forEach(cell => {
                if (cell.cellNum === pos) {
                    cell.name = player.name;
                    cell.mark = player.mark;
                }
            });
        }
    }
    
    function checkInvalidMove(pos) {
        for (let row of board) {
            for (let cell of row) {
                if (cell.cellNum === pos && cell.mark) {
                    console.log('invalid move');
                    return true;
                }
            }
        }
    }
    
    function clearBoard() {
        for (let row of board) {
            for (let cell of row) {
                cell.mark = '';
                delete cell.name;
            }
        }
        console.log("Board cleared. Ready for a new game!");
    };

    const getBoard = () => board;

    return {
        addMark,
        checkInvalidMove,
        clearBoard,
        getBoard,
    };
})();

const gameController = (function() {

    let winnerDeclared = false;
    let draws = 0;
    let drawsDeclared = false;

    const players = [
        {
            name: "Player 1",
            mark: 'x',
            win: 0,
        },
        {
            name: "Player 2",
            mark: 'o',
            win: 0,
        }
    ]

    const getPlayer = (num) => {
        return players[num]
    };

    function setPlayerOneName(num, name = "Player 1") {
        players[num].name = name;
    }

    function setPlayerTwoName(num, name = "Player 2") {
        players[num].name = name;
    }

    let activePlayer = players[0];

    function switchActivePlayer() {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;
    
    const resetActivePlayer = () => {
        activePlayer = players[0];
    }

    function checkWinner(pos) {
        let targetCell = gameboard.getBoard().flat().find(cell => cell.cellNum === pos);
        let sameColumnCells = gameboard.getBoard().flat().filter(cell => cell.col === targetCell.col);
        let targetCellParentRow = gameboard.getBoard().find( row => row.includes(targetCell) );
        
        if (targetCell.mark === '') return;
        
        if (targetCellParentRow.every( item => item.mark === targetCell.mark)) {
            announceWinner(targetCell);
            return;
        }
        
        if (sameColumnCells.every(item => item.mark === targetCell.mark)) {
            announceWinner(targetCell);
            return;
        };
        
        if (targetCell.cellNum === 1 ||
            targetCell.cellNum === 5 ||
            targetCell.cellNum === 9) {
                let oneFiveNine = gameboard.getBoard().flat().filter(item => [1, 5, 9].includes(item.cellNum));
                if (oneFiveNine.every(item => item.mark === targetCell.mark)) {
                    announceWinner(targetCell);
                    return;
                }
        }
            
        if (targetCell.cellNum === 3 ||
            targetCell.cellNum === 5 ||
            targetCell.cellNum === 7) {
                let threeFiveSeven = gameboard.getBoard().flat().filter(item => [3, 5, 7].includes(item.cellNum));
                if (threeFiveSeven.every(item => item.mark === targetCell.mark)) {
                    announceWinner(targetCell);
                    return;
                }
        }
    }
            
    function announceWinner(cell) {
        winnerDeclared = true;
        getActivePlayer().win++;
        console.log('Game Over');
        console.log(`${cell.name} (${cell.mark}) is the winner!`);
    };
    
    function checkDraw() {
        if (winnerDeclared) return;

        let allCells = gameboard.getBoard().flat();
        if (allCells.every(cell => cell.mark)) {
            console.log(`It is a Draw`);
            drawsDeclared = true;
            ++draws;
        };
    };
    
    function playRound(pos) {
        if (drawsDeclared) return;
        if (gameboard.checkInvalidMove(pos)) return;
        
        gameboard.addMark(pos, getActivePlayer());
        checkWinner(pos);
        checkDraw();
        switchActivePlayer();
    }
    
    const getDraws = () => draws;
    const resetDraws = () => draws = 0;
    const getWinnerDeclared = () => winnerDeclared;
    const resetWinnerDeclared = () => winnerDeclared = false;
    const resetDrawsDeclared = () => drawsDeclared = false;
    const resetWins = () => {
        players[0].win = 0;
        players[1].win = 0;
    }

    return {
        playRound,
        getActivePlayer,
        switchActivePlayer,
        getPlayer,
        setPlayerOneName,
        setPlayerTwoName,
        getDraws,
        getWinnerDeclared,
        resetWinnerDeclared,
        resetActivePlayer,
        resetDrawsDeclared,
        resetDraws,
        resetWins,
    }
})();

(function screenController() {

    const soloMultiplayer = document.querySelector('.solo-multiplayer');
    const main = document.querySelector('main');
    const settingsDialog = document.querySelector('.settings-dialog');
    const playerOneName = document.querySelector('.player-one-wrapper > div:first-child');
    const playerOneScore = document.querySelector('.player-one-score');
    const drawsScore = document.querySelector('.draws-score');
    const playerTwoName = document.querySelector('.player-two-wrapper > div:first-child');
    const playerTwo = document.querySelector('.player-two-wrapper.player-one-two-wrapper');
    const playerTwoScore = document.querySelector('.player-two-score');
    const boardWrapper = document.querySelector('.board-wrapper');
    const playerOneInput = document.querySelector('.player-one-name');
    const playerTwoInput = document.querySelector('.player-two-name');
    const exSelect = document.querySelector('.ex-select');
    const ohSelect = document.querySelector('.oh-select');
    const markSelect = document.querySelector('.mark-select');
    
    const saveButton = document.querySelector("button[type='button']")
    const soloButton = document.querySelector('.solo-button');
    const multiplayerButton = document.querySelector('.multiplayer-button');
    const homeButton = document.querySelector('.home');
    const settingsButton = document.querySelector('.settings');
    const newRoundButton = document.querySelector('.new-round-button');

    soloButton.addEventListener('click', playSoloHandler);
    multiplayerButton.addEventListener('click', playMultiplayerButton);
    homeButton.addEventListener('click', homeButtonHandler);
    settingsButton.addEventListener('click', settingsButtonHandler);
    saveButton.addEventListener('click', saveButtonHandler);
    newRoundButton.addEventListener('click', newRoundHandler);
    boardWrapper.addEventListener('click', boardHandler);

    function playSoloHandler(event) {
        soloMultiplayer.style.display = 'none';
        main.style.display = 'block';
        playerTwo.style.display = 'none';
        gameController.setPlayerOneName(1, "Computer");
        playerTwoName.textContent = gameController.getPlayer(1).name;
    }
    
    function playMultiplayerButton(event) {
        soloMultiplayer.style.display = 'none';
        main.style.display = 'block';
        markSelect.style.display = 'none';
    }
    
    function homeButtonHandler(event) {
        main.style.display = 'none';
        soloMultiplayer.style.display = 'block';
        gameboard.clearBoard();
        gameController.resetDraws();
        gameController.resetWinnerDeclared();
        gameController.resetWins();
        
        updateScores();
        updateScreen();

        playerTwo.style.display = 'flex';
        markSelect.style.display = 'flex';

        gameController.setPlayerOneName(0);
        playerOneName.textContent = gameController.getPlayer(0).name;

        gameController.setPlayerTwoName(1);
        playerTwoName.textContent = gameController.getPlayer(1).name;
    }

    function settingsButtonHandler() {
        settingsDialog.showModal();
    }

    function saveButtonHandler() {
        settingsDialog.close();
        
        if (playerOneInput.value === '') return;
        gameController.setPlayerOneName(0, playerOneInput.value);
        playerOneName.textContent = gameController.getPlayer(0).name;
        playerOneInput.value = '';

        if (playerTwoInput.value === '') return;
        gameController.setPlayerTwoName(1, playerTwoInput.value);
        playerTwoName.textContent = gameController.getPlayer(1).name;
        playerTwoInput.value = '';
    }
    
    function boardHandler(event) {
        let button = event.target.closest('button');
        
        if (!button || !button.dataset.cellNum) return;
        if (gameController.getWinnerDeclared()) return;

        gameController.playRound(Number(button.dataset.cellNum));
        updateScreen();
        updateScores();

        if (gameController.getActivePlayer().name === "Computer" && !gameController.getWinnerDeclared()) {
            setTimeout(() => {
                const emptyCells = gameboard.getBoard().flat().filter(cell => !cell.mark);
                if (emptyCells.length === 0) return;

                const randomIndex = Math.floor(Math.random() * emptyCells.length);
                randomCell = emptyCells[randomIndex];

                gameController.playRound(randomCell.cellNum);
                updateScreen();
                updateScores();
            }, 300)
        }
    }
    
    function updateScreen() {
        boardWrapper.textContent = '';
        let nums = 0;
        
        gameboard.getBoard().forEach(row => {
            row.forEach((cell, index) => {
                const btn = document.createElement('button');
                btn.classList.add('board-item');
                btn.dataset.col = index;
                btn.dataset.cellNum = ++nums;
                
                if (cell.mark === 'x') {
                    btn.classList.add('ex');
                } else if (cell.mark === 'o') {
                    btn.classList.add('oh');
                }

                boardWrapper.appendChild(btn);
            })
        })
    }

    function updateScores() {
        playerOneScore.textContent = gameController.getPlayer(0).win;
        playerTwoScore.textContent = gameController.getPlayer(1).win;
        drawsScore.textContent = gameController.getDraws();
    }
    
    function newRoundHandler() {
        gameboard.clearBoard();
        gameController.resetWinnerDeclared();
        gameController.resetActivePlayer();
        gameController.resetDrawsDeclared();
        updateScreen();
    }

    updateScreen();
})();