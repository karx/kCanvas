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

    drawGrid(xnum = 20, ynum = 20, showGridValues = true) {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  
        this.ctx.strokeStyle = '#D3D3D3';
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

    clearCanvas() {
        // Store the current transformation matrix
        this.ctx.save();

        // Use the identity matrix while clearing the canvas
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Restore the transform
        this.ctx.restore();
    }
}