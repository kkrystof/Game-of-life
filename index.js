
let   canvas = 	document.getElementById('gridGameOfLife'),
      ctx    = 	canvas.getContext('2d'),
      gridSett = {
        n: 30,
        d: 0,
        liveCells: [],
        size: 0,
        gap: 0,
        r: 15 // ratio = r*gap
	};


window.onresize = function() {

	// avoiding resizeGrid() if it's not necessary

	const  	windowW = window.innerWidth,
		windowH = window.innerHeight; 

	if(windowW<windowH && windowW==canvas.width && windowH>canvas.width
	|| windowW>windowH && windowH==canvas.height && windowW>canvas.height)
			return;

	resizeGrid();
	console.log(gridSett.d);
};


function renderLiveCells() {

	ctx.fillStyle = 'black';

	let shift =
		(gridSett.gap + (gridSett.d/(gridSett.gap+gridSett.size))%1*(gridSett.gap+gridSett.size))/gridSett.n;

	// the first (0) rect doesn't add the shift .. 0*( .. and therefore  
	shift += shift/(gridSett.n-1);

	for(let i = 0; i < gridSett.liveCells.length; i++)
		ctx.fillRect(
			gridSett.liveCells[i][0]*(gridSett.size+gridSett.gap+shift),
			gridSett.liveCells[i][1]*(gridSett.size+gridSett.gap+shift),
			gridSett.size, gridSett.size);
}


function resizeGrid() {
	
	gridSett.d = Math.min(window.innerHeight,window.innerWidth);

	canvas.height = gridSett.d;
	canvas.width  = gridSett.d;

	calcCellGap();
	renderLiveCells();	
}

function calcCellGap() {

	gridSett.size = gridSett.r * gridSett.d/(gridSett.n*(gridSett.r+1));
        gridSett.gap = gridSett.size/gridSett.r;
}

function addSomeCells() {

	//gridSett.liveCells.push(new Array(0,0));
	//gridSett.liveCells.push(new Array(0,1));
	//gridSett.liveCells.push(new Array(1,1));



	gridSett.liveCells.push(new Array(20,20));
	gridSett.liveCells.push(new Array(20,21));
	gridSett.liveCells.push(new Array(19,20));
	gridSett.liveCells.push(new Array(19,21));

	gridSett.liveCells.push(new Array(19,22));

	gridSett.liveCells.push(new Array(15,11));
	gridSett.liveCells.push(new Array(15,12));

	gridSett.liveCells.push(new Array(gridSett.n-1,gridSett.n-1));
	gridSett.liveCells.push(new Array(gridSett.n-1,1));
	
	gridSett.liveCells.push(new Array(10,10));
	gridSett.liveCells.push(new Array(10,11));
	gridSett.liveCells.push(new Array(10,12));
}

//core
function newGeneration() {

	clearInterval(generation);

	let nextLiveCells = [],
		nextDeadCells = [];


	gridSett.liveCells.forEach(function generate(cell, i) {

		if(!shouldLive(cell,-1))
			nextDeadCells.push(i);

		for(let x = cell[0]-1; x <= cell[0]+1; x++) {
			for(let y = cell[1]-1; y <= cell[1]+1; y++) {
				if(!exists([x,y],nextLiveCells) && shouldLive([x,y],0))
					nextLiveCells.push(new Array(x,y));
			}
		}
	});

	//apply changes
	for(let i of nextDeadCells.reverse())
		gridSett.liveCells.splice(i,1);
	for(let i of nextLiveCells)
		gridSett.liveCells.push(i);

	generation = setInterval(testGeneration, 1000);
}


function exists(cell,nextLiveCells) {
	for(let i of gridSett.liveCells.concat(nextLiveCells)) {
		if(i[0]==cell[0] && i[1]==cell[1])
			return true;
	}
	return false;
}

function shouldLive(cell,param) {

	let nLiveCellsAround = param;
	for(let comparedCell of gridSett.liveCells) {

		if
		(
			comparedCell[0] <= cell[0]+1 &&
			comparedCell[0] >= cell[0]-1 &&
			comparedCell[1] <= cell[1]+1 && 
			comparedCell[1] >= cell[1]-1
		)
			nLiveCellsAround++;
	}


	return (param==0) ? comesToLive(nLiveCellsAround) : !willDie(nLiveCellsAround);
}

function comesToLive(nLiveCellsAround) {

        switch(nLiveCellsAround) {
                case 3:
                        return true;
                default:
                        return false;
        }
}

function willDie(nLiveCellsAround) {

        switch(nLiveCellsAround) {
                case 2:
                        return false;
                case 3:
                        return false;
                default: // 0, 1, 4, 5, 6, 7, 8
                        return true;
        }
}




addSomeCells();
resizeGrid();

function testGeneration() {
	newGeneration();
	resizeGrid();
}


var generation = setInterval(testGeneration, 1000);
