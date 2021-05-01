let UI = {
	init: function () {
		this.setupCanvas();
	},
	setupCanvas: function () {
		this.canvas = document.getElementById('gridGameOfLife');
		this.ctx = this.canvas.getContext('2d');
	},
	grid: {
		n: 30, // number of cells per dimension
		d: 0, // number of pxs per dimension (it has to be a square)
		liveCells: [],
		size: 0,
		gap: 0,
		shift: 0,
		r: 15 // ratio = r*gap
	},
	renderLiveCells: function () {

		// clear the canvas 
		this.ctx.fillStyle = 'white';
		this.ctx.fillRect(0, 0, this.grid.d, this.grid.d);

		this.ctx.fillStyle = 'black';

		for (let cell of this.grid.liveCells)
			this.ctx.fillRect(
				cell[0] * (this.grid.size + this.grid.gap + this.grid.shift),
				cell[1] * (this.grid.size + this.grid.gap + this.grid.shift),
				this.grid.size, this.grid.size);
	},
	resizeGrid: function () {

		this.grid.d = Math.min(window.innerHeight, window.innerWidth);

		this.canvas.height = this.grid.d;
		this.canvas.width = this.grid.d;

		this.calcForResize();
		this.renderLiveCells();

	},
	calcForResize: function () {

		this.grid.size = this.grid.r * this.grid.d / (this.grid.n * (this.grid.r + 1));
		this.grid.gap = this.grid.size / this.grid.r;

		this.grid.shift =
			(this.grid.gap + (this.grid.d / (this.grid.gap + this.grid.size)) % 1 * (this.grid.gap + this.grid.size)) / this.grid.n;

		// the first (0) rect doesn't add the shift .. 0*( .. and therefore
		this.grid.shift += this.grid.shift / (this.grid.n - 1);
	}
}

window.onresize = function () {

	// avoiding resizeGrid() if it's not necessary

	const windowW = window.innerWidth,
		windowH = window.innerHeight;

	if (windowW < windowH && windowW == UI.canvas.width && windowH > UI.canvas.width
		|| windowW > windowH && windowH == UI.canvas.height && windowW > UI.canvas.height)
		return;

	UI.resizeGrid();
};

let core = {
	newGeneration: function () {

		nLiveCellsBefore = UI.grid.liveCells.length;

		for (let cell of UI.grid.liveCells.slice(0, nLiveCellsBefore))
			for (let x = cell[0] - 1; x <= cell[0] + 1; x++)
				for (let y = cell[1] - 1; y <= cell[1] + 1; y++)
					if (!this.exists([x, y]) && this.shouldLive([x, y], false))
						UI.grid.liveCells.push(new Array(x, y));

		// this might look confused to not use arrs nextLiveCells[] and nextDeadCells[].
		// It was changed (at least temporary) because of memory.

		// remove next dead cells
		UI.grid.liveCells =
			UI.grid.liveCells.slice(0, nLiveCellsBefore).filter(cell => this.shouldLive(cell, true))
				.concat(UI.grid.liveCells.slice(nLiveCellsBefore, UI.grid.liveCells.length));
	},
	exists: function (cell, nextLiveCells) {
		for (let i of UI.grid.liveCells)
			if (i[0] == cell[0] && i[1] == cell[1])
				return true;
		return false;
	},
	shouldLive: function (cell, isCellDefinitelyLive) {

		let nLiveCellsAround = 0;

		for (let comparedCell of UI.grid.liveCells.slice(0, nLiveCellsBefore))

			if
				(
				comparedCell[0] <= cell[0] + 1 &&
				comparedCell[0] >= cell[0] - 1 &&
				comparedCell[1] <= cell[1] + 1 &&
				comparedCell[1] >= cell[1] - 1
			)
				nLiveCellsAround++;

		return (isCellDefinitelyLive) ? !this.willDie(nLiveCellsAround - 1) : this.comesToLive(nLiveCellsAround);
	},
	comesToLive: function (nLiveCellsAround) {

		switch (nLiveCellsAround) {
			case 3:
				return true;
			default:
				return false;
		}
	},
	willDie: function (nLiveCellsAround) {

		switch (nLiveCellsAround) {
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



	UI.grid.liveCells.push(new Array(20, 20));
	UI.grid.liveCells.push(new Array(20, 21));
	UI.grid.liveCells.push(new Array(19, 20));
	UI.grid.liveCells.push(new Array(19, 21));

	UI.grid.liveCells.push(new Array(19, 22));

	UI.grid.liveCells.push(new Array(15, 11));
	UI.grid.liveCells.push(new Array(15, 12));

	UI.grid.liveCells.push(new Array(UI.grid.n - 1, UI.grid.n - 1));
	UI.grid.liveCells.push(new Array(UI.grid.n - 1, 1));

	UI.grid.liveCells.push(new Array(10, 10));
	UI.grid.liveCells.push(new Array(10, 11));
	UI.grid.liveCells.push(new Array(10, 12));
}




//	executing something	
//
//
//

window.onload = function () {

	UI.init();
	UI.resizeGrid();

	function nextGeneration() {

		clearInterval(generation);
		UI.renderLiveCells();
		core.newGeneration();
		generation = setInterval(nextGeneration, 1000);
	}

	function setDownload() {

		let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(UI.grid.liveCells)),
			download = document.getElementById('download');

		download.setAttribute("href", dataStr);
		download.setAttribute("download", "config.json");
	}

	addSomeCells();
	setDownload();

	var generation = setInterval(nextGeneration, 1000);

	let upload = document.getElementById('load'),
		reader = new FileReader();

	upload.onchange = function () {

		clearInterval(generation);
		reader.readAsText(upload.files[0]);
	};

	reader.onload = function () {

		// missing validation

		UI.grid.liveCells = [];
		for (let cell of JSON.parse(reader.result))
			UI.grid.liveCells.push(cell);

		setDownload();
		generation = setInterval(nextGeneration, 1000);
	};
};
