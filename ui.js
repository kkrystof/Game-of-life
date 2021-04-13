let canvas = document.getElementById('cnvs');
let ctx = canvas.getContext('2d');

let gridSett = {
    colls: 100,
    rows: 150,
    pxSize: 10,
    gap: 2,
}


function create2DArray(colls, rows) {
let arr = new Array(colls)
    for (let i = 0; i < colls; i++){
        arr[i] = new Array(rows)
    }
    return arr;
}

let grid = create2DArray(gridSett.colls, gridSett.rows);

//add some data to grid array
grid[1][5] = 1;
grid[2][5] = 1;
grid[1][6] = 1;

function render() {
    for(let y=0; y < grid.length; y++){
        for(let x=0; x < grid[y].length; x++){
            if(grid[y][x] === 1){
                ctx.fillStyle = 'black';
                let pxSize = gridSett.pxSize;
                ctx.fillRect(
                    x*(pxSize+gridSett.gap) + pxSize, 
                    y*(pxSize+gridSett.gap) + pxSize, 
                    pxSize, pxSize);
            }
        }
    }
}

render();

