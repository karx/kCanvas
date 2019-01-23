export class kCanvas {

    constructor(canvas) {
        this.setupCanvas(canvas);
    }
    setupCanvas(canvasDomRef) {
        // Get the device pixel ratio, falling back to 1.
        const canvas = document.querySelector(canvasDomRef);
        var dpr = window.devicePixelRatio || 1;
        // Get the size of the canvas in CSS pixels.
        var rect = canvas.getBoundingClientRect();
        // Give the canvas pixel dimensions of their CSS
        // size * the device pixel ratio.
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        this.width = canvas.width;
        this.height = canvas.height;
        this.ctx = canvas.getContext('2d');
        // Scale all drawing operations by the dpr, so you
        // don't have to worry about the difference.
        this.ctx.scale(dpr, dpr);
        return this.ctx;
      }

    drawGrid(xnum = 20, ynum = 20, showGrid = true, showGridValues = true) {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.max_x = xnum;
        this.max_y = ynum;
        this.ctx.strokeStyle = '#D3D3D3';
        // console.log(this.height/ynum);
        if (showGrid) {
            for(let i=0;i<this.height; i += (this.height/ynum)) {
                this.ctx.moveTo(0, i);
                this.ctx.lineTo(this.width, i);
                this.ctx.stroke();
                
            }
            for (let i =0 ; i < this.width ; i += (this.width/xnum)) {
                this.ctx.moveTo(i, 0);
                this.ctx.lineTo(i, this.height);
                this.ctx.stroke();
            }
    
        }
        
        if (showGridValues) {
            this.ctx.font = '5px';
            this.ctx.strokeStyle = "#d3d3ff";
            
            for(let i=0;i<this.height; i += (this.height/ynum)) {
                this.ctx.strokeText(Math.floor(i) + '', 0, i, 20);
                this.ctx.strokeText(Math.floor(i) + '', this.width - 20, i, 20);    
            }
            for(let i=0;i<this.width; i += (this.width/xnum)) {
                this.ctx.strokeText(Math.floor(i) + '', i, 0 + 10, 20);
                this.ctx.strokeText(Math.floor(i) + '', i, this.height, 20);    
            }
        }
        this.ctx.restore();

    }

    drawBlock(gridX, gridY, colorIndex = 0) {
        
        const unit_x = (this.width/this.max_x) ;
        const unit_y = (this.height/this.max_y) ;
        const c_x = unit_x * gridX;
        const c_y = unit_y * gridY;
        this.ctx.fillStyle = this.getColor(colorIndex);
        this.ctx.fillRect(c_x, c_y, unit_x, unit_y);

        // console.log(c_x, c_y);
        // console.log(unit_y);
        
    }

    clearCanvas() {
        // Store the current transformation matrix
        this.ctx.save();

        // Use the identity matrix while clearing the canvas
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Restore the transform
        this.ctx.restore();
    }

    getColor(colorIndex) {
        switch(colorIndex) {
            case 0: return '#ECEFF1';
            case 1: return '#FFEBEE';
            case 2: return '#E8F5E9';
            case 3: return '#E1F5FE';
            // case 4: return '#ECEFF1';
            // case 5: return '#ECEFF1';
        }
    }
}