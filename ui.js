
function render() {

	let pxSize = gridSett.pxSize;
	ctx.fillStyle = 'black';

	for(let x=0; x < grid.length; x++){
		for(let y=0; y < grid[0].length; y++){
			if(grid[y][x] === 1){
				ctx.fillRect(
					x*(pxSize+gridSett.gap), 
					y*(pxSize+gridSett.gap), 
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
	pxSize: 30,
	gap: 2,
}


let rows = canvas.height/(gridSett.pxSize+gridSett.gap);
gridSett.rows = Math.floor(rows);

let colls = canvas.width/(gridSett.pxSize+gridSett.gap);
gridSett.colls = Math.floor(colls);


document.getElementById('cnvs').height = canvas.height 	- ((rows-gridSett.rows)*(gridSett.pxSize+gridSett.gap));
document.getElementById('cnvs').width= canvas.width	- ((colls-gridSett.colls)*(gridSett.pxSize+gridSett.gap));


console.log(gridSett.rows);
console.log(gridSett.colls);

let grid = create2DArray(gridSett.colls, gridSett.rows);




//add some data to grid array
grid[0][0] = 1;
grid[1][0] = 1;

grid[1][1] = 1;

grid[1][17] = 1;

grid[17][17] = 1;
render();

