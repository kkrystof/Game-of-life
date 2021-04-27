let UI = {
	init : function() {
		this.setupCanvas();
	},
	setupCanvas: function() {
		UI.canvas = document.getElementById('gridGameOfLife');
		this.ctx = this.canvas.getContext('2d');
	},
	grid : {
		n: 30, // number of cells for each dimension
		d: 0, // number of pxs for each dimension
		liveCells: [],
		size: 0,
		gap: 0,
		shift: 0,
		r: 15 // ratio = r*gap
	},
	renderLiveCells : function() {

		// clear the canvas 
		this.ctx.fillStyle = 'white';
		this.ctx.fillRect(0, 0, this.grid.d, this.grid.d);

		this.ctx.fillStyle = 'black';

		for(let cell of this.grid.liveCells)
			this.ctx.fillRect(
				cell[0]*(this.grid.size+this.grid.gap+this.grid.shift),
				cell[1]*(this.grid.size+this.grid.gap+this.grid.shift),
				this.grid.size, this.grid.size);
	},
	resizeGrid : function() {

		this.grid.d = Math.min(window.innerHeight,window.innerWidth);

		this.canvas.height = this.grid.d;
		this.canvas.width  = this.grid.d;

		this.calcForResize();
		this.renderLiveCells();	

	},
	calcForResize : function() {

		this.grid.size = this.grid.r * this.grid.d/(this.grid.n*(this.grid.r+1));
		this.grid.gap = this.grid.size/this.grid.r;

		this.grid.shift =
			(this.grid.gap + (this.grid.d/(this.grid.gap+this.grid.size))%1*(this.grid.gap+this.grid.size))/this.grid.n;

		// the first (0) rect doesn't add the shift .. 0*( .. and therefore
		this.grid.shift += this.grid.shift/(this.grid.n-1);
	}
}

window.onload = UI.init();
window.onresize = function() {

	// avoiding resizeGrid() if it's not necessary

	const   windowW = window.innerWidth,
		windowH = window.innerHeight;

	if(windowW<windowH && windowW==UI.canvas.width && windowH>UI.canvas.width
		|| windowW>windowH && windowH==UI.canvas.height && windowW>UI.canvas.height)
		return;

	UI.resizeGrid();
};

let core = {
	newGeneration : function() {

		clearInterval(generation);

		nLiveCellsBefore = UI.grid.liveCells.length;

		for(let cell of UI.grid.liveCells.slice(0,nLiveCellsBefore))
			for(let x = cell[0]-1; x <= cell[0]+1; x++)
				for(let y = cell[1]-1; y <= cell[1]+1; y++)
					if(!this.exists([x,y]) && this.shouldLive([x,y],false))
						UI.grid.liveCells.push(new Array(x,y));

		// this might look confused to not use arrs nextLiveCells[] and nextDeadCells[].
		// It was changed (at least temporary) because of memory.

		// remove next dead cells
		UI.grid.liveCells =
			UI.grid.liveCells.slice(0,nLiveCellsBefore).filter(cell => this.shouldLive(cell,true))
			.concat(UI.grid.liveCells.slice(nLiveCellsBefore,UI.grid.liveCells.length));


		generation = setInterval(testGeneration, 1000);
	},
	exists : function(cell,nextLiveCells) {
		for(let i of UI.grid.liveCells)
			if(i[0]==cell[0] && i[1]==cell[1])
				return true;
		return false;
	},
	shouldLive : function(cell,isCellDefinitelyLive) {

		let nLiveCellsAround = 0;

		for(let comparedCell of UI.grid.liveCells.slice(0,nLiveCellsBefore))

			if
		(
			comparedCell[0] <= cell[0]+1 &&
			comparedCell[0] >= cell[0]-1 &&
			comparedCell[1] <= cell[1]+1 && 
			comparedCell[1] >= cell[1]-1
		)
				nLiveCellsAround++;

		return (isCellDefinitelyLive) ? !this.willDie(nLiveCellsAround-1) : this.comesToLive(nLiveCellsAround);
	},
	comesToLive : function(nLiveCellsAround) {

		switch(nLiveCellsAround) {
			case 3:
				return true;
			default:
				return false;
		}
	},
	willDie : function(nLiveCellsAround) {

		switch(nLiveCellsAround) {
			case 2:
				return false;
			case 3:
				return false;
			default: // 0, 1, 4, 5, 6, 7, 8
				return true;
		}

	}



}


function addSomeCells() {

	//UI.grid.liveCells.push(new Array(0,0));
	//UI.grid.liveCells.push(new Array(0,1));
	//UI.grid.liveCells.push(new Array(1,1));



	UI.grid.liveCells.push(new Array(20,20));
	UI.grid.liveCells.push(new Array(20,21));
	UI.grid.liveCells.push(new Array(19,20));
	UI.grid.liveCells.push(new Array(19,21));

	UI.grid.liveCells.push(new Array(19,22));

	UI.grid.liveCells.push(new Array(15,11));
	UI.grid.liveCells.push(new Array(15,12));

	UI.grid.liveCells.push(new Array(UI.grid.n-1,UI.grid.n-1));
	UI.grid.liveCells.push(new Array(UI.grid.n-1,1));

	UI.grid.liveCells.push(new Array(10,10));
	UI.grid.liveCells.push(new Array(10,11));
	UI.grid.liveCells.push(new Array(10,12));
}




//	executing something	
//
//
//

addSomeCells();
UI.resizeGrid();

function testGeneration() {
	core.newGeneration();
	UI.renderLiveCells();
}
let nLiveCells = 0;

var generation = setInterval(testGeneration, 1000);
