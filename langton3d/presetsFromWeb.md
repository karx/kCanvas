These are categorized by behavior. Since you are building a tool, I have included the Rule String, the Number of Colors (implied by string length), and the Starting Configuration (critical for multi-ant patterns).
1. The Geometric Architects

Behaviors that ignore chaos and immediately build clean, artificial-looking structures.
Preset Name	Rule String	Colors	Configuration	Description
The Cardioid	LLRR	4	Single Ant (Center)	The Standard for Symmetry. It never creates a highway. Instead, it grows a symmetrical, heart-shaped loop that expands infinitely.
The Square	LRRRRRLLR	9	Single Ant (Center)	Space Filler. Unlike most ants that wander, this one builds a solid, dense 9-color square box that grows outward from the center.
The Triangle	RRLLLRLLLRRR	12	Single Ant (Center)	The Voyager. It builds a solid triangular wedge. After ~15,000 steps, the entire triangle begins to migrate, leaving a massive trail behind it.
The Spiral	LRRRRLLLRRR	11	Single Ant (Center)	Golden Ratio. Builds a clean, architectural square spiral. Very satisfying to watch as it "paints" the walls of its own maze.
2. The Highwaymen

Rule sets specifically discovered to generate complex, predictable movement "highways" after short chaotic periods.
Preset Name	Rule String	Colors	Configuration	Description
Classic Highway	RL	2	Single Ant	The "Hello World." Chaos for ~10,000 steps, then a diagonal highway emerges.
Convolution	LLRRRLRLRLLR	12	Single Ant	Creates a "Convoluted Highway." It looks like a thick, braided rope rather than the thin pixel-line of the classic ant.
The Weaver	RLR	3	Single Ant	Chaotic Growth. Unlike others, it is not known if this ever stabilizes. It creates a "fuzzball" texture that looks like static noise.
3. Multi-Ant Orchestrations (Interaction Presets)

The magic happens when simple RL ants collide. These presets rely on Symmetry and Collision Physics.
A. "The Rorschach" (Symmetry)

Two ants bouncing off each other creates a perfectly mirrored "inkblot" pattern.

    Rule: RL (2 Colors)

    Ant 1: x: -1, y: 0 | Facing: North

    Ant 2: x: 1, y: 0 | Facing: North

    Result: They build a "castle" in the center. Because they are perfectly paired, they often effectively "trap" each other, preventing the usual highway escape.

B. "The Collider" (Annihilation)

A demonstration of how a highway (Order) can be destroyed by a single particle (Chaos).

    Rule: RL (2 Colors)

    Ant 1: x: 0, y: 0 | Facing: North (The Chaos Maker)

    Ant 2: x: 30, y: 30 | Facing: West (The Sniper)

    Timing: Release Ant 2 immediately.

    Result: Ant 1 will eventually form a highway. By placing Ant 2 at this specific offset, it intercepts the highway, causing a catastrophic collision that resets the system into chaos.

C. "The Galaxy" (Rotational Symmetry)

Four ants creating a spiral galaxy.

    Rule: RL (2 Colors)

    Ant 1: x: 0, y: 10 | Facing: South

    Ant 2: x: 0, y: -10 | Facing: North

    Ant 3: x: 10, y: 0 | Facing: West

    Ant 4: x: -10, y: 0 | Facing: East

    Result: They spiral inward, collide at 0,0, and explode outward in a starburst pattern.