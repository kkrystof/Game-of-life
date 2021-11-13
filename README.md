# Conway's Game of Life

### Our game itself hasn't been implemented somehow quicker way.
### The current algorithm goes through every live cell and declares the state of each cell around for every next generation.
## Why we use canvas?
### There is also the grid. Ohh..yeah, but it has these problems:
- You have to create a new element per cell (at least per live-cell as black div or something..)
- With this, it would be hard, or not appropriate, to render things like coordinates, axes or highlighted spaces. Highlighted spaces/borders everywhere would mean a new element per cell.
## Why does canvas have to be a square?
### Because of these following requirements:
- Constant canvases sizes
- Fitting all cells exactly according to size (the last cell should fit the grid's end)
- No frame or something like that
### If you look at it, you will find that it is not possible without a square.
### Ok, there is one more idea that is very complicated and would look strange after all.
