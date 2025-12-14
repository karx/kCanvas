//
var antGrid;
var grid;

var colorsToBeUsed = [..."324683-8c916f-486084-11160f-8c916f".split('-').map(x => `#${x}`)];

class LangtonAntGrid {
  constructor() {
    this.numberOfStates = 4;
    this.stateTransitions = ["L", "L", "R", "R"]; //default value
  }

  init(x = 20, y = 20, z = 20) {
    // console.log("init Begun");
    grid = [];
    this.max_x = x;
    this.max_y = y;
    this.max_z = z;
    this.currentPosition = Object.assign(
      {},
      {
        x: 0,
        y: 0,
        z: 0,
        color: 0,
        heading: 0,
        orientation: 5,
      }
    );
    for (let i = -x; i < x; i++) {
      grid[i] = [];
      for (let j = -y; j < y; j++) {
        grid[i][j] = [];
        for (let k = -z; k < z; k++) {
          grid[i][j][k] = Object.assign(
            {},
            {
              color: 0,
            }
          );
        }
      }
    }
    console.log("init End");
    console.log(grid);
  }
  updateGrid() {}

  colorUpdate(x, y, z, colorIndex) {
    grid[x][y][z].color = colorIndex;
  }

  getColorOfGrid(x, y, z) {
    return grid[x][y][z].color;
  }

  getLog() {
    console.log(grid);
  }
  drawPosition(position) {}
}

class LangtonTermite {
  constructor(
    start_x,
    start_y,
    start_z,
    transition = ["R1", "R2", "N", "U", "R2", "R1", "L2"],
    plane = "z",
    heading = "+x"
  ) {
    this.numberOfStates = transition.length;
    this.stateTransitions = transition;
    this.currentPosition = Object.assign(
      {},
      {
        x: start_x,
        y: start_y,
        z: start_z,
        color: 0, // This is the state Value. We simply keep adding +1
        heading: heading,
        plane: plane,
      }
    );
    this.age = 0;
  }

  init() {}

  colorAndupdatePosition() {
    // console.log("update Begun");
    this.age++;
    const currentStatus = Object.assign({}, this.currentPosition);

    //checks if there is something on the grid. I.E undefined checks.
    if (
      !grid[this.currentPosition.x] ||
      !grid[this.currentPosition.x][this.currentPosition.y] ||
      !grid[this.currentPosition.x][this.currentPosition.y][
        this.currentPosition.z
      ]
    )
      return;

    // If we Want it to interact with the community (no race):
    var colorFromGrid = antGrid.getColorOfGrid(
      this.currentPosition.x,
      this.currentPosition.y,
      this.currentPosition.z
    );

    this.currentPosition.color = (colorFromGrid + 1) % this.numberOfStates;
    // console.log(`## ${this.numberOfStates}`);
    // console.log(
    //   `## Color From grid at (${this.currentPosition.x}, ${this.currentPosition.y}, ${this.currentPosition.z}) = ${colorFromGrid}`
    // );
    // console.log(
    //   `## New Color AT (${this.currentPosition.x}, ${this.currentPosition.y}, ${this.currentPosition.z}) = ${this.currentPosition.color}`
    // );

    //Elese if we want it not interacting with the community (or sometimes ;P - a bug Yes)
    // this.currentPosition.color = (this.currentPosition.color + 1)%(this.numberOfStates);

    antGrid.colorUpdate(
      this.currentPosition.x,
      this.currentPosition.y,
      this.currentPosition.z,
      this.currentPosition.color
    );

    drawBox(this.currentPosition);

    console.log("doneFirstBox?");

    //move to next Box
    // getNextHeadingFromColorAndHeading(this.currentStatus)

    let nextTransitionStep = this.stateTransitions[currentStatus.color];
    let toAppendVector = [0, 0, 0];
    let calcData = calculateNextVectorAndHeading(
      nextTransitionStep,
      this.currentPosition.heading,
      this.currentPosition.plane
    );
    // console.log({ calcData });
    toAppendVector = calcData.newheadingVector;
    this.currentPosition.heading = calcData.newHeading;

    this.currentPosition.x += toAppendVector[0];
    this.currentPosition.y += toAppendVector[1];
    this.currentPosition.z += toAppendVector[2];

    // console.log(this.currentPosition);

    //Stright up Undefined check
    if (
      !grid[this.currentPosition.x] ||
      !grid[this.currentPosition.x][this.currentPosition.y] ||
      !grid[this.currentPosition.x][this.currentPosition.y][
        this.currentPosition.z
      ]
    )
      return;

    // this.currentPosition.color = "#E3E3E3";
    drawBox(this.currentPosition);
    this.currentPosition.color =
      grid[this.currentPosition.x][this.currentPosition.y][
        this.currentPosition.z
      ].color;
    // console.log("New color : " + this.currentPosition.color);
  }
}

antGrid = new LangtonAntGrid();
antGrid.init(90, 90, 90);

