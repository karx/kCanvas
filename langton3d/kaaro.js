// 
var antGrid;
var grid;

var colorsToBeUsed = ["#4CC3D9" , "#D9C34C", "#4CD9C3", "#D94CC3"];

class LangtonAntGrid {
    
    constructor() {
        this.numberOfStates = 4;
        this.stateTransitions = ['L', 'L','R', 'R'];
    }
    
    init(x = 20, y =20, z= 20) {
        console.log('init Begun');
        grid = [];
        this.max_x = x;
        this.max_y = y;
        this.max_z = z;
        this.currentPosition = Object.assign({}, {
            x: 0,
            y: 0,
            z: 0,
            color: 0,
            heading: 0,
            orientation: 5
        });
        for (let i=-x; i<x; i++) {
            grid[i] = [];
            for (let j=-y; j<y; j++) {
                grid[i][j] = [];
                for (let k=-z;k<z;k++) {
                    grid[i][j][k] = Object.assign({}, {
                        color: 0
                    });
                }
            }
        }
        console.log('init End');
        console.log(grid);


    }
    updateGrid() {
        console.log('update Begun');
        const currentStatus = Object.assign({}, this.currentPosition);

        this.currentPosition.color = (this.currentPosition.color + 1)%(this.numberOfStates);
        grid[this.currentPosition.x][this.currentPosition.y][this.currentPosition.z].color = this.currentPosition.color;
        this.drawPosition(this.currentPosition);
        
        console.log('doneFirstBox?');

        //move to next Box
        // getNextHeadingFromColorAndHeading(this.currentStatus)


        if(this.stateTransitions[currentStatus.color] === 'L') {
        // if (currentStatus.color === 0) {
            this.currentPosition.heading = (this.currentPosition.heading + 1)%4;
            // console.log('right');
        } else if (this.stateTransitions[currentStatus.color] === 'R') {
            this.currentPosition.heading = (this.currentPosition.heading + 3)%4;
            // console.log('left');
        } else if (this.stateTransitions[currentStatus.color] === 'U') {
            console.log("lol");
        }

        switch(this.currentPosition.heading) {
            case 0: this.currentPosition.y--;
                break;
            case 1: this.currentPosition.x++;
                break;
            case 2: this.currentPosition.y++;
                break;
            case 3: this.currentPosition.x--;
                break;
            case 4: this.currentPosition.z++;
                break;
            case 5: this.currentPosition.z--;
        }
        console.log(this.currentPosition.x);
        console.log(grid[this.currentPosition.x]);
        this.currentPosition.color = grid[this.currentPosition.x][this.currentPosition.y][this.currentPosition.z].color;
        
    }

    getLog() {
        console.log(grid);
    }
    drawPosition(position) {
        drawBox(position);
        // kC.drawBlock(position.x, position.y, position.color);    
    }
}

antGrid = new LangtonAntGrid();
antGrid.init(50,50);


// kC.drawGrid(500,500, false);
// kC.ctx.globalCompositeOperation = 'color-burn';


function draw() {

    antGrid.updateGrid();
    
    requestAnimationFrame(draw);
}

draw();

function drawBox(position) {
    if (grid[position.x][position.y][position.z].ent)
    {
        var oldBox = grid[position.x][position.y][position.z].ent;
        var scale = grid[position.x][position.y][position.z].scale * 0.99;
        grid[position.x][position.y][position.z].scale = scale;

        // document.getElementById(`kLang-3d-${position.x}-${position.y}-${position.z}`);
        
        oldBox.setAttribute('color', getColorFromColorIndex(position.color));

        oldBox.setAttribute('scale', `${1-scale} ${1-scale} ${1-scale}`);
    }
    else {
        var newBox = document.createElement('a-box');
        var scale = 0.99;
        newBox.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
        newBox.setAttribute('scale', `${1-scale} ${1-scale} ${1-scale}`);
        newBox.setAttribute('color', getColorFromColorIndex(position.color));
        newBox.setAttribute('id',`kLang-3d-${position.x}-${position.y}-${position.z}`);
        grid[position.x][position.y][position.z].scale = scale;
        grid[position.x][position.y][position.z].ent = newBox;
        document.getElementById('mainFrame').appendChild(newBox);
        
    }
    
    console.log('done A Box .');
}

function getColorFromColorIndex(colorIndex) {
    return colorsToBeUsed[colorIndex];
}