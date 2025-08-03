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