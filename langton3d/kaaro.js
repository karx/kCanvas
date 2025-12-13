// 
var antGrid;
var grid;

var colorsToBeUsed = ["#12130f","#5b9279","#eae6e5","#8fcb9b","#8f8073"];
var nextAntId = 1;

var sim = {
    running: true,
    stepsPerFrame: 1,
    pendingSingleSteps: 0,
    totalTicks: 0,
    ui: {
        lastRenderAt: 0,
        renderEveryMs: 150
    },
    stats: {
        boxesCreated: 0
    }
};

class LangtonAntGrid {
    
    constructor() {
        this.numberOfStates = 4;
        this.stateTransitions = ['L', 'L','R', 'R']; //default value
    }
    
    init(x = 20, y =20, z= 20) {
        // console.log('init Begun');
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
        // console.log('init End');
        // console.log(grid);


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
        this.id = nextAntId++;
        this.name = `Ant ${this.id}`;
        this.active = true;
        this.steps = 0;
        this.isOutOfBounds = false;
        this.lastError = '';
        this.numberOfStates = numberOfStates;
        this.stateTransitions = transition;
        this.recentSteps = [];
        this.maxRecentSteps = 12;
        this.startPosition = Object.assign({}, {
            x: start_x,
            y: start_y,
            z: start_z,
            color: 0,
            heading: 0,
            orientation: orientation
        });
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

    reset() {
        this.steps = 0;
        this.isOutOfBounds = false;
        this.lastError = '';
        this.recentSteps = [];
        this.currentPosition = Object.assign({}, this.startPosition);
    }

    colorAndupdatePosition() {
        
        // console.log('update Begun');
        const currentStatus = Object.assign({}, this.currentPosition);
        if (!this.active) return;

        if (!grid[this.currentPosition.x] || !grid[this.currentPosition.x][this.currentPosition.y] || !grid[this.currentPosition.x][this.currentPosition.y][this.currentPosition.z]) {
            this.isOutOfBounds = true;
            this.lastError = 'Out of bounds';
            return;
        }

        // If we Want it to interact with the community (no race):
        var colorFromGrid = antGrid.getColorOfGrid(this.currentPosition.x, this.currentPosition.y, this.currentPosition.z);
        var transitionToken = this.stateTransitions[currentStatus.color] || '?';
        this.currentPosition.color = (colorFromGrid + 1)%(this.numberOfStates);
        //Elese if we want it not interacting with the community (or sometimes ;P - a bug Yes)
        // this.currentPosition.color = (this.currentPosition.color + 1)%(this.numberOfStates);


        
        antGrid.colorUpdate(this.currentPosition.x, this.currentPosition.y, this.currentPosition.z, this.currentPosition.color);

        drawBox(this.currentPosition);
        
        // console.log('doneFirstBox?');

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
            // console.log("lol");
        }

        var beforeMove = Object.assign({}, this.currentPosition);
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
        var delta = {
            x: this.currentPosition.x - beforeMove.x,
            y: this.currentPosition.y - beforeMove.y,
            z: this.currentPosition.z - beforeMove.z
        };
        // console.log(this.currentPosition.x);
        if (!grid[this.currentPosition.x] || !grid[this.currentPosition.x][this.currentPosition.y] || !grid[this.currentPosition.x][this.currentPosition.y][this.currentPosition.z]) {
            this.isOutOfBounds = true;
            this.lastError = 'Out of bounds';
            this._pushRecentStep({
                token: transitionToken,
                fromState: currentStatus.color,
                toState: this.currentPosition.color,
                delta: delta,
                heading: this.currentPosition.heading
            });
            return;
        }
        // this.currentPosition.color = "#E3E3E3";
        drawBox(this.currentPosition);
        this.currentPosition.color = grid[this.currentPosition.x][this.currentPosition.y][this.currentPosition.z].color;
        // console.log("New color : " + this.currentPosition.color);

        this.steps += 1;
        this.isOutOfBounds = false;
        this.lastError = '';
        this._pushRecentStep({
            token: transitionToken,
            fromState: currentStatus.color,
            toState: colorFromGrid,
            delta: delta,
            heading: this.currentPosition.heading
        });
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

    _pushRecentStep(step) {
        this.recentSteps.unshift(step);
        if (this.recentSteps.length > this.maxRecentSteps) this.recentSteps.length = this.maxRecentSteps;
    }
    
}


antGrid = new LangtonAntGrid();
antGrid.init(100,100, 100);

var allTermites = [
    /* ---- EDIT THIS TO CUSTOMIZE THE TERMITE RULE SET -------- */

    new LangtonTermite(1,0,0,5, ['L', 'R', 'R' , 'L'], 4),
    // new LangtonTermite(20,0,20,1, ['L', 'L', 'R' , ], 3),
    // new LangtonTermite(-20,0,20,1, ['L', 'R', 'R' , ], 3),
    // new LangtonTermite(1,0,40,5, ['L', 'R' ], 2),
    // new LangtonTermite(0,0,0, 1),
    
    // new LangtonTermite(10,10,0, 5, ['L', 'L', 'R', 'R'], 4),
    // new LangtonTermite(2,10,4, 1, ['L', 'L', 'R', 'R'], 4),
    // new LangtonTermite(4,5,5, 1, ['R', 'L', 'R'], 3),
    // new LangtonTermite(-2,-7, -2, 5, ['L', 'L', 'R', 'R'], 4),

    
];
// kC.drawGrid(500,500, false);
// kC.ctx.globalCompositeOperation = 'color-burn';

allTermites.forEach((ant, index) => {
    if (ant && ant.name === `Ant ${ant.id}`) ant.name = `Ant ${index + 1}`;
});

function draw() {

    antGrid.updateGrid();

    var shouldStep = sim.running || sim.pendingSingleSteps > 0;
    if (shouldStep) {
        var stepsThisFrame = sim.running ? sim.stepsPerFrame : 1;
        for (let s = 0; s < stepsThisFrame; s++) {
            if (!sim.running && sim.pendingSingleSteps <= 0) break;
            allTermites.forEach((termite) => termite.colorAndupdatePosition());
            sim.totalTicks += 1;
            if (!sim.running) sim.pendingSingleSteps -= 1;
        }
    }

    maybeRenderHud();
    
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
        var frame = document.getElementById('mainFrame');
        if (frame) {
            frame.appendChild(newBox);
            sim.stats.boxesCreated += 1;
        }
        
    }
    
