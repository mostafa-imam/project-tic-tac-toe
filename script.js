const GameBoard = (function () {
    const rows = 3;
    const columns = 3;
    let board = [];
    let winnerDeclared = false;
    let draws = 0;
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
                    cell.win  = player.win;
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
    
    function checkInvalidInput(pos) {
        if (typeof pos !== 'number' || pos < 1 || pos > 9) {
            console.log('Invalid Input');
            return true;
        }
        return false;
    }
    
    function checkWinner(pos) {
        let targetCell = board.flat().find(cell => cell.cellNum === pos);
        let sameColumnCells = board.flat().filter(cell => cell.col === targetCell.col);
        let targetCellParentRow = board.find( row => row.includes(targetCell) );
        
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
                let oneFiveNine = board.flat().filter(item => [1, 5, 9].includes(item.cellNum));
                if (oneFiveNine.every(item => item.mark === targetCell.mark)) {
                    announceWinner(targetCell);
                    return;
                }
            }
            
        if (targetCell.cellNum === 3 ||
            targetCell.cellNum === 5 ||
            targetCell.cellNum === 7) {
                let threeFiveSeven = board.flat().filter(item => [3, 5, 7].includes(item.cellNum));
                if (threeFiveSeven.every(item => item.mark === targetCell.mark)) {
                    announceWinner(targetCell);
                    return;
                }
            }
        
        return;
    }
            
    function announceWinner(cell) {
        winnerDeclared = true;
        gameFlow.getActivePlayer().win++;
        console.log('Game Over');
        console.log(`${cell.name} (${cell.mark}) is the winner!`);
    };
    
    function checkDraw() {
        if (winnerDeclared) return;

        let allCells = board.flat();
        if (allCells.every(cell => cell.mark)) {
            console.log(`It is a Draw`);
            ++draws;
        };
    };
    
    function clearBoard() {
        for (let row of board) {
            for (let cell of row) {
                cell.mark = '';
                delete cell.name;
            }
        }
        winnerDeclared = false;
        console.log("Board cleared. Ready for a new game!");
    };
    
    // const getBoard = () => board;
    const getBoard = () => {
        console.log(`
            ${board[0][0].mark || '_'} | ${board[0][1].mark || '_'} | ${board[0][2].mark || '_'}
            ${board[1][0].mark || '_'} | ${board[1][1].mark || '_'} | ${board[1][2].mark || '_'}
            ${board[2][0].mark || '_'} | ${board[2][1].mark || '_'} | ${board[2][2].mark || '_'}
        `)
    }
    
    const getDraws = () => draws;

    return {getBoard,
            addMark,
            checkWinner,
            checkDraw,
            checkInvalidMove,
            checkInvalidInput,
            clearBoard,
            getDraws,
        };
})();


const gameFlow = (function (
    playerOneName = 'Player One',
    playerTwoName = 'Player Two',
) {

    const players = [
        {
            name: playerOneName,
            mark: 'x',
            win: 0,
        },
        {
            name: playerTwoName,
            mark: 'o',
            win: 0,
        }
    ]

    let activePlayer = players[0];

    function switchActivePlayer() {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        GameBoard.getBoard();
        console.log(`${getActivePlayer().name}'s turn`);
        console.log(`hint: use gameFlow.playRound(square#) to play ... a round`)
    }

    function playRound(pos) {

        if ( GameBoard.checkInvalidInput(pos) || GameBoard.checkInvalidMove(pos)) {
            printNewRound();
            return;
        }
        
        console.log(`Dropping ${getActivePlayer().mark} into square ${pos}`);
        
        GameBoard.addMark(pos, getActivePlayer());
        GameBoard.checkWinner(pos);
        GameBoard.checkDraw();

        switchActivePlayer();
        printNewRound();
    }
    
    function newGame() {
        GameBoard.clearBoard();
        activePlayer = players[0];
        printNewRound();
    }

    printNewRound();

    return {
        playRound,
        newGame,
        getActivePlayer,
    }
})();