// 
class LangtonAntGrid {
    
    constructor() {
        this.numberOfStates = 2;
        this.stateTransitions = ['R', 'L'];
    }
    
    init(x = 20, y =20, z= 20) {
        this.grid = [];
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
        for (let i=0; i<x; i++) {
            this.grid[i] = [];
            for (let j=0; j<y; j++) {
                this.grid[i][j] = [];
                for (let k=0;k<z;k++) {
                    this.grid[i][j][k] = Object.assign({}, {
                        color: 0
                    });
                }
            }
        }
    }
    updateGrid() {
        const currentStatus = Object.assign({}, this.currentPosition);

        this.currentPosition.color = (this.currentPosition.color + 1)%(this.numberOfStates);
        this.grid[this.currentPosition.x][this.currentPosition.y][this.currentPosition.z].color = this.currentPosition.color;
        this.drawPosition(this.currentPosition);
        

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
        this.currentPosition.color = this.grid[this.currentPosition.x][this.currentPosition.y][this.currentPosition.z].color;
        
    }

    getLog() {
        console.log(this.grid);
    }
    drawPosition(position) {
        drawBox(position);
        // kC.drawBlock(position.x, position.y, position.color);    
    }
}



var antGrid = new LangtonAntGrid();
antGrid.init(500,500);

// kC.drawGrid(500,500, false);
// kC.ctx.globalCompositeOperation = 'color-burn';


function draw() {

    antGrid.updateGrid();
    
    requestAnimationFrame(draw);
}

draw();

function drawBox(position) {
    var newBox = document.createElement('a-box');
    newBox.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
    newBox.setAttribute('color', position.color === 0 ? "#4CC3D9" : "#D9C34C");
    document.getElementById('mainFrame').appendChild(newBox);


}