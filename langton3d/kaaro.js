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
    spawnQueue: [],
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
        this._cells = new Map();
    }
    
    init(x = 20, y =20, z= 20) {
        x = Number(x);
        y = Number(y);
        z = Number(z);
        if (!Number.isFinite(x) || x < 1) x = 20;
        if (!Number.isFinite(y) || y < 1) y = 20;
        if (!Number.isFinite(z) || z < 1) z = 20;
        this._cells = new Map();
        grid = this._cells; // legacy global for debugging
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
    }
    updateGrid() {
        
    }

    isInBounds(x, y, z) {
        if (!Number.isFinite(Number(x)) || !Number.isFinite(Number(y)) || !Number.isFinite(Number(z))) return false;
        return (x >= -this.max_x && x < this.max_x) &&
            (y >= -this.max_y && y < this.max_y) &&
            (z >= -this.max_z && z < this.max_z);
    }

    _ensureCell(x, y, z) {
        if (!this.isInBounds(x, y, z)) return null;
        var xMap = this._cells.get(x);
        if (!xMap) {
            xMap = new Map();
            this._cells.set(x, xMap);
        }
        var yMap = xMap.get(y);
        if (!yMap) {
            yMap = new Map();
            xMap.set(y, yMap);
        }
        var cell = yMap.get(z);
        if (!cell) {
            cell = {
                color: null,
                stateIndex: 0,
                ownerId: null,
                ent: null,
                scale: 0.85
            };
            yMap.set(z, cell);
        }
        return cell;
    }

    setCell(x, y, z, stateIndex, colorHex, ownerId) {
        var cell = this._ensureCell(Number(x), Number(y), Number(z));
        if (!cell) return;
        if (Number.isFinite(Number(stateIndex))) cell.stateIndex = Number(stateIndex);
        if (typeof colorHex === 'string') cell.color = colorHex;
        if (Number.isFinite(Number(ownerId))) cell.ownerId = Number(ownerId);
    }

    getCell(x, y, z) {
        return this._ensureCell(Number(x), Number(y), Number(z));
    }

    // Back-compat helpers (not used by the sim anymore)
    colorUpdate(x, y, z, colorHex) {
        var cell = this.getCell(x, y, z);
        this.setCell(x, y, z, cell?.stateIndex ?? 0, colorHex, cell?.ownerId ?? null);
    }

    getColorOfGrid(x, y, z) {
        return this.getCell(x, y, z)?.color ?? null;
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
        this.baseHue = 210;
        this.stateColors = generatePaletteFromHue(this.baseHue, numberOfStates);
        this.spawnAtTick = 0;
        this.bornAtTick = 0;
        this.numberOfStates = numberOfStates;
        this.stateTransitions = transition;
        this.recentSteps = [];
        this.maxRecentSteps = 12;
        this.startPosition = Object.assign({}, {
            x: start_x,
            y: start_y,
            z: start_z,
            color: null,
            stateIndex: 0,
            heading: 0,
            orientation: orientation
        });
        this.currentPosition = Object.assign({}, {
            x: start_x,
            y: start_y,
            z: start_z,
            color: null,
            stateIndex: 0,
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

        if (!antGrid.isInBounds(this.currentPosition.x, this.currentPosition.y, this.currentPosition.z)) {
            this.isOutOfBounds = true;
            this.lastError = 'Out of bounds';
            return;
        }

        // Multi-ant interaction uses shared per-cell stateIndex (color is only display).
        var cell = antGrid.getCell(this.currentPosition.x, this.currentPosition.y, this.currentPosition.z);
        var currentStateIndex = Number(cell?.stateIndex ?? 0);
        if (!Number.isFinite(currentStateIndex)) currentStateIndex = 0;
        if (currentStateIndex < 0) currentStateIndex = 0;
        currentStateIndex = currentStateIndex % this.numberOfStates;
        this.currentPosition.stateIndex = currentStateIndex;
        var transitionToken = this.stateTransitions[currentStateIndex] || '?';
        var nextStateIndex = (currentStateIndex + 1)%(this.numberOfStates);
        var nextColor = this.stateColors[nextStateIndex] || this.stateColors[0] || colorsToBeUsed[0];
        this.currentPosition.color = nextColor;
        //Elese if we want it not interacting with the community (or sometimes ;P - a bug Yes)
        // this.currentPosition.color = (this.currentPosition.color + 1)%(this.numberOfStates);


        
        antGrid.setCell(this.currentPosition.x, this.currentPosition.y, this.currentPosition.z, nextStateIndex, nextColor, this.id);

        drawBox(this.currentPosition);
        
        // console.log('doneFirstBox?');

        //move to next Box
        // getNextHeadingFromColorAndHeading(this.currentStatus)


        if(this.stateTransitions[currentStateIndex] === 'L') {
            this.currentPosition.heading = (this.currentPosition.heading + 1)%4;
            // console.log('right');
        } else if (this.stateTransitions[currentStateIndex] === 'R') {
            this.currentPosition.heading = (this.currentPosition.heading + 3)%4;
            // console.log('left');
        } else if (this.stateTransitions[currentStateIndex] === 'U') {
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
        if (!antGrid.isInBounds(this.currentPosition.x, this.currentPosition.y, this.currentPosition.z)) {
            this.isOutOfBounds = true;
            this.lastError = 'Out of bounds';
            this._pushRecentStep({
                token: transitionToken,
                fromState: currentStateIndex,
                toState: nextStateIndex,
                delta: delta,
                heading: this.currentPosition.heading
            });
            return;
        }
        // this.currentPosition.color = "#E3E3E3";
        drawBox(this.currentPosition);
        var nextCell = antGrid.getCell(this.currentPosition.x, this.currentPosition.y, this.currentPosition.z);
        var nextIdx = Number(nextCell?.stateIndex ?? 0);
        if (!Number.isFinite(nextIdx)) nextIdx = 0;
        if (nextIdx < 0) nextIdx = 0;
        nextIdx = nextIdx % this.numberOfStates;
        this.currentPosition.stateIndex = nextIdx;
        this.currentPosition.color = nextCell?.color ?? null;
        // console.log("New color : " + this.currentPosition.color);

        this.steps += 1;
        this.isOutOfBounds = false;
        this.lastError = '';
        this._pushRecentStep({
            token: transitionToken,
            fromState: currentStateIndex,
            toState: nextStateIndex,
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

    flushSpawnQueue();

    var shouldStep = sim.running || sim.pendingSingleSteps > 0;
    if (shouldStep) {
        var stepsThisFrame = sim.running ? sim.stepsPerFrame : 1;
        for (let s = 0; s < stepsThisFrame; s++) {
            if (!sim.running && sim.pendingSingleSteps <= 0) break;
            allTermites.forEach((termite) => termite.colorAndupdatePosition());
            sim.totalTicks += 1;
            flushSpawnQueue();
            if (!sim.running) sim.pendingSingleSteps -= 1;
        }
    }

    maybeRenderHud();
    
    requestAnimationFrame(draw);
}

function drawBox(position) {
    if (!antGrid.isInBounds(position.x, position.y, position.z)) return;
    var cell = antGrid.getCell(position.x, position.y, position.z);
    if (!cell) return;
    var cellColor = cell.color || colorsToBeUsed[0];
    if (cell.ent)
    {
        var oldBox = cell.ent;
        var scale = (Number(cell.scale) || 0.85) * 0.85;
        cell.scale = scale;

        // document.getElementById(`kLang-3d-${position.x}-${position.y}-${position.z}`);
        
        oldBox.setAttribute('color', cellColor);

        oldBox.setAttribute('scale', `${1-scale} ${1-scale} ${1-scale}`);
    }
    else {
        var newBox = document.createElement('a-box');
        var scale = 0.85;
        newBox.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
        newBox.setAttribute('scale', `${1-scale} ${1-scale} ${1-scale}`);
        newBox.setAttribute('color', cellColor);
        newBox.setAttribute('id',`kLang-3d-${position.x}-${position.y}-${position.z}`);
        cell.scale = scale;
        cell.ent = newBox;
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

function getAntColorForState(ant, stateIndex) {
    var palette = ant?.stateColors;
    if (Array.isArray(palette) && palette[stateIndex]) return palette[stateIndex];
    return getColorFromColorIndex(stateIndex);
}

function generatePaletteFromHue(baseHue, count) {
    var c = Number(count);
    if (!Number.isFinite(c) || c < 2) c = 2;
    var hue = Number(baseHue);
    if (!Number.isFinite(hue)) hue = 210;
    hue = ((hue % 360) + 360) % 360;
    var palette = [];
    for (let i = 0; i < c; i++) {
        var h = (hue + i * 40) % 360;
        palette.push(hslToHex(h, 62, 60));
    }
    return palette;
}

function hslToHex(h, s, l) {
    var _s = s / 100;
    var _l = l / 100;
    var c = (1 - Math.abs(2 * _l - 1)) * _s;
    var x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    var m = _l - c / 2;
    var r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    var rr = Math.round((r + m) * 255);
    var gg = Math.round((g + m) * 255);
    var bb = Math.round((b + m) * 255);
    return `#${toHex2(rr)}${toHex2(gg)}${toHex2(bb)}`;
}

function toHex2(n) {
    var v = Math.max(0, Math.min(255, Number(n) || 0));
    return v.toString(16).padStart(2, '0');
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
    var snapshotEl = document.getElementById('btn-snapshot');
    var fullscreenEl = document.getElementById('btn-fullscreen');
    var colorsEl = document.getElementById('spawnColors');

    // Share/import panel (optional)
    var sharePanelBtnEl = document.getElementById('btn-sharepanel');
    var sharePanelEl = document.getElementById('sharePanel');
    var shareUrlEl = document.getElementById('shareUrl');
    var copyShareEl = document.getElementById('btn-copy-share');
    var loadPresetEl = document.getElementById('loadPreset');
    var loadPresetBtnEl = document.getElementById('btn-load-preset');
    var presetListEl = document.getElementById('presetList');

    // Help modal (optional)
    var helpBtnEl = document.getElementById('btn-help');
    var helpModalEl = document.getElementById('helpModal');
    var helpCloseEl = document.getElementById('btn-close-help');
    var helpDontShowEl = document.getElementById('helpDontShow');

    // Core UI required
    if (!speedEl || !toggleEl || !stepEl || !resetEl || !antListEl || !antCountEl || !simStatusEl || !spawnFormEl || !spawnErrorEl || !toggleSpawnEl || !snapshotEl || !colorsEl) {
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

    snapshotEl.addEventListener('click', async () => {
        var shareUrl = buildShareUrl();
        try {
            var didEnter = await maybeEnterFullscreenForShare();
            await delay(90);
            var file = await captureSceneSnapshotFile('langton3d.png');
            if (navigator.share && file) {
                await navigator.share({
                    title: 'Langton 3D',
                    text: 'Langton 3D snapshot + preset',
                    url: shareUrl,
                    files: [file]
                });
                await maybeExitFullscreenAfterShare(didEnter);
                return;
            }
            if (file) {
                downloadFile(file, 'langton3d.png');
                await copyTextToClipboard(shareUrl);
                snapshotEl.textContent = 'Downloaded';
                setTimeout(() => { snapshotEl.textContent = 'Snapshot'; }, 900);
                await maybeExitFullscreenAfterShare(didEnter);
                return;
            }
            await maybeExitFullscreenAfterShare(didEnter);
            console.warn('Snapshot capture failed; preset URL:', shareUrl);
        } catch (err) {
            console.warn('Snapshot failed', err);
            await maybeExitFullscreenAfterShare(false);
            console.warn('Preset URL:', shareUrl);
        }
    });

    function syncFullscreenUi() {
        if (!fullscreenEl) return;
        fullscreenEl.textContent = getFullscreenElement() ? 'Exit Fullscreen' : 'Fullscreen';
    }

    if (fullscreenEl) {
        fullscreenEl.addEventListener('click', async () => {
            try {
                if (getFullscreenElement()) await exitFullscreen();
                else await requestFullscreenForScene();
            } catch (err) {
                console.warn('Fullscreen toggle failed', err);
            } finally {
                syncFullscreenUi();
            }
        });
        document.addEventListener('fullscreenchange', syncFullscreenUi);
        syncFullscreenUi();
    }

    function toggleSharePanel(forceOpen) {
        if (!sharePanelEl) return;
        var shouldOpen = (typeof forceOpen === 'boolean') ? forceOpen : !sharePanelEl.classList.contains('is-open');
        if (shouldOpen) {
            sharePanelEl.classList.add('is-open');
            sharePanelEl.setAttribute('aria-hidden', 'false');
            if (shareUrlEl) shareUrlEl.value = buildShareUrl();
        } else {
            sharePanelEl.classList.remove('is-open');
            sharePanelEl.setAttribute('aria-hidden', 'true');
        }
    }

    if (sharePanelBtnEl) {
        sharePanelBtnEl.addEventListener('click', () => toggleSharePanel());
    }

    if (copyShareEl && shareUrlEl) {
        copyShareEl.addEventListener('click', async () => {
            var url = buildShareUrl();
            var ok = await copyTextToClipboard(url);
            if (ok) {
                copyShareEl.textContent = 'Copied';
                setTimeout(() => { copyShareEl.textContent = 'Copy'; }, 900);
                shareUrlEl.value = url;
            } else {
                copyShareEl.textContent = 'Copy failed';
                setTimeout(() => { copyShareEl.textContent = 'Copy'; }, 1200);
            }
        });
    }

    if (loadPresetBtnEl && loadPresetEl) {
        loadPresetBtnEl.addEventListener('click', async () => {
            var raw = (loadPresetEl.value || '').trim();
            if (!raw) return;
            try {
                await applyPresetFromInput(raw);
                loadPresetEl.value = '';
                toggleSharePanel(true);
                if (shareUrlEl) shareUrlEl.value = buildShareUrl();
            } catch (err) {
                console.warn('Preset load failed', err);
            }
        });
        loadPresetEl.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                loadPresetBtnEl.click();
            }
        });
    }

    if (presetListEl) {
        var presets = buildCuratedPresets();
        presetListEl.innerHTML = renderPresetGalleryHtml(presets);
        presetListEl.addEventListener('click', async (event) => {
            var idx = Number(event.target?.getAttribute?.('data-preset-idx'));
            if (!Number.isFinite(idx)) return;
            var p = presets[idx];
            if (!p) return;
            try {
                await applyPresetObject(p.preset);
            } catch (err) {
                console.warn('Preset apply failed', err);
            }
            toggleSharePanel(true);
            if (shareUrlEl) shareUrlEl.value = buildShareUrl();
        });
    }

    function openHelpModal() {
        if (!helpModalEl || !helpDontShowEl) return;
        helpModalEl.classList.add('is-open');
        helpModalEl.setAttribute('aria-hidden', 'false');
        helpDontShowEl.checked = (localStorage.getItem('langton3d_help_dont_show') === '1');
    }

    function closeHelpModal() {
        if (!helpModalEl || !helpDontShowEl) return;
        helpModalEl.classList.remove('is-open');
        helpModalEl.setAttribute('aria-hidden', 'true');
        if (helpDontShowEl.checked) localStorage.setItem('langton3d_help_dont_show', '1');
        else localStorage.removeItem('langton3d_help_dont_show');
    }

    if (helpBtnEl) helpBtnEl.addEventListener('click', () => openHelpModal());
    if (helpCloseEl) helpCloseEl.addEventListener('click', () => closeHelpModal());
    if (helpModalEl) {
        helpModalEl.addEventListener('click', (event) => {
            if (event.target === helpModalEl) closeHelpModal();
        });
    }

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
        } else if (event.key === 'h' || event.key === 'H' || event.key === '?') {
            openHelpModal();
        }
    });

    if (helpModalEl && helpDontShowEl && localStorage.getItem('langton3d_help_dont_show') !== '1') {
        setTimeout(() => openHelpModal(), 250);
    }

    spawnFormEl.addEventListener('submit', (event) => {
        event.preventDefault();
        spawnErrorEl.textContent = '';

        var name = (document.getElementById('spawnName')?.value || '').trim();
        var x = Number(document.getElementById('spawnX')?.value || 0);
        var y = Number(document.getElementById('spawnY')?.value || 0);
        var z = Number(document.getElementById('spawnZ')?.value || 0);
        var orientation = Number(document.getElementById('spawnOrientation')?.value || 5);
        var atTick = Number(document.getElementById('spawnAtTick')?.value || 0);
        var ruleStr = (document.getElementById('spawnRule')?.value || '').trim();
        var colorsStr = (document.getElementById('spawnColors')?.value || '').trim();

        try {
            spawnAnt({
                name: name,
                x: x,
                y: y,
                z: z,
                orientation: orientation,
                rule: ruleStr,
                colors: colorsStr,
                spawnAtTick: atTick
            });
            spawnFormEl.reset();
            var ruleEl = document.getElementById('spawnRule');
            if (ruleEl) ruleEl.value = 'L R R L';
            var colorsResetEl = document.getElementById('spawnColors');
            if (colorsResetEl) colorsResetEl.value = '#12130f #5b9279 #eae6e5 #8fcb9b';
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
    simStatusEl.textContent = `${sim.running ? 'Running' : 'Paused'} • ${liveCount}/${allTermites.length} live • queued ${sim.spawnQueue.length} • ticks ${sim.totalTicks} • boxes ${sim.stats.boxesCreated}`;

    antListEl.innerHTML = allTermites.map((ant) => {
        var pos = ant.currentPosition;
        var move = ant.recentSteps[0]?.delta ? ant.recentSteps[0].delta : {x:0,y:0,z:0};
        var lastToken = ant.recentSteps[0]?.token || '';
        var heading = headingLabel(ant);
        var status = ant.isOutOfBounds ? `stopped (${ant.lastError})` : (ant.active ? 'live' : 'paused');
        var recent = ant.recentSteps.slice(0, 6).reverse();
        var recentHtml = recent.map((s) => {
            var c = getAntColorForState(ant, s.fromState || 0);
            var vec = formatDelta(s.delta);
            return `<span class="antToken" style="border-color: rgba(255,255,255,0.10); background: rgba(255,255,255,0.06); color:${c}" title="${s.token} ${vec}">${escapeHtml(s.token)}</span>`;
        }).join('');
        var ruleHtml = ant.stateTransitions.map((t, i) => {
            var c = getAntColorForState(ant, i);
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
                <div>Palette: ${Array.isArray(ant.stateColors) ? ant.stateColors.length : 0}</div>
                <div>Born: ${Number.isFinite(Number(ant.bornAtTick)) ? Number(ant.bornAtTick) : 0}</div>
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
    var heading = normalizeHeading(config.heading);
    var rule = (config.rule || '').trim();
    var colorsStr = (config.colors || '').trim();
    var spawnAtTick = Number(config.spawnAtTick);

    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) throw new Error('Start position must be numbers');
    if (!Number.isFinite(orientation)) orientation = 5;
    if (!rule) throw new Error('Rule is required (example: "L R")');

    var transitions = parseRuleString(rule);
    if (transitions.length < 2) throw new Error('Rule needs at least 2 tokens (example: "L R")');
    transitions.forEach((t) => {
        if (!['L', 'R', 'U'].includes(t)) throw new Error(`Unsupported token "${t}" (allowed: L, R, U)`);
    });

    if (!Number.isFinite(spawnAtTick) || spawnAtTick < 0) spawnAtTick = 0;

    var palette = parseColorsString(colorsStr);
    if (palette.length === 0) {
        palette = generatePaletteFromHue(210, transitions.length);
    }
    if (palette.length !== transitions.length) {
        throw new Error(`Colors count (${palette.length}) must match rule length (${transitions.length})`);
    }

    var antConfig = {
        name: name,
        x: x,
        y: y,
        z: z,
        orientation: orientation,
        heading: heading,
        transitions: transitions,
        stateColors: palette,
        spawnAtTick: spawnAtTick
    };

    if (spawnAtTick > sim.totalTicks) {
        sim.spawnQueue.push({ atTick: spawnAtTick, config: antConfig });
        sim.spawnQueue.sort((a, b) => a.atTick - b.atTick);
        return null;
    }

    return spawnAntNow(antConfig);
}

function spawnAntNow(antConfig) {
    var ant = new LangtonTermite(
        antConfig.x,
        antConfig.y,
        antConfig.z,
        antConfig.orientation,
        antConfig.transitions,
        antConfig.transitions.length
    );
    if (antConfig.name) ant.name = antConfig.name;
    ant.stateColors = antConfig.stateColors;
    ant.spawnAtTick = antConfig.spawnAtTick;
    ant.bornAtTick = sim.totalTicks;
    ant.startPosition.heading = antConfig.heading;
    ant.currentPosition.heading = antConfig.heading;

    allTermites.push(ant);
    return ant;
}

function flushSpawnQueue() {
    if (!sim.spawnQueue.length) return;
    while (sim.spawnQueue.length && sim.spawnQueue[0].atTick <= sim.totalTicks) {
        var item = sim.spawnQueue.shift();
        spawnAntNow(item.config);
    }
}

function resetSimulation() {
    sim.pendingSingleSteps = 0;
    sim.totalTicks = 0;
    sim.stats.boxesCreated = 0;
    sim.spawnQueue = [];

    document.querySelectorAll('[id^="kLang-3d-"]').forEach((node) => node.remove());
    antGrid.init(100, 100, 100);
    allTermites.forEach((ant) => ant.reset());
}

function parseRuleString(text) {
    var raw = String(text).trim();
    if (!raw) return [];
    var tokens = raw
        .replace(/,/g, ' ')
        .split(/\s+/g)
        .map((t) => t.trim().toUpperCase())
        .filter(Boolean);

    // Support compact strings like "LLRR" or "RLR" (no separators).
    if (tokens.length === 1 && /^[LRU]+$/.test(tokens[0])) {
        return tokens[0].split('');
    }
    return tokens;
}

function parseColorsString(text) {
    var tokens = String(text)
        .replace(/,/g, ' ')
        .split(/\s+/g)
        .map((t) => t.trim())
        .filter(Boolean);

    var colors = tokens.map((t) => normalizeHexColor(t)).filter(Boolean);
    return colors;
}

function normalizeHexColor(token) {
    var t = String(token).trim();
    if (!t) return null;
    if (t[0] !== '#') t = `#${t}`;
    if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(t)) return null;
    if (t.length === 4) {
        var r = t[1], g = t[2], b = t[3];
        t = `#${r}${r}${g}${g}${b}${b}`;
    }
    return t.toLowerCase();
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

async function loadPresetFromUrl() {
    try {
        console.groupCollapsed('[langton3d] Preset: load from URL');
        var params = new URLSearchParams(window.location.search || '');
        var encoded = params.get('p');
        if (!encoded) {
            console.log('No `p` query param found.');
            console.groupEnd();
            return false;
        }

        console.log('Encoded preset length:', encoded.length);
        var json = base64UrlDecode(encoded);
        console.log('Decoded JSON length:', json.length);
        var preset = JSON.parse(json);
        console.log('Preset payload:', preset);
        if (!preset || (preset.version !== 1 && preset.version !== 2)) {
            console.warn('Unsupported preset version:', preset?.version);
            console.groupEnd();
            return false;
        }

        await applyPresetObject(preset);
        console.groupEnd();

        return true;
    } catch (err) {
        console.warn('Failed to load preset from URL', err);
        try { console.groupEnd(); } catch (e) {}
        return false;
    }
}

function buildShareUrl() {
    var baseUrl = new URL(window.location.href);
    baseUrl.search = '';
    baseUrl.hash = '';
    if (!baseUrl.pathname.endsWith('/langton3d/kaaro.html')) {
        baseUrl.pathname = '/langton3d/kaaro.html';
    }
    var preset = {
        version: 2,
        grid: {
            x: antGrid?.max_x || 100,
            y: antGrid?.max_y || 100,
            z: antGrid?.max_z || 100
        },
        sim: {
            running: sim.running,
            stepsPerFrame: sim.stepsPerFrame
        },
        ants: allTermites.map((ant) => ({
            name: ant.name,
            x: ant.startPosition.x,
            y: ant.startPosition.y,
            z: ant.startPosition.z,
            orientation: ant.startPosition.orientation,
            heading: ant.startPosition.heading,
            rule: (ant.stateTransitions || []).join(' '),
            colors: Array.isArray(ant.stateColors) ? ant.stateColors : [],
            spawnAtTick: Number.isFinite(Number(ant.spawnAtTick)) ? Number(ant.spawnAtTick) : 0
        })).concat(sim.spawnQueue.map((item) => ({
            name: item.config.name || '',
            x: item.config.x,
            y: item.config.y,
            z: item.config.z,
            orientation: item.config.orientation,
            heading: item.config.heading,
            rule: (item.config.transitions || []).join(' '),
            colors: Array.isArray(item.config.stateColors) ? item.config.stateColors : [],
            spawnAtTick: item.atTick
        })))
    };

    var encoded = base64UrlEncode(JSON.stringify(preset));
    baseUrl.searchParams.set('p', encoded);
    return baseUrl.toString();
}

function base64UrlEncode(text) {
    var b64 = btoa(unescape(encodeURIComponent(String(text))));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(text) {
    var padded = String(text).replace(/-/g, '+').replace(/_/g, '/');
    while (padded.length % 4) padded += '=';
    return decodeURIComponent(escape(atob(padded)));
}

async function copyTextToClipboard(text) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(String(text));
            return true;
        }
    } catch (err) {}

    try {
        var ta = document.createElement('textarea');
        ta.value = String(text);
        ta.setAttribute('readonly', 'readonly');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        ta.style.top = '0';
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, ta.value.length);
        var ok = document.execCommand('copy');
        ta.remove();
        return !!ok;
    } catch (err) {
        return false;
    }
}

async function maybeEnterFullscreenForShare() {
    try {
        if (getFullscreenElement()) return false;
        await requestFullscreenForScene();
        return true;
    } catch (err) {
        return false;
    }
}

async function maybeExitFullscreenAfterShare(didEnter) {
    try {
        if (!didEnter) return;
        if (!getFullscreenElement()) return;
        await exitFullscreen();
    } catch (err) {}
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function nextFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

var loadingUi = {
    depth: 0
};

function showLoading(text) {
    loadingUi.depth += 1;
    var overlayEl = document.getElementById('loadingOverlay');
    if (!overlayEl) return;
    overlayEl.classList.add('is-open');
    overlayEl.setAttribute('aria-hidden', 'false');
    setLoadingText(text);
}

function hideLoading() {
    loadingUi.depth = Math.max(0, loadingUi.depth - 1);
    if (loadingUi.depth > 0) return;
    var overlayEl = document.getElementById('loadingOverlay');
    if (!overlayEl) return;
    overlayEl.classList.remove('is-open');
    overlayEl.setAttribute('aria-hidden', 'true');
}

function setLoadingText(text) {
    var el = document.getElementById('loadingText');
    if (!el) return;
    el.textContent = text ? String(text) : 'Loading…';
}

async function withLoading(text, fn) {
    showLoading(text);
    await nextFrame();
    try {
        return await fn();
    } finally {
        hideLoading();
    }
}

function getFullscreenElement() {
    try {
        if (window.AFRAME?.utils?.fullscreen?.getFullscreenElement) return AFRAME.utils.fullscreen.getFullscreenElement();
    } catch (err) {}
    return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null;
}

async function requestFullscreen(element) {
    try {
        if (window.AFRAME?.utils?.fullscreen?.requestFullscreen) return await Promise.resolve(AFRAME.utils.fullscreen.requestFullscreen(element));
    } catch (err) {}
    var el = element || document.documentElement;
    if (el.requestFullscreen) return await el.requestFullscreen();
    if (el.webkitRequestFullscreen) return await el.webkitRequestFullscreen();
    if (el.mozRequestFullScreen) return await el.mozRequestFullScreen();
    if (el.msRequestFullscreen) return await el.msRequestFullscreen();
}

async function exitFullscreen() {
    try {
        if (window.AFRAME?.utils?.fullscreen?.exitFullscreen) return await Promise.resolve(AFRAME.utils.fullscreen.exitFullscreen());
    } catch (err) {}
    if (document.exitFullscreen) return await document.exitFullscreen();
    if (document.webkitExitFullscreen) return await document.webkitExitFullscreen();
    if (document.mozCancelFullScreen) return await document.mozCancelFullScreen();
    if (document.msExitFullscreen) return await document.msExitFullscreen();
}

async function requestFullscreenForScene() {
    var sceneEl = document.getElementById('mainFrame');
    if (sceneEl && !sceneEl.hasLoaded) {
        await new Promise((resolve) => sceneEl.addEventListener('loaded', resolve, { once: true }));
    }
    var target = sceneEl?.canvas || sceneEl?.renderer?.domElement || sceneEl || document.documentElement;
    await requestFullscreen(target);
    try { sceneEl?.resize?.(); } catch (err) {}
}

function normalizeHeading(heading) {
    if (Number.isFinite(Number(heading))) {
        var h = Number(heading);
        if ([0, 1, 2, 3].includes(h)) return h;
    }
    var s = String(heading || '').trim().toLowerCase();
    switch (s) {
        case 'n':
        case 'north':
            return 0;
        case 'e':
        case 'east':
            return 1;
        case 's':
        case 'south':
            return 2;
        case 'w':
        case 'west':
            return 3;
        default:
            return 0;
    }
}

async function applyPresetFromInput(input) {
    var raw = String(input).trim();
    var encoded = raw;

    if (/^https?:\/\//i.test(raw)) {
        var url = new URL(raw);
        encoded = url.searchParams.get('p') || '';
    } else {
        encoded = raw.replace(/^[?#]/, '');
        if (encoded.startsWith('p=')) encoded = encoded.slice(2);
        else if (encoded.includes('p=')) {
            var params = new URLSearchParams(encoded);
            encoded = params.get('p') || '';
        }
    }

    if (!encoded) throw new Error('No preset found in input');
    var json = base64UrlDecode(encoded);
    var preset = JSON.parse(json);
    await applyPresetObject(preset);
}

async function removeNodesInChunks(nodes, chunkSize) {
    var list = Array.from(nodes || []);
    var size = Number(chunkSize) || 300;
    for (let i = 0; i < list.length; i += size) {
        list.slice(i, i + size).forEach((node) => {
            try { node.remove(); } catch (err) {}
        });
        await nextFrame();
    }
}

async function applyPresetObject(preset) {
    if (!preset || (preset.version !== 1 && preset.version !== 2)) throw new Error('Unsupported preset');

    await withLoading('Loading preset…', async () => {
        setLoadingText('Clearing scene…');
        await removeNodesInChunks(document.querySelectorAll('[id^=\"kLang-3d-\"]'), 350);
        sim.stats.boxesCreated = 0;

        setLoadingText('Initializing grid…');
        await nextFrame();
        var gridCfg = preset.grid || {};
        antGrid.init(Number(gridCfg.x || 100), Number(gridCfg.y || 100), Number(gridCfg.z || 100));

        setLoadingText('Applying sim settings…');
        sim.spawnQueue = [];
        sim.totalTicks = 0;
        sim.pendingSingleSteps = 0;

        var simCfg = preset.sim || {};
        if (typeof simCfg.running === 'boolean') sim.running = simCfg.running;
        if (Number.isFinite(Number(simCfg.stepsPerFrame))) sim.stepsPerFrame = Math.max(1, Math.min(30, Number(simCfg.stepsPerFrame)));

        setLoadingText('Spawning ants…');
        await nextFrame();
        allTermites = [];
        nextAntId = 1;

        var ants = Array.isArray(preset.ants) ? preset.ants : [];
        ants.forEach((a) => {
            var colors = a.colors;
            if ((!Array.isArray(colors) || colors.length === 0) && Number.isFinite(Number(a.baseHue))) {
                colors = generatePaletteFromHue(Number(a.baseHue), parseRuleString(a.rule || '').length || 2);
            }
            spawnAnt({
                name: a.name || '',
                x: a.x,
                y: a.y,
                z: a.z,
                orientation: a.orientation,
                heading: a.heading,
                rule: a.rule,
                colors: Array.isArray(colors) ? colors.join(' ') : '',
                spawnAtTick: a.spawnAtTick || 0
            });
        });

        try { history.replaceState({}, '', buildShareUrl()); } catch (err) {}
        try { renderHud(true); } catch (err) {}
    });
}

function renderPresetGalleryHtml(presets) {
    var items = Array.isArray(presets) ? presets : [];
    var categories = [];
    var byCat = {};

    items.forEach((p, idx) => {
        var cat = p.category || 'Presets';
        if (!byCat[cat]) {
            byCat[cat] = [];
            categories.push(cat);
        }
        byCat[cat].push({ preset: p, idx: idx });
    });

    return categories.map((cat) => {
        var buttons = byCat[cat].map(({ preset, idx }) =>
            `<button class=\"presetBtn\" type=\"button\" data-preset-idx=\"${idx}\" title=\"${escapeHtml(preset.description || '')}\">${escapeHtml(preset.name)}</button>`
        ).join('');
        return `<div class=\"presetGroup\"><div class=\"presetGroup__title\">${escapeHtml(cat)}</div><div class=\"presetList\">${buttons}</div></div>`;
    }).join('');
}

function buildCuratedPresets() {
    return [
        { category: 'The Geometric Architects', name: 'The Cardioid', description: 'LLRR (4 colors) — symmetry-focused growth.', preset: { version: 2, grid: { x: 130, y: 130, z: 130 }, sim: { running: true, stepsPerFrame: 4 }, ants: [{ name: 'Cardioid', x: 0, y: 0, z: 0, orientation: 5, heading: 'north', rule: 'LLRR', baseHue: 140, spawnAtTick: 0 }] } },
        { category: 'The Geometric Architects', name: 'The Square', description: 'LRRRRRLLR (9 colors) — dense square growth.', preset: { version: 2, grid: { x: 140, y: 140, z: 140 }, sim: { running: true, stepsPerFrame: 5 }, ants: [{ name: 'Square', x: 0, y: 0, z: 0, orientation: 5, heading: 'north', rule: 'LRRRRRLLR', baseHue: 210, spawnAtTick: 0 }] } },
        { category: 'The Geometric Architects', name: 'The Triangle', description: 'RRLLLRLLLRRR (12 colors) — wedge; later migrates.', preset: { version: 2, grid: { x: 160, y: 160, z: 160 }, sim: { running: true, stepsPerFrame: 6 }, ants: [{ name: 'Triangle', x: 0, y: 0, z: 0, orientation: 5, heading: 'north', rule: 'RRLLLRLLLRRR', baseHue: 35, spawnAtTick: 0 }] } },
        { category: 'The Geometric Architects', name: 'The Spiral', description: 'LRRRRLLLRRR (11 colors) — architectural square spiral.', preset: { version: 2, grid: { x: 150, y: 150, z: 150 }, sim: { running: true, stepsPerFrame: 5 }, ants: [{ name: 'Spiral', x: 0, y: 0, z: 0, orientation: 5, heading: 'north', rule: 'LRRRRLLLRRR', baseHue: 280, spawnAtTick: 0 }] } },
        { category: 'The Highwaymen', name: 'Classic Highway', description: 'RL (2 colors) — chaos then highway.', preset: { version: 2, grid: { x: 140, y: 140, z: 140 }, sim: { running: true, stepsPerFrame: 4 }, ants: [{ name: 'Classic', x: 0, y: 0, z: 0, orientation: 5, heading: 'north', rule: 'RL', baseHue: 150, spawnAtTick: 0 }] } },
        { category: 'The Highwaymen', name: 'Convolution', description: 'LLRRRLRLRLLR (12 colors) — thick braided highway.', preset: { version: 2, grid: { x: 160, y: 160, z: 160 }, sim: { running: true, stepsPerFrame: 6 }, ants: [{ name: 'Convolution', x: 0, y: 0, z: 0, orientation: 5, heading: 'north', rule: 'LLRRRLRLRLLR', baseHue: 190, spawnAtTick: 0 }] } },
        { category: 'The Highwaymen', name: 'The Weaver', description: 'RLR (3 colors) — chaotic fuzzball growth.', preset: { version: 2, grid: { x: 140, y: 140, z: 140 }, sim: { running: true, stepsPerFrame: 7 }, ants: [{ name: 'Weaver', x: 0, y: 0, z: 0, orientation: 5, heading: 'north', rule: 'RLR', baseHue: 320, spawnAtTick: 0 }] } },
        { category: 'Multi-Ant Orchestrations', name: 'The Rorschach', description: 'RL (2 colors) — mirrored pair symmetry.', preset: { version: 2, grid: { x: 140, y: 140, z: 140 }, sim: { running: true, stepsPerFrame: 4 }, ants: [{ name: 'Ant 1', x: -1, y: 0, z: 0, orientation: 5, heading: 'north', rule: 'RL', baseHue: 140, spawnAtTick: 0 }, { name: 'Ant 2', x: 1, y: 0, z: 0, orientation: 5, heading: 'north', rule: 'RL', baseHue: 40, spawnAtTick: 0 }] } },
        { category: 'Multi-Ant Orchestrations', name: 'The Collider', description: 'RL — second ant intercepts highway.', preset: { version: 2, grid: { x: 200, y: 200, z: 200 }, sim: { running: true, stepsPerFrame: 4 }, ants: [{ name: 'Chaos Maker', x: 0, y: 0, z: 0, orientation: 5, heading: 'north', rule: 'RL', baseHue: 130, spawnAtTick: 0 }, { name: 'Sniper', x: 30, y: 30, z: 0, orientation: 5, heading: 'west', rule: 'RL', baseHue: 10, spawnAtTick: 0 }] } },
        { category: 'Multi-Ant Orchestrations', name: 'The Galaxy', description: 'RL — four-way rotational symmetry.', preset: { version: 2, grid: { x: 200, y: 200, z: 200 }, sim: { running: true, stepsPerFrame: 3 }, ants: [{ name: 'Ant 1', x: 0, y: 10, z: 0, orientation: 5, heading: 'south', rule: 'RL', baseHue: 210, spawnAtTick: 0 }, { name: 'Ant 2', x: 0, y: -10, z: 0, orientation: 5, heading: 'north', rule: 'RL', baseHue: 30, spawnAtTick: 0 }, { name: 'Ant 3', x: 10, y: 0, z: 0, orientation: 5, heading: 'west', rule: 'RL', baseHue: 120, spawnAtTick: 0 }, { name: 'Ant 4', x: -10, y: 0, z: 0, orientation: 5, heading: 'east', rule: 'RL', baseHue: 300, spawnAtTick: 0 }] } }
    ];
}

async function captureSceneSnapshotFile(filename) {
    var sceneEl = document.getElementById('mainFrame');
    if (!sceneEl) return null;

    if (!sceneEl.hasLoaded) {
        await new Promise((resolve) => sceneEl.addEventListener('loaded', resolve, { once: true }));
    }

    if (!sceneEl.renderer || !sceneEl.renderer.domElement) {
        await delay(60);
    }
    if (!sceneEl.renderer || !sceneEl.renderer.domElement) return null;

    try {
        if (sceneEl.camera && sceneEl.object3D) {
            sceneEl.renderer.render(sceneEl.object3D, sceneEl.camera);
        }
    } catch (err) {}
    var canvas = sceneEl.renderer.domElement;

    var blob = await new Promise((resolve) => {
        try {
            canvas.toBlob((b) => resolve(b), 'image/png');
        } catch (err) {
            resolve(null);
        }
    });
    if (!blob) {
        try {
            var dataUrl = canvas.toDataURL('image/png');
            var res = await fetch(dataUrl);
            blob = await res.blob();
        } catch (err) {
            return null;
        }
    }

    try {
        return new File([blob], filename, { type: 'image/png' });
    } catch (err) {
        blob.name = filename;
        return blob;
    }
}

function downloadFile(fileOrBlob, filename) {
    var blob = fileOrBlob instanceof Blob ? fileOrBlob : new Blob([fileOrBlob]);
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename || 'snapshot.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
}

(async () => {
    await loadPresetFromUrl();
    setupHud();
    draw();
})();
