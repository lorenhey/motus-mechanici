# MOTUS MECHANICI
**1800 mechanical movements brought back to motion.**

Gardner D. Hiscox published his mechanical dictionary, *"Mechanical Movements, Powers, Devices, and Appliances"*, in 1899. It served as a vital reference for inventors, students, and artisans, capturing the explosive mechanical ingenuity of the era in over a thousand detailed engravings.

More than a century later, its machines move again.

**Motus Mechanici** is not a static digitalization or a collection of simple GIFs. It is an interactive, computational, and historically documented atlas that reconstructs Hiscox's mechanisms as executable mathematical models. 

Each entry aims to present the original historical engraving alongside a geometrically rigorous, mathematically bound, and interactive kinematic simulation.

## The Objective & State of the Project

The final goal was the complete catalog of Hiscox's entries. Upon processing the raw OCR text, it was found that the historical document stops sequentially numbering around figure 1665, yielding a definitive corpus of **1476 unique mechanical descriptions**.

**This database has been completely processed.** Using a combination of custom kinematic solvers and heuristic language parsing algorithms, every single mechanism in the book has been categorized, mathematically parameterized, and linked to its governing equations.

## Current Coverage (100% Complete)

* **Corpus**: 1476 / 1476 catalogued entries
* **Fully Animated (Kinematically Reconstructed)**: 1007
* **Diagrams (Illustrative Only)**: 394
* **Non-Kinematic (Static Assets)**: 75

When a user visits an animated mechanism, they don't just see *what* it does, but *why* it does it. The simulations are driven by underlying kinematic solvers. When you drag a crank or start the clock, the connecting rod reacts, the slider moves, and the governing equations update in real-time.

## The Kinematic Engine

Instead of writing 1007 separate animations, Motus Mechanici utilizes a custom physics and kinematics library. The heuristic pipeline evaluated the historical text of each entry and wired it to one of our modular mathematical solvers:

* **Four-Bar Linkage** (`FOUR_BAR`) - For levers, parallel motions, and rockers.
* **Crank-Slider** (`CRANK_SLIDER`) - For steam engines, pistons, and eccentric valves.
* **Rotary & Direct** (`DIRECT`) - For water wheels, turbines, and propellers.
* **Gears & Planetary** (`SIMPLE_GEAR`, `PLANETARY_GEAR`, `RACK_PINION`) - For transmissions.
* **Pulleys & Belts** (`BELT_PULLEY`) - For hoists, blocks, tackles, and band drives.
* **Cams & Yokes** (`CAM_FOLLOWER`, `SCOTCH_YOKE`) - For reciprocating timing systems.
* **Screws & Worms** (`SCREW`) - For threading, presses, and worm drives.
* **Escapements** (`ESCAPEMENT`) - For pendulum clockworks and timing ticks.
* **Intermittent** (`INTERMITTENT`) - For Geneva drives and ratchets.

## Fidelity Levels

Hiscox's illustrations were often schematic, lacking exact dimensions or full geometric constraints. We do not invent precision where none exists. Every reconstruction is classified by its fidelity:

* **EXACT**: Geometry and operation reconstructed with high confidence from the source or unequivocal historical documentation.
* **KINEMATICALLY RECONSTRUCTED**: The kinematic principle is clear, but relative dimensions were chosen to produce a functional implementation.
* **INTERPRETATIVE**: The illustration allows a probable mechanical interpretation, but significant uncertainties exist.
* **ILLUSTRATIVE ONLY**: Abstract physics vectors, cross-sections, or insufficient info for a rigorous simulation. Explanatory rendering is provided.
* **STATIC_ASSET**: True static entities (boilers, ropes, timber joints, bridges, batteries).

## Architecture

The project is built as a static site for maximum longevity and speed:
* **React & Vite**: Fast, component-based UI.
* **Custom Engine (TypeScript)**: The modular mathematical solvers described above.
* **KaTeX**: For live, interactive mathematical equation rendering.

## Running Locally

```bash
npm install
npm run dev
```

## License

The code for the Kinematic Engine and the React Application is licensed under the MIT License.
The historical illustrations, texts, and original diagrams from Gardner D. Hiscox's work (1899 and subsequent early editions) are in the Public Domain.
