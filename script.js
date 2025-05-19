class Gameboard{
    constructor() {
        this.board = Array(9).fill("");
    }

    getBoard(){
        return this.board;
    }

    setMark(index, mark){
        if (this.board[index] ===""){
            this.board[index] = mark;
            return true;
        }
        return false;
    }

    resetBoard(){
        this.board = Array(9).fill("");
    }

    render(){
        const boardContainer = document.querySelector(".board");
        boardContainer.innerHTML = "";
        this.board.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add("cell");
            cellElement.textContent = cell;
            cellElement.dataset.index = index;
            boardContainer.appendChild(cellElement);
        });
        this.addCellListeners(); 
    }

    addCellListeners() {
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => {
            cell.addEventListener("click", gameController.handleCellClick);
        });
    };
}

const gameboard = new Gameboard();

class Player {
    constructor(name, marker) {
        this.name = name;
        this.marker = marker;
    }
}

class GameController {
    constructor(gameboard){
        this.gameboard = gameboard;
        this.player1 = new Player("Player 1", "X");
        this.player2 = new Player("Player 2", "O");
        this.currentPlayer = this.player1;
        this.gameOver = false;
        this.gameActive = false;

        this.handleCellClick = this.handleCellClick.bind(this);

    }

    startGame() {
        const name1 = document.getElementById("player1-name").value;
        const name2 = document.getElementById("player2-name").value;
        
        this.player1 = new Player(name1, "X");
        this.player2 = new Player(name2, "O");

        this.currentPlayer = this.player1;
        this.gameOver = false;


        if(name1 ==="" || name2 ===""){
            this.displayMessage(`please insert the players name`)
            return;
        } else{
            this.displayMessage(`${this.currentPlayer.name}'s turn`);
            this.gameActive = true;
        }

        this.gameboard.resetBoard();
        this.gameboard.render();
    };

    switchPlayer(){
    this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
    };

    checkWinner(){
    const board = this.gameboard.getBoard();
    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combo of winCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return true;
        }
    }

    return false;
    };

    isTie() {
       return this.gameboard.getBoard().every(cell => cell !== "");
    }


    handleCellClick(e){

        const index = parseInt(e.target.dataset.index);

        if (!this.gameActive || this.gameOver || e.target.textContent !== "") return;


        if (this.gameboard.setMark(index, this.currentPlayer.marker)) {
            this.gameboard.render();

            if (this.checkWinner()) {
                this.displayMessage(`${this.currentPlayer.name} wins!`);
                document.getElementById("start").style.display = "none";
                this.gameOver = true;
                this.gameActive = false;
                return;

            } else if (this.isTie()) {
                this.displayMessage("It's a tie!");
                this.gameOver = true;
                this.gameActive = false;
                return;

            }
            
            this.switchPlayer();
            this.displayMessage(`${this.currentPlayer.name}'s turn`);
        }
    };

  displayMessage(msg){
    document.querySelector(".message").textContent = msg;
  };

  resetGame() {
    this.gameboard.resetBoard();
    this.currentPlayer = this.player1;
    this.gameOver = false;
    this.gameActive = false;
    document.getElementById("start").style.display = "block";
    this.displayMessage(``);
    this.gameboard.render();
  };

};
const gameController = new GameController(gameboard);


document.addEventListener("DOMContentLoaded", () => {
  gameboard.render();

  document.getElementById("reset").addEventListener("click", () => {
    gameController.resetGame();
  });

  document.getElementById("start").addEventListener('click', () =>{
    gameController.startGame();
  })
});