    // console.log('done A Box .');

}

function getColorFromColorIndex(colorIndex) {
    if (colorsToBeUsed[colorIndex]) return colorsToBeUsed[colorIndex];
    var hue = (colorIndex * 47) % 360;
    return `hsl(${hue}deg 55% 60%)`;
}

function setupHud() {
    var speedEl = document.getElementById('speed');
    var speedValueEl = document.getElementById('speedValue');
    var toggleEl = document.getElementById('btn-toggle');
    var stepEl = document.getElementById('btn-step');
    var resetEl = document.getElementById('btn-reset');
    var antListEl = document.getElementById('antList');
    var antCountEl = document.getElementById('antCount');
    var simStatusEl = document.getElementById('simStatus');
    var spawnFormEl = document.getElementById('spawnForm');
    var spawnErrorEl = document.getElementById('spawnError');
    var toggleSpawnEl = document.getElementById('btn-toggle-spawn');

    if (!speedEl || !toggleEl || !stepEl || !resetEl || !antListEl || !antCountEl || !simStatusEl || !spawnFormEl || !spawnErrorEl || !toggleSpawnEl) {
        return;
    }

    function syncSpeedUi() {
        speedValueEl.textContent = `${sim.stepsPerFrame}`;
    }

    speedEl.addEventListener('input', (event) => {
        var next = Number(event.target.value);
        sim.stepsPerFrame = Math.max(1, Math.min(30, Number.isFinite(next) ? next : 1));
        syncSpeedUi();
    });

    toggleEl.addEventListener('click', () => {
        sim.running = !sim.running;
        renderHud(true);
    });

    stepEl.addEventListener('click', () => {
        sim.pendingSingleSteps += 1;
        sim.running = false;
        renderHud(true);
    });

    resetEl.addEventListener('click', () => {
        resetSimulation();
        renderHud(true);
    });

    toggleSpawnEl.addEventListener('click', () => {
        spawnFormEl.classList.toggle('is-open');
    });

    spawnFormEl.addEventListener('submit', (event) => {
        event.preventDefault();
        spawnErrorEl.textContent = '';

        var name = (document.getElementById('spawnName')?.value || '').trim();
        var x = Number(document.getElementById('spawnX')?.value || 0);
        var y = Number(document.getElementById('spawnY')?.value || 0);
        var z = Number(document.getElementById('spawnZ')?.value || 0);
        var orientation = Number(document.getElementById('spawnOrientation')?.value || 5);
        var ruleStr = (document.getElementById('spawnRule')?.value || '').trim();

        try {
            spawnAnt({
                name: name,
                x: x,
                y: y,
                z: z,
                orientation: orientation,
                rule: ruleStr
            });
            spawnFormEl.reset();
            var ruleEl = document.getElementById('spawnRule');
            if (ruleEl) ruleEl.value = 'L R R L';
            spawnFormEl.classList.remove('is-open');
            renderHud(true);
        } catch (err) {
            spawnErrorEl.textContent = err && err.message ? err.message : 'Failed to spawn ant';
        }
    });

    antListEl.addEventListener('click', (event) => {
        var target = event.target;
        if (!target) return;
        var action = target.getAttribute('data-action');
        var antId = Number(target.getAttribute('data-ant-id'));
        if (!action || !Number.isFinite(antId)) return;

        var ant = allTermites.find(a => a.id === antId);
        if (!ant) return;

        if (action === 'toggle') {
            ant.active = !ant.active;
            renderHud(true);
        } else if (action === 'remove') {
            allTermites = allTermites.filter(a => a.id !== antId);
            renderHud(true);
        } else if (action === 'focus') {
            var rig = document.getElementById('rig');
            if (rig) rig.setAttribute('position', `${ant.currentPosition.x} ${ant.currentPosition.y} ${ant.currentPosition.z + 20}`);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.defaultPrevented) return;
        var tag = (event.target && event.target.tagName) ? event.target.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

        if (event.code === 'Space') {
            event.preventDefault();
            sim.running = !sim.running;
            renderHud(true);
        } else if (event.key === 'n' || event.key === 'N') {
            sim.pendingSingleSteps += 1;
            sim.running = false;
            renderHud(true);
        } else if (event.key === 'r' || event.key === 'R') {
            resetSimulation();
            renderHud(true);
        }
    });

    function renderHud(force) {
        var now = Date.now();
        sim.ui.lastRenderAt = force ? 0 : sim.ui.lastRenderAt;
        maybeRenderHud(now);
    }

    syncSpeedUi();
    renderHud(true);
}

