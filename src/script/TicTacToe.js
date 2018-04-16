/**
 * @file TicTacToe classes
 * @author Jin Lee
 * @version 1.0
 */

/**
 * Tic Tac Toe class
 */
function TicTacToe(playerOne, playerTwo) {
	this.N = 3;
	this.board = new Board(this.N);
	this.players = [playerOne, playerTwo];
	this.currentPlayer = null;
	this.statusBar = new StatusBar();
	this.resetButton = new ResetButton();
	this._initialize();
};
TicTacToe.prototype = {
	constructor: TicTacToe,
	/**
	 * Initializer
	 */
	_initialize: function(){
		var ticTacToeDiv = document.createElement("div");

		this.statusBar.render(ticTacToeDiv);
		this.board.render(ticTacToeDiv);
		this.resetButton.render(ticTacToeDiv, this);
		document.body.appendChild(ticTacToeDiv);
	},
	/**
	 * Start the game
	 */	
	startGame: function() {
		this.board.resetBoard();
		this.currentPlayer = this.players[0];
		this._setNextPlayerMessage();
		this.resetButton.show();
		this.overrideOnBoardClick();
	},
	/**
	 * Switch the players
	 */		
	_switchPlayer: function() {
		this.currentPlayer = (this.currentPlayer === this.players[0] ? this.players[1] : this.players[0]);
		this._setNextPlayerMessage();
	},

	/**
	 * Set the message in the status bar about the next player
	 */		
	_setNextPlayerMessage: function() {
		var nextPlayer = (this.currentPlayer === this.players[0] ? this.players[1] : this.players[0]);
		var message = nextPlayer.name + "'s turn";
		this.statusBar.updateMessage(message);
	},

	/**
	 * Override the OnBoardClick function in the board object
	 */			
	overrideOnBoardClick: function() {
		var ticTacToe = this;
		this.board.onBoardClick = function(clickedSquare) {
			if(!clickedSquare.isOccupied()){
				ticTacToe._switchPlayer();
				clickedSquare.setSymbol(ticTacToe.currentPlayer.symbol);
				ticTacToe._evaluate();
			}
		}
	},
	
	/**
	 * Evaluate the current status of the game
	 */
	_evaluate: function() {
		if(this.board.isFull())	{
			this._gameOver();
		}
	},
	
	/**
	 * End the game
	 */
	_gameOver: function() {
		this.statusBar.updateMessage("Game Over");
	},
}

 /**
  * Square class
  */
function Square() {
	this.symbol = "";
}

Square.prototype = {
	constructor: Square,

	/**
     * Render the square
     *
     * @param {element} parentElement - parentElement to contain the square
     * @param {Number} width - width of the sqaure element
     * @param {Number} height - height of the sqaure element
     */
	render: function(parentElement, width, height) {
		var square = document.createElement("div");
		square.className = "square";
		this.el = square;
		this.el.id = getUniqueID();
		this.el.style.width = width;
		this.el.style.height = height;
		this.el.style.lineHeight = this.el.style.height;
		this.el.style.fontSize = Math.min(width,height);
		parentElement.appendChild(this.el);
	},
	
	/**
     * Set the symbol
     *
     * @param {String} symbol - symbol
     */
	setSymbol: function(symbol) {
		this.symbol=symbol
		this.el.innerText = symbol;
	},
	
	/**
     * Reset the square
     */
	resetSquare: function() {
		this.setSymbol("");
	},
	
	/**
     * Get the square ID
	 *
	 * @returns {Number} ID of the square
     */
	getID: function() { return this.el.id;},
	
	/**
     * Determine whether or not the square is occupied
	 *
	 * @returns {Boolean} True if the square is occupied
     */
	isOccupied: function() { return /\S/.test(this.symbol);}
}

/**
 * Board class
 *
 */
function Board(N) {
	this.N = N
	this.squares = [];
	this._initialize();
}

