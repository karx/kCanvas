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
        
    }

    colorUpdate(x,y,z,colorIndex) {
        grid[x][y][z].color = colorIndex;
    }

    getColorOfGrid(x,y,z) {
        return grid[x][y][z].color;
    }

    getLog() {
        console.log(grid);
    }
    drawPosition(position) {
        
    }
}

class LangtonTermite {
    constructor(start_x, start_y, start_z, orientation = 5, transition = ['L', 'R'], numberOfStates = 2) {
        this.numberOfStates = numberOfStates;
        this.stateTransitions =transition;
        this.currentPosition = Object.assign({}, {
            x: start_x,
            y: start_y,
            z: start_z,
            color: 0,
            heading: 0,
            orientation: orientation
        });
    }

    init() {

    }

    colorAndupdatePosition() {
        
        console.log('update Begun');
        const currentStatus = Object.assign({}, this.currentPosition);
        if (!grid[this.currentPosition.x] || !grid[this.currentPosition.x][this.currentPosition.y] || !grid[this.currentPosition.x][this.currentPosition.y][this.currentPosition.z])
        return;

        // If we Want it to interact with the community (no race):
        var colorFromGrid = antGrid.getColorOfGrid(this.currentPosition.x, this.currentPosition.y, this.currentPosition.z);
        this.currentPosition.color = (colorFromGrid + 1)%(this.numberOfStates);
        //Elese if we want it not interacting with the community (or sometimes ;P - a bug Yes)
        // this.currentPosition.color = (this.currentPosition.color + 1)%(this.numberOfStates);


        
        antGrid.colorUpdate(this.currentPosition.x, this.currentPosition.y, this.currentPosition.z, this.currentPosition.color);

        drawBox(this.currentPosition);
        
        console.log('doneFirstBox?');

        //move to next Box
        // getNextHeadingFromColorAndHeading(this.currentStatus)


        if(this.stateTransitions[currentStatus.color] === 'L') {
            this.currentPosition.heading = (this.currentPosition.heading + 1)%4;
            // console.log('right');
        } else if (this.stateTransitions[currentStatus.color] === 'R') {
            this.currentPosition.heading = (this.currentPosition.heading + 3)%4;
            // console.log('left');
        } else if (this.stateTransitions[currentStatus.color] === 'U') {
            // TODO: make this shiz 3d
            //  Would need to add orientation. i.e direction of tangent.
            console.log("lol");
        }

        switch(this.currentPosition.heading) {
            case 0: 
                // this.currentPosition.y--;
                this._updatePimaryAxis(-1);
                break;
            case 1: 
                // this.currentPosition.x++;
                this._updateSecondaryAxis(1);
                break;
            case 2: 
            // this.currentPosition.y++;
                this._updatePimaryAxis(1);
                break;
            case 3: 
            // this.currentPosition.x--;
                this._updateSecondaryAxis(-1);
                break;
        }
        console.log(this.currentPosition.x);
        if (!grid[this.currentPosition.x] || !grid[this.currentPosition.x][this.currentPosition.y] || !grid[this.currentPosition.x][this.currentPosition.y][this.currentPosition.z])
            return;
        // this.currentPosition.color = "#E3E3E3";
        drawBox(this.currentPosition);
        this.currentPosition.color = grid[this.currentPosition.x][this.currentPosition.y][this.currentPosition.z].color;
        console.log("New color : " + this.currentPosition.color);
    }
    _updatePimaryAxis( updateDelta) {
        switch(this.currentPosition.orientation) {
            case 1:
                    this.currentPosition.y += updateDelta;
                    break;
            case 5:
                    this.currentPosition.y += updateDelta;
                    break;
            default:
                this.currentPosition.y += updateDelta;
                break;
        }
    }
    _updateSecondaryAxis( updateDelta) {
        switch(this.currentPosition.orientation) {
            case 1:
                this.currentPosition.z += updateDelta;
                break;
            case 5:
                this.currentPosition.x+= updateDelta;
                break;

            default:
                this.currentPosition.x += updateDelta;
                break;

        }
    }
    
}


antGrid = new LangtonAntGrid();
antGrid.init(100,100, 100);

var allTermites = [
    new LangtonTermite(1,0,-10,5, ['L', 'L', 'R' , 'R'], 4),
    new LangtonTermite(30,0,20,1, ['L', 'L', 'R' , ], 3),
    new LangtonTermite(-40,0,20,1, ['L', 'R', 'R' , ], 3),
    new LangtonTermite(1,0,50,5, ['L', 'R' ], 2),
    // new LangtonTermite(0,0,0, 1),
    
    // new LangtonTermite(10,10,0, 5, ['L', 'L', 'R', 'R'], 4),
    // new LangtonTermite(2,10,4, 1, ['L', 'L', 'R', 'R'], 4),
    // new LangtonTermite(4,5,5, 1, ['R', 'L', 'R'], 3),
    // new LangtonTermite(-2,-7, -2, 5, ['L', 'L', 'R', 'R'], 4),

    
];
// kC.drawGrid(500,500, false);
// kC.ctx.globalCompositeOperation = 'color-burn';


function draw() {

    antGrid.updateGrid();
    allTermites.forEach( (termite) => {
        termite.colorAndupdatePosition();
    });
    
    requestAnimationFrame(draw);
}

draw();

function drawBox(position) {
    if (!grid[position.x] || !grid[position.x][position.y] || !grid[position.x][position.y][position.z])
        return;
    if (grid[position.x][position.y][position.z].ent)
    {
        var oldBox = grid[position.x][position.y][position.z].ent;
        var scale = grid[position.x][position.y][position.z].scale * 0.85;
        grid[position.x][position.y][position.z].scale = scale;

        // document.getElementById(`kLang-3d-${position.x}-${position.y}-${position.z}`);
        
        oldBox.setAttribute('color', getColorFromColorIndex(position.color));

        oldBox.setAttribute('scale', `${1-scale} ${1-scale} ${1-scale}`);
    }
    else {
        var newBox = document.createElement('a-box');
        var scale = 0.85;
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