function maybeRenderHud(nowOverride) {
    var now = Number.isFinite(nowOverride) ? nowOverride : Date.now();
    if (now - sim.ui.lastRenderAt < sim.ui.renderEveryMs) return;
    sim.ui.lastRenderAt = now;

    var antListEl = document.getElementById('antList');
    var antCountEl = document.getElementById('antCount');
    var simStatusEl = document.getElementById('simStatus');
    var toggleEl = document.getElementById('btn-toggle');
    var speedValueEl = document.getElementById('speedValue');
    if (!antListEl || !antCountEl || !simStatusEl || !toggleEl || !speedValueEl) return;

    antCountEl.textContent = `${allTermites.length}`;
    toggleEl.textContent = sim.running ? 'Pause' : 'Play';
    speedValueEl.textContent = `${sim.stepsPerFrame}`;

    var liveCount = allTermites.filter(a => a.active).length;
    simStatusEl.textContent = `${sim.running ? 'Running' : 'Paused'} • ${liveCount}/${allTermites.length} live • ticks ${sim.totalTicks} • boxes ${sim.stats.boxesCreated}`;

    antListEl.innerHTML = allTermites.map((ant) => {
        var pos = ant.currentPosition;
        var move = ant.recentSteps[0]?.delta ? ant.recentSteps[0].delta : {x:0,y:0,z:0};
        var lastToken = ant.recentSteps[0]?.token || '';
        var heading = headingLabel(ant);
        var status = ant.isOutOfBounds ? `stopped (${ant.lastError})` : (ant.active ? 'live' : 'paused');
        var recent = ant.recentSteps.slice(0, 6).reverse();
        var recentHtml = recent.map((s) => {
            var c = getColorFromColorIndex(s.fromState || 0);
            var vec = formatDelta(s.delta);
            return `<span class="antToken" style="border-color: rgba(255,255,255,0.10); background: rgba(255,255,255,0.06); color:${c}" title="${s.token} ${vec}">${escapeHtml(s.token)}</span>`;
        }).join('');
        var ruleHtml = ant.stateTransitions.map((t, i) => {
            var c = getColorFromColorIndex(i);
            return `<span class="antToken" style="color:${c}" title="state ${i}">${escapeHtml(t)}</span>`;
        }).join('');

        return `
        <div class="antCard" data-ant-id="${ant.id}">
            <div class="antCard__top">
                <div class="antCard__name" title="${escapeHtml(ant.name)}">${escapeHtml(ant.name)}</div>
                <div style="display:flex; gap:6px; align-items:center;">
                    <button class="hud__btn" data-action="focus" data-ant-id="${ant.id}" type="button" title="Move camera rig near this ant">Focus</button>
                    <button class="hud__btn" data-action="toggle" data-ant-id="${ant.id}" type="button">${ant.active ? 'Pause' : 'Resume'}</button>
                    <button class="hud__btn hud__btn--danger" data-action="remove" data-ant-id="${ant.id}" type="button">Remove</button>
                </div>
            </div>
            <div class="antCard__meta">
                <div>Steps: ${ant.steps}</div>
                <div>Status: ${escapeHtml(status)}</div>
                <div>Pos: ${pos.x}, ${pos.y}, ${pos.z}</div>
                <div>Move: ${formatDelta(move)} ${lastToken ? `• ${escapeHtml(lastToken)}` : ''}</div>
                <div>Heading: ${escapeHtml(heading)}</div>
                <div>States: ${ant.numberOfStates}</div>
            </div>
            <div class="antCard__rule" title="Recent steps">${recentHtml || '<span style=\"opacity:0.7\">No steps yet</span>'}</div>
            <div class="antCard__rule" title="Rule table">${ruleHtml}</div>
        </div>`;
    }).join('');
}