var allTermites = [
  /* ---- EDIT THIS TO CUSTOMIZE THE TERMITE RULE SET -------- */

  // new LangtonTermite(1, 0, 4, ["L", "R"]),
  // new LangtonTermite(0, 0, 0, ["R1", "R2", "N", "U", "R2", "R1", "L2"], 'xyz'),
//   new LangtonTermite(0, 0, 0, ["L", "R"], 'xyz'),
  // new LangtonTermite(0,0,0, 1),
];
// kC.drawGrid(500,500, false);
// kC.ctx.globalCompositeOperation = 'color-burn';

function draw() {
  antGrid.updateGrid();
  allTermites.forEach((termite) => {
    termite.colorAndupdatePosition();
  });

//   setTimeout(() => {
//     requestAnimationFrame(draw);
//   }, 1000);
    requestAnimationFrame(draw);
}

function drawBox(position) {
  if (
    !grid[position.x] ||
    !grid[position.x][position.y] ||
    !grid[position.x][position.y][position.z]
  )
    return;
  if (grid[position.x][position.y][position.z].ent) {
    var oldBox = grid[position.x][position.y][position.z].ent;
    // var scale = grid[position.x][position.y][position.z].scale * 0.85;
    var scale = 0;
    grid[position.x][position.y][position.z].scale = scale;

    // document.getElementById(`kLang-3d-${position.x}-${position.y}-${position.z}`);

    oldBox.setAttribute("color", getColorFromColorIndex(position.color));

    oldBox.setAttribute("scale", `${1 - scale} ${1 - scale} ${1 - scale}`);
  } else {
    var newBox = document.createElement("a-box");
    var scale = 0.85;
    newBox.setAttribute(
      "position",
      `${position.x} ${position.y} ${position.z}`
    );
    newBox.setAttribute("scale", `${1 - scale} ${1 - scale} ${1 - scale}`);
    newBox.setAttribute("color", getColorFromColorIndex(position.color));
    newBox.setAttribute(
      "id",
      `kLang-3d-${position.x}-${position.y}-${position.z}`
    );
    grid[position.x][position.y][position.z].scale = scale;
    grid[position.x][position.y][position.z].ent = newBox;
    document.getElementById("mainFrame").appendChild(newBox);
  }

  // console.log("done A Box .");
}

function getColorFromColorIndex(colorIndex) {
  colorIndex = colorIndex%colorsToBeUsed.length;
  return colorsToBeUsed[colorIndex];
}

function calculateNextVectorAndHeading(
  direction = "L",
  heading = "+x",
  plane = "z"
) {
  //should return toAppendVector

  // In plane z=0:
  //given +x -> 0 1 0
  //given +y -> -1 0 0
  //given -x -> 0 -1  0
  //given -y -> 1 0 0
  //given +x -> 0 1 0

  // p[0] === p.x
  // plane could be x , y , z or xyz

  let currentHeadingVector = getHeadingVectorFromDirection(direction); //[1, 0, 0] +x

  let inc = 0;
  let newHeading = "+x";
  let newheadingVector = [1, 0, 0];
  let headingOffSet = 0;

  // console.log(
  //   `For Direction ${direction}, heading towards: ${heading} on the plane ${plane}=0`
  // );
  //First the default Inc Would be mostly same

  let simRotation;
  switch (direction) {
    case "L":
      inc = 1;
      break;
    case "L2":
      inc = 2;
      break;
    case "U":
      inc = 2;
      break;
    case "R":
      inc = 3;
      break;
    case "R2":
      inc = 2;
      break;
    case "N":
      inc = 0;
      break;
  }

  switch (plane) {
    case "x":
      switch (heading) {
        case "+y":
          headingOffset = 0;
          break;
        case "-z":
          headingOffset = 1;
          break;
        case "-y":
          headingOffset = 2;
          break;
        case "+z":
          headingOffset = 3;
          break;
      }

      simRotation = _2dRotationHeading(inc + headingOffSet);
      newheadingVector = [simRotation[1], simRotation[2], simRotation[0]];
      newHeading = getDirectionFromHeading(newheadingVector);
      break;

    case "y":
      switch (heading) {
        case "+x":
          headingOffset = 0;
          break;
        case "-z":
          headingOffset = 1;
          break;
        case "-x":
          headingOffset = 2;
          break;
        case "+z":
          headingOffset = 3;
          break;
      }

      simRotation = _2dRotationHeading(inc + headingOffSet);
      newheadingVector = [simRotation[0], simRotation[2], simRotation[1]];
      newHeading = getDirectionFromHeading(newheadingVector);
      break;

    case "z":
      switch (heading) {
        case "+x":
          inc += 0;
          break;
        case "-y":
          inc += 1;
          break;
        case "-x":
          inc += 2;
          break;
        case "+y":
          inc += 3;
          // console.log("Setting Heading Offset to +y as expected");
          break;
        default:
          console.log(
            `!! Warining: Heading Direction ${heading} did not match Any Case`
          );
      }
      // console.log({ inc, headingOffSet });
      simRotation = _2dRotationHeading(inc + headingOffSet);
      newheadingVector = [simRotation[0], simRotation[1], simRotation[2]];
      newHeading = getDirectionFromHeading(newheadingVector);
      break;

    case "xyz":
      switch (direction) {
          //"R1", "R2", "N", "U", "R2", "R1", "L2
        case "L1":
          inc = 1;
          break;
        case "L2":
          inc = 2;
          break;
        case "U":
          inc = 3;
          break;
        case "R1":
          inc = 5;
          break;
        case "R2":
          inc = 4;
          break;
        case "N":
          inc = 0;
          break;
      }
      switch (heading) {
        case "+x":
          inc += 0;
          break;
        case "-y":
          inc += 5;
          break;
        case "+z":
          inc += 4;
          break;
        case "-x":
          inc += 3;
          break;
        case "+y":
          inc += 2;
          break;
        case "-z":
          inc += 1;
          break;

        default:
          console.log(
            `!! Warining: Heading Direction ${heading} did not match Any Case`
          );
      }
      simRotation = _3dRotationHeading(inc + headingOffSet);
      newheadingVector = [simRotation[0], simRotation[1], simRotation[2]];
      newHeading = getDirectionFromHeading3d(newheadingVector);
      break;

    default:
      break;
  }
  // console.log({ newHeading, newheadingVector });
  return { newHeading, newheadingVector };
}

