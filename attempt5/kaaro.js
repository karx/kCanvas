import { kCanvas } from "../utils/mycanvas.js";

var kC = new kCanvas("#myCanvas");


class LangtonAntGrid {
    
    constructor() {
        this.numberOfStates = 7;
        this.stateTransitions = ['R', 'R', 'L ', 'R','L','L','L'];
    }
    
    init(x = 20, y =20) {
        this.grid = [];
        this.max_x = x;
        this.max_y = y;
        this.currentPosition = Object.assign({}, {
            x: this.max_x/2,
            y: this.max_y/2,
            color: 0,
            heading: 0
        });
        for (let i=0; i<x; i++) {
            this.grid[i] = [];
            for (let j=0; j<y; j++) {
                this.grid[i][j] = Object.assign({}, {
                    color: 0
                });
            }
        }
    }
    updateGrid() {
        const currentStatus = Object.assign({}, this.currentPosition);

        this.currentPosition.color = (this.currentPosition.color + 1)%(this.numberOfStates);
        this.grid[this.currentPosition.x][this.currentPosition.y].color = this.currentPosition.color;
        this.drawPosition(this.currentPosition);
        

        //move to next Box
        if(this.stateTransitions[currentStatus.color] === 'L') {
        // if (currentStatus.color === 0) {
            this.currentPosition.heading = (this.currentPosition.heading + 1)%4;
            // console.log('right');
        } else if (this.stateTransitions[currentStatus.color] === 'R') {
            this.currentPosition.heading = (this.currentPosition.heading + 3)%4;
            // console.log('left');
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
        }
        this.currentPosition.color = this.grid[this.currentPosition.x][this.currentPosition.y].color;
        
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