function spawnAnt(config) {
    var name = (config.name || '').trim();
    var x = Number(config.x);
    var y = Number(config.y);
    var z = Number(config.z);
    var orientation = Number(config.orientation);
    var rule = (config.rule || '').trim();

    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) throw new Error('Start position must be numbers');
    if (!Number.isFinite(orientation)) orientation = 5;
    if (!rule) throw new Error('Rule is required (example: "L R")');

    var transitions = parseRuleString(rule);
    if (transitions.length < 2) throw new Error('Rule needs at least 2 tokens (example: "L R")');
    transitions.forEach((t) => {
        if (!['L', 'R', 'U'].includes(t)) throw new Error(`Unsupported token "${t}" (allowed: L, R, U)`);
    });

    var ant = new LangtonTermite(x, y, z, orientation, transitions, transitions.length);
    if (name) ant.name = name;

    allTermites.push(ant);
    return ant;
}

function resetSimulation() {
    sim.pendingSingleSteps = 0;
    sim.totalTicks = 0;
    sim.stats.boxesCreated = 0;

    document.querySelectorAll('[id^="kLang-3d-"]').forEach((node) => node.remove());
    antGrid.init(100, 100, 100);
    allTermites.forEach((ant) => ant.reset());
}

function parseRuleString(text) {
    return String(text)
        .replace(/,/g, ' ')
        .split(/\s+/g)
        .map((t) => t.trim().toUpperCase())
        .filter(Boolean);
}

function formatDelta(delta) {
    if (!delta) return '(0,0,0)';
    return `(${delta.x || 0},${delta.y || 0},${delta.z || 0})`;
}

function headingLabel(ant) {
    var orientation = ant?.currentPosition?.orientation;
    var heading = ant?.currentPosition?.heading;
    if (!Number.isFinite(heading)) return '?';
    var primaryNeg = '-Y';
    var secondaryPos = '+X';
    var primaryPos = '+Y';
    var secondaryNeg = '-X';

    if (orientation === 1) {
        secondaryPos = '+Z';
        secondaryNeg = '-Z';
    }

    switch (heading) {
        case 0: return primaryNeg;
        case 1: return secondaryPos;
        case 2: return primaryPos;
        case 3: return secondaryNeg;
        default: return '?';
    }
}

function escapeHtml(input) {
    return String(input)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

setupHud();
