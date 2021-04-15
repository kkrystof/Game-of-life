
function renderLiveCells() {

	let shift =
		(gridSett.gap + ((gridSett.d/(gridSett.gap+gridSett.pxSize))%1)*(gridSett.gap+gridSett.pxSize))/gridSett.n;

	// the first (0) rect doesn't add the shiftH/W .. 0*( .. and therefore  
	shift += shift/gridSett.n;

	let pxSize = gridSett.pxSize;

	ctx.fillStyle = 'black';

	for(let i = 0; i < gridSett.liveCells.length; i++)
		ctx.fillRect(
			gridSett.liveCells[i][0]*(pxSize+gridSett.gap+shift),
			gridSett.liveCells[i][1]*(pxSize+gridSett.gap+shift),
			pxSize, pxSize);
}



document.getElementById('cnvs').width= Math.min(screen.availWidth,screen.availHeight);
document.getElementById('cnvs').height = document.getElementById('cnvs').width; 


let canvas = document.getElementById('cnvs');
let ctx = canvas.getContext('2d');
let gridSett = {
	n: 6,
	d: document.getElementById('cnvs').width,
	liveCells: [],
	pxSize: 0,
	gap: 0,
	r: 8 // ratio pxSize = r*gap
}


gridSett.pxSize = gridSett.r * gridSett.d/(gridSett.n*(gridSett.r+1));
gridSett.gap = gridSett.pxSize/gridSett.r;





//add some cells to grid 
gridSett.liveCells.push(new Array(0,0));
gridSett.liveCells.push(new Array(0,1));
gridSett.liveCells.push(new Array(1,1));
gridSett.liveCells.push(new Array(27,10));
gridSett.liveCells.push(new Array(gridSett.n-1,gridSett.n-1));
gridSett.liveCells.push(new Array(gridSett.n-1,gridSett.n-1));
gridSett.liveCells.push(new Array(gridSett.n-1,1));


renderLiveCells();

