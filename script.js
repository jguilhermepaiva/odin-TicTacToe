const Gameboard = (() => {
    let board = [
        "", "", "",
        "", "", "",
        "", "", "",
    ];

    const getBoard = () => board;

    const setMark = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    const render = () => {
        const boardContainer = document.querySelector(".board");
        boardContainer.innerHTML = "";
        board.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add("cell");
            cellElement.textContent = cell;
            cellElement.dataset.index = index;
            boardContainer.appendChild(cellElement);
        });
        addCellListeners(); 
    };

    const addCellListeners = () => {
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => {
            cell.addEventListener("click", GameController.handleCellClick);
        });
    };

    return { getBoard, setMark, resetBoard, render };
})();

const Player = (name, marker) => {
    return {name, marker};
};

const GameController = (() =>{
    let player1 = Player("Player 1", "X");
    let player2 = Player("Player 2", "O");
    let currentPlayer = player1;
    let gameOver = false;
    let gameActive = false;

    const startGame = () => {
        const name1 = document.getElementById("player1-name").value;
        const name2 = document.getElementById("player2-name").value;
        
        player1 = Player(name1, "X");
        player2 = Player(name2, "O");

        currentPlayer = player1;
        gameOver = false;

        if(name1 ==="" || name2 ===""){
            displayMessage(`please insert the players name`)
            return;
        } else{
            displayMessage(`${currentPlayer.name}'s turn`);
            gameActive = true;
        }

        Gameboard.resetBoard();
        Gameboard.render();
    };

    const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkWinner = () => {
    const board = Gameboard.getBoard();
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

    const isTie = () => Gameboard.getBoard().every(cell => cell !== "");



    const handleCellClick = (e) => {

        const index = e.target.dataset.index;

        if (!gameActive || gameOver || e.target.textContent !== "") return;


        if (Gameboard.setMark(index, currentPlayer.marker)) {
            Gameboard.render();

            if (checkWinner()) {
                displayMessage(`${currentPlayer.name} wins!`);
                document.getElementById("start").style.display = "none";
                gameOver = true;
                gameActive = false;
                return;

            } else if (Gameboard.getBoard().every(cell => cell !== "")) {
                displayMessage("It's a tie!");
                gameOver = true;
                gameActive = false;
                return;

            }
            
            switchPlayer();
            displayMessage(`${currentPlayer.name}'s turn`);
        }
    };

     const displayMessage = (msg) => {
    document.querySelector(".message").textContent = msg;
  };

  const resetGame = () => {
    Gameboard.resetBoard();
    currentPlayer = player1;
    gameOver = false;
    gameActive = false;
    document.getElementById("start").style.display = "block";
    displayMessage(``);
    Gameboard.render();
  };

    return { startGame, resetGame, handleCellClick};
}) ();


document.addEventListener("DOMContentLoaded", () => {
  Gameboard.render();

  document.getElementById("reset").addEventListener("click", () => {
    GameController.resetGame();
  });

  document.getElementById("start").addEventListener('click', () =>{
    GameController.startGame();
  })
});
