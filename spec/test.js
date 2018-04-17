const {Board, Square, TicTacToe, Player} = require('../src/script/TicTacToe.js');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM('<!doctype html><html><body></body></html>');

global.document = dom.window.document;
global.window = dom.window;

Object.keys(window).forEach((key) => {
  if (!(key in global)) {
    global[key] = window[key];
  }
});

describe("Board.IsFull Testing:", function() {

  it("New Empty Board", function() {
	var board = new Board(3);
    expect(board.isFull()).toBe(false);
  });
  
   it("Full of Empty Symbols", function() {
	var board = new Board(3);
	for(var i=0;i<board.squares.length;i++)
	{
		board.squares[i].symbol = "   ";
	}
    expect(board.isFull()).toBe(false);
  });
  
   it("Full Board", function() {
     var board = new Board(3);
	 for(var i=0;i<board.squares.length;i++)
	 {
		board.squares[i].symbol = "O";
	 }
     expect(board.isFull()).toBe(true);
  });
});

describe("TicTacToe Testing:", function() {
  it("Switching Players", function() {
	var ttt = new TicTacToe(new Player("A","X"),new Player("B","X"));
	var testName = ["A","B"];
	var result=true;
	
	ttt.currentPlayer = ttt.players[0];
	
	for(var i=1;i<100;i++)
	{
		ttt._switchPlayer();
		if(i%2==0)
		{
			expect(ttt.currentPlayer.name).toBe("A");
		}
		else
		{
			expect(ttt.currentPlayer.name).toBe("B");
		}
	}
    
  });
});