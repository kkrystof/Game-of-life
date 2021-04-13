
function render() {

	let pxSize = gridSett.pxSize;

	for(let x=0; x < grid[0].length; x++){
		for(let y=0; y < grid.length; y++){
			if(grid[y][x] === 1){
				ctx.fillStyle = 'black';
				ctx.fillRect(
					x*(pxSize+gridSett.gap) + pxSize, 
					y*(pxSize+gridSett.gap) + pxSize, 
					pxSize, pxSize);
			}
		}
	}
}


function create2DArray(colls, rows) {
	let arr = new Array(colls)

	for (let i = 0; i < colls; i++)
		arr[i] = new Array(rows)
	return arr;
}



let canvas = document.getElementById('cnvs');
let ctx = canvas.getContext('2d');

let gridSett = {
	pxSize: 10,
	gap: 2,
}

gridSett.rows = Math.floor(canvas.height/(gridSett.pxSize+gridSett.gap));
gridSett.colls = Math.floor(canvas.width/(gridSett.pxSize+gridSett.gap));

console.log(gridSett.rows);
console.log(gridSett.colls);

let grid = create2DArray(gridSett.colls, gridSett.rows);




//add some data to grid array
grid[0][0] = 1;
grid[1][0] = 1;
grid[30][48] = 1;

render();

