const playerSettings = (function(){
    let players = {
        X: {name: "Player X", symbol: "X"},
        O: {name: "player O", symbol: "O"}
    };

    return{
        getPlayer: (playerKey)=>({...players[playerKey]}),
        updatePlayer: (playerKey, name, symbol)=>{
            if(symbol && symbol.trim()){
                players[playerKey].symbol = symbol.trim().charAt(0);
            }
            if(name && name.trim()){
                players[playerKey].name = name.trim();
            }
            else{
                players[playerKey].name = `Player ${players[playerKey].symbol}`;
            }
        },
        getAllPlayers: ()=>({...players})
    }
})();

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
        const currentPlayerKey = gameBoard.getCurrentPlayer()

        if(gameBoard.makeMove(index)){
            displayController.updateCell(index, currentPlayerKey);
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
    const scoreO = document.getElementById("score-o");
    const scoreTies = document.getElementById("score-ties");
    const scoreLabelX = document.getElementById("score-label-x");
    const scoreLabelO = document.getElementById("score-label-o");
    const scoreSymbolX = document.getElementById("score-symbol-x");
    const scoreSymbolO = document.getElementById("score-symbol-o");

    let scores = {X:0, O:0, ties:0};

    function createCell(index){
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
        updateCell(index, playerKey){
            const player = playerSettings.getPlayer(playerKey);
            const cell = gameContainer.children[index];
            cell.textContent = player.symbol;
            cell.classList.add(`player-${playerKey.toLowerCase()}`);
        },
        updateScores(){
            scoreX.textContent = scores.X;
            scoreO.textContent = scores.O;
            scoreTies.textContent = scores.ties;
        },
        showWinner(winnerKey, winningPattern){
            const winner = playerSettings.getPlayer(winnerKey);
            updateStatus(`player ${winner.name} wins!`);
            statusDisplay.classList.add("winner-animation");
            animateWinningCells(winningPattern);
            scores[winnerKey]++;
            this.updateScores();
            setTimeout(() => {statusDisplay.classList.remove("winner-animation");}, 800);
        },
        showTie(){
            updateStatus("It's a tie!");
            scores.ties++;
            this.updateScores;
        },
        showCurrentPlayer(playerKey){
            const player = playerSettings.getPlayer(playerKey);
            updateStatus(`Player ${player.name}'s turn`);

            document.querySelectorAll(".player-config").forEach(config=>{
                config.classList.remove("active");
            })
            document.getElementById(`player-${playerKey.toLowerCase()}-config`).classList.add("active");
        },
        reset(){
            Array.from(gameContainer.children).forEach(cell=>{
                cell.textContent = "";
                cell.className = "cell";
            });
            const playerX = playerSettings.getPlayer("X")
            updateStatus(`${playerX.name}'s turn`);
            statusDisplay.classList.remove("winner-animation");

            document.querySelectorAll('.player-config').forEach(config => {
                config.classList.remove('active');
            });
            document.getElementById('player-x-config').classList.add('active');
        },
        updatePlayerLabels() {
            const playerX = playerSettings.getPlayer('X');
            const playerO = playerSettings.getPlayer('O');
            
            scoreLabelX.textContent = playerX.name;
            scoreLabelO.textContent = playerO.name;
            scoreSymbolX.textContent = playerX.symbol;
            scoreSymbolO.textContent = playerO.symbol;
        },        
        resetScores(){
            scores = {X:0, O:0, ties:0};
            this.updateScores();
        }
    }
})();

const settingsController = (function(){
    const playerXName = document.getElementById("player-x-name");
    const playerXSymbol = document.getElementById("player-x-symbol");
    const playerXSymbolDisplay = document.getElementById("player-x-symbol-display");
    const playerOName = document.getElementById("player-o-name");
    const playerOSymbol = document.getElementById("player-o-symbol");
    const playerOSymbolDisplay = document.getElementById("player-o-symbol-display");
    const applyButton = document.getElementById("apply-settings");

    function updateSymbolDisplay(input, display){
        const symbol = input.value.trim() || input.placeholder;
        display.textContent = symbol.charAt(0);
    }

    function validateSymbol(input, otherInput){
        let value = input.value.trim();
        if(!value){
            value = input.placeholder;
        }
        if(value === otherInput.value.trim() || value === otherInput.placeholder){
            input.style.borderColor = "#e74c3c";
            return false;
        }else{
            input.style.borderColor = "#e0e0e0";
            return true;
        }
    }

    return {
        initialize(){
            playerXSymbol.addEventListener("input", ()=>{
                updateSymbolDisplay(playerXSymbol, playerXSymbolDisplay);
                validateSymbol(playerXSymbol, playerOSymbol);
            });
            playerOSymbol.addEventListener("input", ()=>{
                updateSymbolDisplay(playerOSymbol, playerOSymbolDisplay);
                validateSymbol(playerOSymbol, playerXSymbol);
            });
            applyButton.addEventListener("click", ()=>{
                const xSymbolValid = validateSymbol(playerXSymbol, playerOSymbol);
                const oSymbolValid = validateSymbol(playerOSymbol, playerXSymbol);

                if(xSymbolValid && oSymbolValid){
                    playerSettings.updatePlayer("X",
                        playerXName.value,
                        playerXSymbol.value || playerXSymbol.placeholder
                    );
                    playerSettings.updatePlayer("O",
                        playerOName.value,
                        playerOSymbol.value || playerOSymbol.placeholder
                    );
                    displayController.updatePlayerLabels();
                    gameController.newGame();

                    applyButton.textContent = "Applied! ✓";
                    applyButton.style.background = "linear-gradient(135deg, #27ae60, #2ecc71)";
                    setTimeout(()=>{
                        applyButton.textContent = "Apply Settings";
                        applyButton.style.background = "linear-gradient(135deg, #667eea, #764ba2)"
                    },1500);
                }
            });

            [playerXName, playerXSymbol, playerOName, playerOSymbol].forEach(input=>{
                input.addEventListener("keypress", (e)=>{
                    if(e.key === "Enter"){
                        applyButton.click();
                    }
                });
            });
        }
    };
})();

document.addEventListener("DOMContentLoaded", ()=>{
    settingsController.initialize();
    displayController.updatePlayerLabels();
    gameController.startGame();
    document.getElementById("new-game").addEventListener("click", ()=>{gameController.newGame();});
    document.getElementById("reset-scores").addEventListener("click", ()=>{displayController.resetScores();});
});