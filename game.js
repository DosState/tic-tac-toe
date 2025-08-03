const gameBoard = (function() {
    const board = Array(9).fill(null);
    let currentPlayer = 'X';

    function getBoard(){
        return board.slice(0)
    };

    function makeMove(index){
        if (board[index] === null){
            board[index] = currentPlayer;
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            return true;
        }
        return false;
    };

    function getCurrentPlayer(){
        return currentPlayer;
    };

    function reset(){
        board.fill(null);
        currentPlayer = 'X';
    };

    function isFull(){
        return !board.includes(null)
    }
    return {getBoard, makeMove, getCurrentPlayer, reset, isFull};
})();

const gameController = (function(){
    let gameOn = true;
    const patterns = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8],[0,4,8],[2,4,6]]

    function checkWinner(){
        const board = gameBoard.getBoard();
        for (let pattern of patterns){
            const [a,b,c] = pattern;
            if(board[a] && board[a]===board[b] && board[a]===board[c]){
                return {winner: board[a], pattern};
            }
        }
        return gameBoard.isFull() ? {winner:"tie"} : null;
    }

    function handleCellClick(e){
        if(!gameOn || !e.target.classList.contains("cell")) return;

        const index = parseInt(e.target.dataset.index);
        const player = gameBoard.getCurrentPlayer()

        if(gameBoard.makeMove(index)){
            displayController.updateCell(index, player);
            const result = checkWinner();

            if(result){
                gameOn = false;
                if (result.winner === 'tie'){
                    displayController.showTie();
                }
                else{
                    displayController.showWinner(result.winner, result.pattern);
                }
            }
            else{
                displayController.showCurrentPlayer(gameBoard.getCurrentPlayer());
            }
        }
    }
    return {
        startGame() {
            gameBoard.reset();
            displayController.reset();
            displayController.initializeDisplay();
            gameOn = true;

            document.getElementById("gameboard").addEventListener("click", handleCellClick);
            displayController.showCurrentPlayer(gameBoard.getCurrentPlayer());
        },

        newGame() {
            gameOn = true;
            gameBoard.reset();
            displayController.reset();
            displayController.showCurrentPlayer(gameBoard.getCurrentPlayer());
        }
    };
})();

const displayController = (function(){
    const gameContainer = document.getElementById("gameboard");
    const statusDisplay = document.getElementById("status");
    const scoreX = document.getElementById("score-x");
    const scoreO = document.getElementsById("score-o");
    const scoreTies = document.getElementById("score-ties");

    let scores = {X:0, O:0, ties:0};

    function createCell(){
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = index;
        return cell;
    }

    function updateStatus(message){
        statusDisplay.textContent = message;
    }

    function animateWinningCells(pattern){
        pattern.forEach(index => {
                const cell = gameContainer.children[index];
                cell.classList.add("winning-cell");
        });
    }

    return{
        initializeDisplay() {
            gameContainer.innerHTML = "";
            for (let i=0; i<9; i++){
                gameContainer.appendChild(createCell(i));
            }
        },
        updateCell(index, player){
            const cell = gameContainer.children[index];
            cell.textContent = player;
            cell.classList.add(`player-${player.toLowerCase()}`);
        },
        updateScores(){
            scoreX.textContent = scores.X;
            scoreO.textContent = scores.O;
            scoreTies.textContent = scores.ties;
        },
        showWinner(winner, winningPattern){
            updateStatus(`player ${winner} wins!`);
            statusDisplay.classList.add("winner-animation");
            animateWinningCells(winningPattern);
            scores[winner]++;
            this.updateScores();
            setTimeout(() => {statusDisplay.classList.remove("winner-animation");}, 800);
        },
        showTie(){
            updateStatus("It's a tie!");
            scores.ties++;
            this.updateScores;
        },
        showCurrentPlayer(player){
            updateStatus(`Player ${player}'s turn`);
        },
        reset(){
            Array.from(gameContainer.children).forEach(cell=>{
                cell.textContent = "";
                cell.className = "cell";
            });
            updateStatus("Player X\'s turn");
            statusDisplay.classList.remove("winner-animation");
        },
        resetScores(){
            scores = {X:0, O:0, ties:0};
            this.updateScores();
        }
    }
})();

document.addEventListener("DOMContentLoaded", ()=>{
    gameController.startGame();
    document.getElementById("new-game").addEventListener("click", ()=>{gameController.newGame();});
    document.getElementById("reset-scores").addEventListener("click", ()=>{displayController.resetScores();});
})