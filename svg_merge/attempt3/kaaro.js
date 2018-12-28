var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

function drawInit() {
    for (let i =0 ; i < 50 ; i ++) {
        ctx.moveTo(0, i*10);
        ctx.lineTo(500, i*10);
        ctx.stroke();
    }
    for (let i =0 ; i < 50 ; i ++) {
        ctx.moveTo( i*10, 0);
        ctx.lineTo(i*10, 500);
        ctx.stroke();
    }
}

function draw() {

    requestAnimationFrame(draw);
}

drawInit();

draw();
