import { kCanvas } from "../utils/mycanvas.js";

var canvasHeight;
var canvasWidth;
var kC = new kCanvas("#myCanvas");

var leftPressed = false;
var rightPressed = false;

function draw() {
    kC.clearCanvas();
    // kC.drawGrid();
    draw2DPath();
    rotateIfPressed();
    requestAnimationFrame(draw);
}

function draw2DPath() {
    kC.ctx.strokeStyle = "#030303";
    const pathToDraw = new Path2D(' \
    m160 96c0-35.289062-28.710938-64-64-64s-64 28.710938-64 64 28.710938 64 64 64 64-28.710938 64-64zm-64 48c-4.289062 0-8.425781-.617188-12.382812-1.679688l14.527343-14.527343c7.726563-.511719 14.953125-3.632813 20.480469-9.167969 5.527344-5.527344 8.648438-12.753906 9.167969-20.480469l14.527343-14.527343c1.0625 3.957031 1.679688 8.09375 1.679688 12.382812 0 26.472656-21.527344 48-48 48zm0-64c4.273438 0 8.289062 1.664062 11.3125 4.6875s4.6875 7.039062 4.6875 11.3125-1.664062 8.289062-4.6875 11.3125c-6.046875 6.046875-16.578125 6.046875-22.625 0-3.023438-3.023438-4.6875-7.039062-4.6875-11.3125s1.664062-8.289062 4.6875-11.3125 7.039062-4.6875 11.3125-4.6875zm39.078125-11.769531-11.597656 11.601562c-1.359375-2.304687-2.914063-4.511719-4.855469-6.457031-1.945312-1.949219-4.183594-3.464844-6.527344-4.789062l11.664063-11.664063c4.382812 3.109375 8.207031 6.933594 11.316406 11.308594zm-39.078125-20.230469c4.289062 0 8.425781.617188 12.382812 1.679688l-14.855468 14.855468c-7.4375.542969-14.71875 3.402344-20.160156 8.839844-5.527344 5.527344-8.648438 12.753906-9.167969 20.480469l-14.519531 14.527343c-1.0625-3.957031-1.679688-8.09375-1.679688-12.382812 0-26.472656 21.527344-48 48-48zm-39.078125 75.769531 11.597656-11.601562c1.359375 2.304687 2.914063 4.511719 4.855469 6.457031 1.945312 1.941406 4.152344 3.496094 6.457031 4.855469l-11.601562 11.597656c-4.375-3.109375-8.199219-6.933594-11.308594-11.308594zm39.078125 212.230469c-35.289062 0-64 28.710938-64 64s28.710938 64 64 64 64-28.710938 64-64-28.710938-64-64-64zm39.078125 36.230469-11.597656 11.601562c-1.359375-2.304687-2.914063-4.511719-4.855469-6.457031-1.953125-1.949219-4.183594-3.472656-6.527344-4.789062l11.671875-11.664063c4.375 3.109375 8.199219 6.933594 11.308594 11.308594zm-50.390625 39.082031c-3.023438-3.023438-4.6875-7.039062-4.6875-11.3125s1.664062-8.289062 4.6875-11.3125 7.039062-4.6875 11.3125-4.6875 8.289062 1.664062 11.3125 4.6875 4.6875 7.039062 4.6875 11.3125-1.664062 8.289062-4.6875 11.3125c-6.046875 6.046875-16.578125 6.046875-22.625 0zm11.3125-59.3125c4.289062 0 8.425781.617188 12.382812 1.679688l-14.855468 14.855468c-7.4375.542969-14.710938 3.402344-20.152344 8.839844-5.527344 5.519531-8.648438 12.746094-9.167969 20.472656l-14.527343 14.535156c-1.0625-3.957031-1.679688-8.09375-1.679688-12.382812 0-26.472656 21.527344-48 48-48zm-39.078125 75.769531 11.597656-11.601562c1.359375 2.304687 2.914063 4.511719 4.855469 6.457031 1.945312 1.941406 4.152344 3.496094 6.457031 4.855469l-11.601562 11.597656c-4.375-3.109375-8.199219-6.933594-11.308594-11.308594zm39.078125 20.230469c-4.289062 0-8.425781-.617188-12.382812-1.679688l14.535156-14.535156c7.726562-.519531 14.945312-3.632812 20.472656-9.167968 5.527344-5.519532 8.648438-12.746094 9.167969-20.472657l14.535156-14.535156c1.054687 3.964844 1.671875 8.101563 1.671875 12.390625 0 26.472656-21.527344 48-48 48zm304-288c35.289062 0 64-28.710938 64-64s-28.710938-64-64-64-64 28.710938-64 64 28.710938 64 64 64zm-48-64c0-4.289062.617188-8.425781 1.679688-12.382812l14.527343 14.527343c.511719 7.726563 3.632813 14.953125 9.167969 20.480469 5.527344 5.527344 12.753906 8.648438 20.480469 9.167969l14.527343 14.527343c-3.957031 1.0625-8.09375 1.679688-12.382812 1.679688-26.472656 0-48-21.527344-48-48zm36.6875-11.3125c3.023438-3.023438 7.039062-4.6875 11.3125-4.6875s8.289062 1.664062 11.3125 4.6875 4.6875 7.039062 4.6875 11.3125-1.664062 8.289062-4.6875 11.3125c-6.046875 6.046875-16.578125 6.046875-22.625 0-3.023438-3.023438-4.6875-7.039062-4.6875-11.3125s1.664062-8.289062 4.6875-11.3125zm39.082031 50.390625-11.601562-11.597656c2.304687-1.359375 4.511719-2.914063 6.457031-4.855469 1.941406-1.945312 3.496094-4.152344 4.855469-6.457031l11.597656 11.601562c-3.109375 4.375-6.933594 8.199219-11.308594 11.308594zm20.230469-39.078125c0 4.289062-.617188 8.425781-1.679688 12.382812l-14.527343-14.527343c-.511719-7.726563-3.632813-14.953125-9.167969-20.480469-5.441406-5.4375-12.714844-8.304688-20.160156-8.839844l-14.847656-14.855468c3.957031-1.0625 8.09375-1.679688 12.382812-1.679688 26.472656 0 48 21.527344 48 48zm-75.769531-39.078125 11.664062 11.664063c-2.335937 1.316406-4.574219 2.839843-6.527343 4.789062-1.941407 1.945312-3.496094 4.152344-4.855469 6.457031l-11.601563-11.601562c3.121094-4.375 6.945313-8.199219 11.320313-11.308594zm-36.230469 343.078125c0 35.289062 28.710938 64 64 64s64-28.710938 64-64-28.710938-64-64-64-64 28.710938-64 64zm36.230469-39.078125 11.671875 11.664063c-2.34375 1.316406-4.574219 2.839843-6.527344 4.789062-1.941406 1.945312-3.496094 4.152344-4.855469 6.457031l-11.597656-11.601562c3.109375-4.375 6.933594-8.199219 11.308594-11.308594zm39.082031 50.390625c-6.046875 6.046875-16.578125 6.046875-22.625 0-3.023438-3.023438-4.6875-7.039062-4.6875-11.3125s1.664062-8.289062 4.6875-11.3125 7.039062-4.6875 11.3125-4.6875 8.289062 1.664062 11.3125 4.6875 4.6875 7.039062 4.6875 11.3125-1.664062 8.289062-4.6875 11.3125zm-59.3125-11.3125c0-4.289062.617188-8.425781 1.679688-12.382812l14.535156 14.535156c.519531 7.726562 3.640625 14.953125 9.167968 20.472656 5.527344 5.527344 12.746094 8.648438 20.472657 9.167969l14.535156 14.535156c-3.964844 1.054687-8.101563 1.671875-12.390625 1.671875-26.472656 0-48-21.527344-48-48zm75.769531 39.078125-11.601562-11.597656c2.304687-1.359375 4.511719-2.914063 6.457031-4.855469 1.941406-1.945312 3.496094-4.152344 4.855469-6.457031l11.597656 11.601562c-3.109375 4.375-6.933594 8.199219-11.308594 11.308594zm20.230469-39.078125c0 4.289062-.617188 8.425781-1.679688 12.382812l-14.535156-14.535156c-.519531-7.726562-3.640625-14.953125-9.167968-20.472656-5.441407-5.4375-12.714844-8.296875-20.152344-8.839844l-14.855469-14.855468c3.964844-1.0625 8.101563-1.679688 12.390625-1.679688 26.472656 0 48 21.527344 48 48zm-369.726562-94.289062c-44.480469 8.34375-78.273438 47.417968-78.273438 94.289062 0 52.9375 43.0625 96 96 96 23.121094 0 44.351562-8.214844 60.945312-21.886719 27.039063-22.320312 58-34.121093 89.535157-34.121093h3.03125c31.535156 0 62.496093 11.800781 89.535156 34.121093 16.601563 13.671875 37.832031 21.886719 60.953125 21.886719 52.9375 0 96-43.0625 96-96 0-46.871094-33.785156-85.9375-78.265625-94.289062-11.566406-17.007813-17.734375-36.878907-17.734375-57.710938 0-20.519531 6.320312-40.871094 17.734375-57.710938 44.480469-8.351562 78.265625-47.417968 78.265625-94.289062 0-52.9375-43.0625-96-96-96-23.121094 0-44.351562 8.214844-60.945312 21.878906-.015626.007813-.03125.023438-.039063.03125-.015625.019532-.03125.027344-.046875.042969-27.03125 22.269531-57.960938 34.046875-89.457031 34.046875h-3.03125c-31.496094 0-62.425781-11.777344-89.449219-34.046875-.015625-.015625-.03125-.023437-.046875-.042969-.015625-.007812-.03125-.023437-.039063-.03125-16.59375-13.664062-37.824218-21.878906-60.945312-21.878906-52.9375 0-96 43.0625-96 96 0 46.871094 33.785156 85.9375 78.265625 94.289062 11.566406 17.015626 17.734375 36.878907 17.734375 57.710938s-6.160156 40.6875-17.726562 57.710938zm130.488281-201.710938 8 80h62.476562l8-80h16.761719v288h-16.761719l-8-80h-62.476562l-8 80h-16.761719v-288zm16.078125 0h46.320312l-6.398437 64h-33.523438zm95.160156 92.945312 16 8v86.109376l-16 8zm0 120 32-16v-105.890624l-32-16v-30.101563c16.871094 25.40625 45.503906 42.304687 78.070312 42.949219-9.199218 17.136718-14.070312 36.242187-14.070312 56.097656s4.871094 38.960938 14.070312 56.097656c-32.566406.65625-61.191406 17.542969-78.070312 42.949219zm-48.839844 75.054688h-46.320312l6.398437-64h33.523438zm-95.160156-92.945312-16-8v-86.109376l16-8zm0-120-32 16v105.890624l32 16v30.101563c-16.871094-25.40625-45.503906-42.292969-78.070312-42.949219 9.199218-17.136718 14.070312-36.242187 14.070312-56.097656s-4.871094-38.960938-14.070312-56.097656c32.566406-.65625 61.191406-17.542969 78.070312-42.949219zm-80 300.945312c-44.113281 0-80-35.886719-80-80s35.886719-80 80-80 80 35.886719 80 80c0 24.777344-11.328125 46.953125-29.0625 61.640625-.058594.046875-.121094.085937-.175781.136719l.007812.007812c-13.824219 11.367188-31.511719 18.214844-50.769531 18.214844zm150.488281-56c-21.390625 0-42.472656 4.871094-62.441406 14.152344 4.082031-9.375 6.664063-19.519532 7.546875-30.152344h112.804688c.882812 10.632812 3.472656 20.785156 7.546874 30.152344-19.960937-9.28125-41.035156-14.152344-62.433593-14.152344zm233.511719-24c0 44.113281-35.886719 80-80 80-19.257812 0-36.945312-6.847656-50.761719-18.222656l.007813-.007813c-.054688-.050781-.117188-.089843-.175782-.136719-17.742187-14.679687-29.070312-36.855468-29.070312-61.632812 0-44.113281 35.886719-80 80-80s80 35.886719 80 80zm-80-384c44.113281 0 80 35.886719 80 80s-35.886719 80-80 80-80-35.886719-80-80c0-24.785156 11.328125-46.960938 29.070312-61.648438.058594-.039062.113282-.078124.160157-.128906l-.007813-.007812c13.832032-11.375 31.519532-18.214844 50.777344-18.214844zm-150.488281 56c21.390625 0 42.472656-4.871094 62.441406-14.160156-4.082031 9.375-6.664063 19.519531-7.554687 30.160156h-112.804688c-.882812-10.632812-3.472656-20.785156-7.554688-30.160156 19.976563 9.289062 41.050782 14.160156 62.449219 14.160156zm-233.511719 24c0-44.113281 35.886719-80 80-80 19.257812 0 36.945312 6.839844 50.769531 18.222656l-.007812.007813c.054687.042969.109375.082031.160156.128906 17.75 14.679687 29.078125 36.855469 29.078125 61.640625 0 44.113281-35.886719 80-80 80s-80-35.886719-80-80zm272 104h-80v96h80zm-16 80h-48v-64h48zm0 0 \
    ');
    kC.ctx.stroke(pathToDraw);
}

function rotateIfPressed() {
    if (rightPressed) {
        kC.ctx.transform(1, 0.1, -0.1, 1, 1, 0);
    }
    if (leftPressed) {
        kC.ctx.transform(1, -0.1, 0.1, 1, 1, 0);
    }
}
kC.drawGrid();


function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


draw();