Board.prototype = {
	constructor: Board,
	
	/**
	 * initializer
	 */
	_initialize: function() {
		for(var i=0;i<(this.N * this.N);i++)
		{
			this.squares.push(new Square());
		}
	},
	
    /**
     * Render the board
	 *
	 * @param {element} parentElement - parentElement to contain the board
     */
	render: function(parentElement)	{
		var board = document.createElement("div");
		var size= Math.min(getBrowerHeight(),getBrowserWidth());
		var size=size/2;
		var squareWidth=size/this.N;
		var squareHeight=size/this.N;
		
		board.className = "board";
		
		for(var i=0;i<this.squares.length;i++)
		{
			this.squares[i].render(board, squareWidth, squareHeight);
		}
		
		parentElement.appendChild(board);
		board.style.height = size;
		board.style.width = size;
		this.el = board;
		this._addClickEvent();
	},
	
    /**
     * Return the square object
	 *
	 * @param {Number} squareID - squareID
	 * @returns {Object} Square object
     */
	getSquare: function(squareID) {
		for(var i=0; i<this.squares.length;i++)	{
			if(this.squares[i].getID() === squareID)
			{
				return this.squares[i];
			}
		}
		
		return null;
	},
	
    /**
     * Add click event to the board
	 *
	 * @param {Object} e - event object
	 */
	_addClickEvent: function(e) {
		var currentBoard = this;
		this.el.addEventListener("click", function(e)
		{
			if(!e || !e.target) return;
		
			var squareID = e.target.id;
			var clickedSquare = currentBoard.getSquare(squareID);
		
			if(clickedSquare) {
				e.stopPropagation();
				currentBoard.onBoardClick.call(currentBoard, clickedSquare);
			}
		})
	},
	
    /**
     * Reset the board
	 *
	 */
	resetBoard: function() {
		for(var i=0; i<this.squares.length;i++)
		{
			this.squares[i].resetSquare();
		}
	},
	
    /**
     * Determine whether or not the board is full
	 *
	 * @returns {Boolean} True if the board is full
     */
	isFull: function() {
		for(var i=0;i<this.squares.length;i++)
		{
			if(!this.squares[i].isOccupied())
			{
				return false;
			}
		}
		return true;
	},
	
    /**
     * Placeholder for onBoardClick event. Implement the function in inherited objects
     *
	 */
	onBoardClick: function(clickedSquare) {
	},
}

/**
 * Player class
 *
 */
 function Player(name, symbol) {
	this.name = name || "Player"+symbol;
	this.symbol = symbol;
};

/**
 * StatusBar class to display the current status of the game
 *
 */
function StatusBar() {
	this.el = document.createElement("div");
	this._initialize();
};

StatusBar.prototype = {
	/**
	 * initializer
	 */
	_initialize: function() {
		this.el.className = "statusBar";
	},
	/**
     * Update the message in the status bar
	 *
	 * @param {String} text - message
     */
	updateMessage: function(text){ this.el.innerText = text; },
    /**
     * Render the status bar
	 *
	 * @param {element} parentElement - parentElement to contain the board
     */
	render: function(parentElement){ parentElement.appendChild(this.el);}
}

/**
 * ResetButton class
 *
 */
function ResetButton() {
	this.el = document.createElement("div");
	this._initialize();
}
ResetButton.prototype = {

	/**
	 * initializer
	 */
	_initialize: function() {
		var button = document.createElement("button");
		button.appendChild(document.createTextNode("Reset"));
		
		this.el.appendChild(button);
		this.el.className = "resetButton";
	},
	
    /**
     * Render the reset button
	 *
	 * @param {element} parentElement - parentElement to contain the board
     */
	render: function(parentElement, ticTacToe) { 
		parentElement.appendChild(this.el);
		this.el.querySelector("button").addEventListener("click", function(){ticTacToe.startGame();});
	},
	/**
	 * Hide the button
	 */
	hide: function() { this.el.style.visibility = "hidden";},
	/**
	 * Show the button
	 */
	show: function() { this.el.style.visibility = "visible";}
}

var id = 0;
var getUniqueID = function() {return id++;}

 /**
  *  Get the width of the broswer
  */
function getBrowserWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

 /**
  *  Get the height of the broswer
  */
function getBrowerHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}

if ( typeof module !== 'undefined' && module.hasOwnProperty('exports') )
{
    module.exports.Board = Board;
	module.exports.Square = Square;
	module.exports.TicTacToe = TicTacToe;
	module.exports.Player = Player;
}