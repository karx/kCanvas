# HTML Canvas - Why so under utilized?
To answer this question, we must really understand the current state of HTML Canvas.

# What is HTML Canvas?
If you have ever tried 'drawing' on a web page, the first thing that the search engine gives you is HTML Canvas.
Well that is the 2019 definition of HTML canvas.
Definition as in MDN:
> The Canvas API provides a means for drawing graphics via JavaScript and the HTML \'\<canvas\>\'  element. Among other things, it can be used for animation, game  graphics, data visualization, photo manipulation, and real-time video  processing.
> The Canvas API largely focuses on 2D graphics. The WebGL API, which also uses the \'\<canvas\>\' element, draws hardware-accelerated 2D and 3D graphic


## Why have you not used HTML Canvas?
Well because developers did not recommend it. Well mostly.
The ROI almost was not worth it, but not for game devs.

If you have ever worked on games on the web, then you are amogst those few who have actually seen the Canvas APIs. Lets get started with it already then.

## Getting Started.
The first thing that I noticed was that it was possible to set the width & height of the canvas exclusively using any one of CSS, JS, or HTML (we will discuss why this bifurcation). 
I chose to give them these using CSS. 100vw, 100vh. Simple
Then, drew a line. Drew a ball. 
The pixel density seemed very low. 
> Enter: [window.devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)
So lets setup an function setupCanvas to encapuslate all of this.

```
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
```

Also, its 2019. No fun having a static image there.
We will paint!
> Enter: [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

for using request animation frame, the easist way is to do something like this:
```
...

function draw() {
    // this is where we will put our logic for eachcycle

    requestAnimationFrame(draw);
}

draw()

...

```

let complete this getting started session with this structure, of what I will use to play with Canvas.


    .
    ├── project                 
    │   ├── kaaro.html          # the html file with <canvas>
    │   ├── kaaro.css           # Styles anyone?
    │   └── kaaro.js            # Our main JS file - with draw() function
    ├── utils                    
    │   └── kCanvas.js          # Reusable Canvas like our setupCanvas function
    └── ...                     # Anything else.. or maybe I guess this file


## Getting Comfortable
I feel all documentations should have a 'Getting Comfortable' heading, which can be optional.
For this, we build a small game. A block breaker game (pr breakout game) is recommended to be precise.

I followed along this MDN Tutorial here: https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript
Would highly recommended.
My version when I was done with this is under attempt2. I hope to work on it more.


Sidenote: By now maybe its time to address this page: https://developer.mozilla.org/en-US/docs/Web
This page is bible. Call this an assumptions, call this openions, or call this toolstack. This page is bible.

## Our Mascot: Langton's Ant
[Langton's Ant](https://en.wikipedia.org/wiki/Langton%27s_ant)

We will use Langtos's Ant to be the mascot we use to understand, and learn about Canavs. (a Ant stuck in our own personal 2D universe)

If you go on the wiki, it is a rabbit hole, but one that you would be happy to indulge in. Interestingly, I bet you will find one or more links there that you might deeply connect to (like the ones that shape who you are :P) for reasons beyond the scope of this Article. For me it was Minecraft.


For those, who smartly refrained from entering that rabbit hole, ahh, I will try an summerize for our context.

We have a huge grid, our html canvas, the Ant's universe. 
We define a starting possition for this "Ant", and then we have a set of rules for how this ant behaves in this world.
Each grid position are colored, either black or white.

Rules:
* If Ant is at White position. It will color it Black, turn 90° right, move 1 unit.
* If Ant is at Black position. It will color it White, turn 90° left,  move 1 unit.

These simple rules lead to amazing behavior which we now will simulate on our universe, the HTML Canvas.

## Simulation 1
Attempt3 - part of the repo

Let start by creating a canvas using our utils,

```
import { kCanvas } from "../utils/mycanvas.js";

var kC = new kCanvas("#myCanvas");

``` 

Next lets create a class for our Langtons ant to keep things formal.

```
class LangtonAntGrid {
    
    constructor() {
        
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

        console.log(currentStatus);
        // first update current box
        this.currentPosition.color = (this.currentPosition.color + 1)%2;
        this.grid[this.currentPosition.x][this.currentPosition.y].color = this.currentPosition.color;
        this.drawPosition(this.currentPosition);
        

        //move to next Box
        if (currentStatus.color === 0) {
            this.currentPosition.heading = (this.currentPosition.heading + 1)%4;
            console.log('right');
        } else if (currentStatus.color === 1) {
            this.currentPosition.heading = (this.currentPosition.heading + 3)%4;
            console.log('left');
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
        console.log(this.currentPosition);
        
    }

    getLog() {
        console.log(this.grid);
    }
    drawPosition(position) {
        kC.drawBlock(position.x, position.y, position.color);    
    }
}
```

Now to run it, lets create an instance and call this using our requestAnimationFrame loop.

```

var antGrid = new LangtonAntGrid();
antGrid.init(500,500);

kC.drawGrid(500,500, false);


function draw() {

    antGrid.updateGrid();
    
    requestAnimationFrame(draw);
}

draw();

```

If you are following along, now would have been the time, when you really get to simplicity and universal nature of the Ant.

Try playing around with the rules the ant can have. 
It can have more than 2 rules, more than 2 colors, and if you really up for it, more than 2 dimentions.
Updating the constructor() to introduce 2 properties and update the updateGrid() function to use these 2 properties, to make more rules possible.

```
class LangtonAntGrid {
    
    constructor() {
        this.numberOfStates = 4;
        this.stateTransitions = ['R', 'L', 'L ', 'R'];
    }
    ...
    ...
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
    ...
    ...
```


We will work on building more generic 'Turmite', but for now lets focus on our newly born Ant and more specifically on the backgound, our universe, the Canvas.

> Enter: [CanvasRenderingContext2D.globalCompositeOperation](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation)
This can be used to determine the blending mode of colors. 
introduce this line anywhere after ctx variable is loaded

```
kC.ctx.globalCompositeOperation = '<your choice!>';
```

My favoirite: mutiply
* set type as multiply, The pixels are of the top layer are multiplied with the corresponding pixel of the bottom layer. A darker picture is the result. 
* choose all the colors for the Ants color as the same.

We see progressive darkenings of the path more taken!

Note: I run a local server and then serve the js file. I use 

```
http-server .\. --cors=*
```


 [Next WebGL](https://karx.github.io/kCanvas/WebGL)