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

    function makeControlledMove(index){
        gameBoard.makeMove(index);
        const result = checkWinner()
        if(result){
            gameOn = false;
            if (result.winner === 'tie'){
                console.log("tie")
            }
            else{
                console.log(result.winner, result.pattern)
            }
        }
        else{
            console.log(gameBoard.getCurrentPlayer)
        }
    }
    return {checkWinner, makeControlledMove};
})();