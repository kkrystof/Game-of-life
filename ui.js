
let   canvas = 	document.getElementById('cnvs'),
      ctx    = 	canvas.getContext('2d'),
      gridSett = {
        n: 30,
        d: canvas.width,
        liveCells: [],
        size: 0,
        gap: 0,
        r: 15 // ratio = r*gap
	};


window.onresize = function() {

	// avoiding resizeGrid() if it's not necessary

	const windowW = window.innerWidth; 
	const windowH = window.innerHeight; 

	if(windowW<windowH) {
		if(windowW==canvas.width && windowH>canvas.width)
			return;
	}
	if(windowH==canvas.height && windowW>canvas.height) 
		return;

	resizeGrid();
};


function renderLiveCells() {

	let shift =
		(gridSett.gap + ((gridSett.d/(gridSett.gap+gridSett.size))%1)*(gridSett.gap+gridSett.size))/gridSett.n;

	// the first (0) rect doesn't add the shift .. 0*( .. and therefore  
	shift += shift/(gridSett.n-1);

	let size = gridSett.size;
	ctx.fillStyle = 'black';

	for(let i = 0; i < gridSett.liveCells.length; i++)
		ctx.fillRect(
			gridSett.liveCells[i][0]*(size+gridSett.gap+shift),
			gridSett.liveCells[i][1]*(size+gridSett.gap+shift),
			size, size);
}


function resizeGrid() {

	canvas.height = Math.min(window.innerHeight,window.innerWidth);
	canvas.width = canvas.height;

	gridSett.d = canvas.height;
	gridSett.size = gridSett.r * gridSett.d/(gridSett.n*(gridSett.r+1));
	gridSett.gap = gridSett.size/gridSett.r;
	renderLiveCells();	
}

function testAddSomeCells() {

	gridSett.liveCells.push(new Array(0,0));
	gridSett.liveCells.push(new Array(0,1));
	gridSett.liveCells.push(new Array(1,1));
	gridSett.liveCells.push(new Array(27,10));
	gridSett.liveCells.push(new Array(gridSett.n-1,gridSett.n-1));
	gridSett.liveCells.push(new Array(gridSett.n-1,gridSett.n-1));
	gridSett.liveCells.push(new Array(gridSett.n-1,1));
}


testAddSomeCells();
resizeGrid();


