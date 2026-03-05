const board = document.getElementById('board')
const squares = document.getElementsByClassName('square')
const players = ['X', 'O']
let currentPlayer = players[0]
const statusMessage = document.createElement('h2')
statusMessage.textContent = `X's turn!`
board.after(statusMessage)
var someoneHasWon = false;
const winning_combinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
for(let i = 0; i < squares.length; i++){
    squares[i].addEventListener('click', () => {
        if (someoneHasWon == true) {
            return
        }
        if(squares[i].textContent !== ''){
            return}
        squares[i].textContent = currentPlayer
        if(checkWin(currentPlayer)) {
            statusMessage.textContent=`Game over! ${currentPlayer} wins!`
            someoneHasWon = true;
            return}
        if(checkTie()) {
            statusMessage.textContent= `Game is tied!`
            return
        }
        currentPlayer = (currentPlayer === players[0]) ? players[1] : players[0] 
        if(currentPlayer == players[0]) {
            statusMessage.textContent= `X's turn!`
        } else {
            statusMessage.textContent= `O's turn!`
        }     
    })   
}
function checkWin(currentPlayer) {
    for(let i = 0; i < winning_combinations.length; i++){
        const [a, b, c] = winning_combinations[i]
        if(squares[a].textContent == currentPlayer && squares[b].textContent === currentPlayer && squares[c].textContent === currentPlayer){
            return true
        }
    }
    return false
}

function checkTie(){
    for(let i = 0; i < squares.length; i++) {
        if(squares[i].textContent === '') {
            return false;
        }
    }
    return true
}

function restartButton() {
    someoneHasWon = false;
    for(let i = 0; i < squares.length; i++) {
        squares[i].textContent = ""
    }
    statusMessage.textContent=`X's turn!`
    currentPlayer = players[0]
}




