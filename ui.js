
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
		(gridSett.gap + ((gridSett.d/(gridSett.gap+gridSett.size))%1)*(gridSett.gap+gridSett.size))/gridSett.n;

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

	gridSett.liveCells.push(new Array(0,0));
	gridSett.liveCells.push(new Array(0,1));
	gridSett.liveCells.push(new Array(1,1));
	gridSett.liveCells.push(new Array(27,10));
	gridSett.liveCells.push(new Array(gridSett.n-1,gridSett.n-1));
	gridSett.liveCells.push(new Array(gridSett.n-1,1));
}


addSomeCells();
resizeGrid();


