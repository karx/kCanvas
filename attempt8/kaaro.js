import { kCanvas } from "../utils/mycanvas.js";

var kC = new kCanvas("#myCanvas");


class GravitationalField {
    
    constructor() {
        // this.numberOfStates = 2;
        // this.stateTransitions = ['R', 'L'];
    }
    
    init(x = 20, y =20) {
        this.grid = [];
        this.max_x = x;
        this.max_y = y;
        // this.currentPosition = Object.assign({}, {
        //     x: this.max_x/2,
        //     y: this.max_y/2,
        //     color: 0,
        //     heading: 0
        // });
        for (let i=0; i<x; i++) {
            this.grid[i] = [];
            for (let j=0; j<y; j++) {
                this.grid[i][j] = Object.assign({}, {
                    color: 0
                });
            }
        }
    }
    updateGrid(x,y) {
        const currentStatus = Object.assign({}, this.currentPosition);
        
        
        
    }

    getLog() {
        console.log(this.grid);
    }
    drawPosition(position) {
        kC.drawBlock(position.x, position.y, position.color);    
    }
}



var antGrid = new LangtonAntGrid();
antGrid.init(500,500);

kC.drawGrid(500,500, false);
kC.ctx.globalCompositeOperation = 'color-burn';


function draw() {

    antGrid.updateGrid();
    
    requestAnimationFrame(draw);
}

draw();