function getHeadingVectorFromDirection(direction) {
  switch (direction) {
    case "+x":
      return [1, 0, 0];
    case "-y":
      return [0, -1, 0];
      break;
    case "-x":
      return [-1, 0, 0];
      break;
    case "+y":
      return [0, 1, 0];
      break;
  }
}

function getDirectionFromHeading(heading) {
  let headingString = heading.reduce((a, c) => a + "" + c);
  switch (headingString) {
    case "100":
      return "+x";
    case "0-10":
      return "-y";
      break;
    case "-100":
      return "-x";
      break;
    case "010":
      return "+y";
      break;
  }
}

function _2dRotationHeading(inc) {
  // console.log("** Running Sim with " + inc);
  //this does assuming always on xy plane pointing +x
  let newheadingVector;
  inc = inc % 4;
  switch (inc + "") {
    case "1":
      newheadingVector = [0, -1, 0];
      break;
    case "2":
      newheadingVector = [-1, 0, 0];
      break;
    case "3":
      newheadingVector = [0, 1, 0];
      break;
    case "0":
      newheadingVector = [1, 0, 0];
      break;

    default:
      console.log("Hit None");
  }
  return newheadingVector;
}

function _3dRotationHeading(inc) {
  // console.log("** Running Sim with " + inc);
  //this does assuming always on xy plane pointing +x
  let newheadingVector;
  inc = inc % 6;
  switch (inc + "") {
    case "1":
      newheadingVector = [0, -1, 1];
      break;
    case "2":
      newheadingVector = [-1, 0, 1];
      break;
    case "3":
      newheadingVector = [-1, 1, 0];
      break;
    case "4":
      newheadingVector = [0, 1, -1];
      break;
    case "5":
      newheadingVector = [1, 0, -1];
      break;

    case "0":
      newheadingVector = [1, -1, 0];
      break;

    default:
      console.log("Hit None");
  }
  return newheadingVector;
}

function getDirectionFromHeading3d(heading) {
    let headingString = heading.reduce((a, c) => a + "" + c);
    switch (headingString) {
      case "1-10":
        return "+x";
    case "0-11":
        return "-z";
    case "-101":
        return "+y";
    case "-110":
        return "-x";
    case "01-1":
        return "+z";
    case "10-1":
        return "-y";
    }
  }
  

//Custom Input
document.getElementById('input-rules').addEventListener('keyup', (event) => {
  if(event.key === 'Enter' && event.target.value !== '') {
    let termiteString = event.target.value;
    let termiteTrasitions = termiteString.toUpperCase().split(' ');
    allTermites.push(
      new LangtonTermite(0, 0, 0, termiteTrasitions, 'xyz')
    );

    console.log({allTermites});
    updateCurrentAntListDOM();
    event.target.value = '';
  }
})
document.addEventListener('keyup', event => {
  if(event.key === 'I') {
    let  inputContainer = document.getElementById('input-container');
    let isShow = inputContainer.style.display;
    if (isShow === "none") {
      inputContainer.style.display = 'flex';
    } else {
      inputContainer.style.display = 'none';
    }
    console.log({isShow});
  }
})

function updateCurrentAntListDOM() {
  let antListHTML = `<ul>`;
  allTermites.forEach(ant => {
    let eachAntDOM = ``;
    console.log(ant);
    ant.stateTransitions.forEach((transitionVal, i) => {
      eachAntDOM += `<span style="color:${getColorFromColorIndex(i)}"> ${transitionVal} </span>`;
    });
    antListHTML += `<li> ${eachAntDOM} </li>`;
  });
  antListHTML += `</ul>`;

  document.getElementById('currentAnts').innerHTML = antListHTML;
}


updateCurrentAntListDOM();

draw();

  