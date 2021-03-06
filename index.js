function GameOfLife() {
	let UI = {
		grid: {
			n: 6,
			d: 0,
			liveCells: [],
			size: 0,
			gap: 0,
			shift: 0,
			r: 15
		},
		shiftX: 0,
		shiftY: 0,

		init: function () {
			this.setupCanvas();
		},
		setupCanvas: function () {
			this.canvas = document.getElementById('gridGameOfLife');
			this.ctx = this.canvas.getContext('2d');
		},
		render: function () {
			const k = this.grid.size + this.grid.gap + this.grid.shift;

			// fill spaces by some color
			this.ctx.fillStyle = 'grey';
			this.ctx.fillRect(0, 0, this.grid.d, this.grid.d);
			
			// fill all cells
			this.ctx.fillStyle = 'white';
			for(let x = 0; x < this.grid.n; x++) {
				for(let y = 0; y < this.grid.n; y++) {
					this.ctx.fillRect(
						x * k,
						y * k,
						this.grid.size,
						this.grid.size
					);
				}
			}

			// highlight live cells
			this.ctx.fillStyle = 'black';
			for (let cell of this.grid.liveCells)
				this.ctx.fillRect(
					(cell[0] + this.shiftX) * k,
					(this.grid.d - this.grid.size) - (cell[1] + this.shiftY) * k,
					this.grid.size,
					this.grid.size);
		},
		resizeGrid: function () {
			this.grid.d = Math.min(window.innerHeight, window.innerWidth);

			this.canvas.height = this.grid.d;
			this.canvas.width = this.grid.d;

			this.recalc();
			this.render();
		},
		recalc: function () {
			this.grid.size = this.grid.r * this.grid.d / (this.grid.n * (this.grid.r + 1));
			this.grid.gap = this.grid.size / this.grid.r;

			this.grid.shift =
				(this.grid.gap + (this.grid.d / (this.grid.gap + this.grid.size)) % 1 * (this.grid.gap + this.grid.size)) / this.grid.n;

			// the first (0) rect doesn't add the shift .. 0*( .. and therefore
			this.grid.shift += this.grid.shift / (this.grid.n - 1);
		},
		refresh: function () {
			this.minX = Math.min(...this.grid.liveCells.map(x => x[0])),
				this.maxX = 
					Math.max(...this.grid.liveCells.map(x => x[0])),
				this.minY = 
					Math.min(...this.grid.liveCells.map(x => x[1])),
				this.maxY = 
					Math.max(...this.grid.liveCells.map(x => x[1]));
		},
		expandIfNeeded: function () {
			// keeping a ratio would be plus because of increasing UI.grid.n in both coordinates
			this.refresh();
			minX = 
				this.minX + this.shiftX;
			maxX = 
				this.maxX + this.shiftX;
			minY = 
				this.minY + this.shiftY;
			maxY = 
				this.maxY + this.shiftY;

				this.grid.n += Math.max(0,-minX);
				this.shiftX += Math.max(0,-minX);

				this.grid.n += Math.max(0,maxX - this.grid.n + 1);

				this.grid.n += Math.max(0,-minY);
				this.shiftY += Math.max(0,-minY);

				this.grid.n += Math.max(0,maxY - this.grid.n + 1);

			this.recalc();
		},
		adjustToLiveCells: function () {
			this.refresh();

			this.shiftX = -this.minX;
			this.shiftY = -this.minY;

			this.grid.n = Math.max(
				Math.abs(this.maxX) - Math.abs(this.minX), Math.abs(this.maxY) - Math.abs(this.minY)
			) + 1;

			this.recalc();
		},
		centerLiveCells: function () {
		}
	};

	let core = {
		newGeneration: function () {

			nLiveCellsBefore = UI.grid.liveCells.length;

			for (const cell of UI.grid.liveCells.slice(0, nLiveCellsBefore))
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
		exists: function (searchedCell, nextLiveCells) {
			for (const cell of UI.grid.liveCells)
				if (cell[0] == searchedCell[0] && cell[1] == searchedCell[1])
					return true;
			return false;
		},
		shouldLive: function (cell, isCellDefinitelyLive) {

			let nLiveCellsAround = 0;

			for (const comparedCell of UI.grid.liveCells.slice(0, nLiveCellsBefore))
				if (comparedCell[0] <= cell[0] + 1 &&
					comparedCell[0] >= cell[0] - 1 &&
					comparedCell[1] <= cell[1] + 1 &&
					comparedCell[1] >= cell[1] - 1)
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

		},
		addCells: function (cells) {
			UI.grid.liveCells = cells.map(x => x);
		}
	};

	let controler = {

		upload: document.getElementById('load'),
		reader: new FileReader(),
		generation: 0, // interval

		init: function () {
			UI.init();
			UI.resizeGrid();

			window.onresize = function () {
				// avoiding resizeGrid() if it's not necessary

				const windowW = window.innerWidth,
					windowH = window.innerHeight;

				if (windowW < windowH && windowW == UI.canvas.width && windowH > UI.canvas.width
					|| windowW > windowH && windowH == UI.canvas.height && windowW > UI.canvas.height)
					return;

				UI.resizeGrid();
			};

			this.upload.onchange = function () {
				clearInterval(controler.generation);
				UI.expandIfNeeded(); // rather to compute last shiftX & shiftY for last core.newGeneration()
				controler.reader.readAsText(controler.upload.files[0]);
			};

			this.reader.onload = function () {
				// missing validation
				core.addCells(JSON.parse(controler.reader.result));
				controler.setDownload();
				UI.expandIfNeeded();
				UI.render();
				controler.startInterval();
			};
		},
		nextGeneration: function () {
			clearInterval(this.generation);

			core.newGeneration();
			UI.expandIfNeeded();
			//UI.adjustToLiveCells();
			UI.render();

			this.startInterval;
		},
		startInterval: function () {
			this.generation = setInterval(this.nextGeneration, 100);
		},
		setDownload: function () {
			const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(UI.grid.liveCells)),
				download = document.getElementById('download');

			download.setAttribute("href", dataStr);
			download.setAttribute("download", "config.json");
		}
	};


	//
	//
	//
	//
	controler.init();
	fetch("samples/spaceship.json").then(response => { return response.json(); }).then(data => core.addCells(data)).then(x => controler.setDownload()).then(x => UI.render());
	controler.startInterval();

}

window.onload = function () { GameOfLife(); };
