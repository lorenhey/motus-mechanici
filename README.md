# MOTUS MECHANICI
**1800 mechanical movements brought back to motion.**

Gardner D. Hiscox published his mechanical dictionary, *"Mechanical Movements, Powers, Devices, and Appliances"*, in 1899. It served as a vital reference for inventors, students, and artisans, capturing the explosive mechanical ingenuity of the era in over a thousand detailed engravings.

More than a century later, its machines move again.

**Motus Mechanici** is not a static digitalization or a collection of simple GIFs. It is an interactive, computational, and historically documented atlas that reconstructs Hiscox's 1800 mechanisms as executable mathematical models. 

Each entry aims to present the original historical engraving alongside a geometrically rigorous, mathematically bound, and interactive kinematic simulation.

## The Objective

The final goal is the complete catalog of Hiscox's ~1800 entries. 

When a user visits a mechanism, they shouldn't just see *what* it does, but *why* it does it. The simulations are driven by underlying kinematic solvers. When you drag a crank, the connecting rod reacts, the slider moves, and the governing equations update in real-time.

## Fidelity Levels

Hiscox's illustrations were often schematic, lacking exact dimensions or full geometric constraints. We do not invent precision where none exists. Every reconstruction is classified by its fidelity:

* **EXACT**: Geometry and operation reconstructed with high confidence from the source or unequivocal historical documentation.
* **KINEMATICALLY RECONSTRUCTED**: The kinematic principle is clear, but relative dimensions were chosen to produce a functional implementation.
* **INTERPRETATIVE**: The illustration allows a probable mechanical interpretation, but significant uncertainties exist.
* **ILLUSTRATIVE ONLY**: Insufficient information for a rigorous simulation. Explanatory animations are provided without implying a determined physical reconstruction.
* **STATIC**: Dispositions, tools, or components without significant kinematic animation.

## Architecture

The project is built as a static site for maximum longevity and speed:
* **React & Vite**: Fast, component-based UI.
* **Custom Kinematic Engine**: Instead of writing 1800 separate animations, we use a reusable library of geometric primitives and solvers (Four-bar, Crank-slider, Gear trains).
* **KaTeX**: For live, interactive mathematical rendering.

## Current Coverage

* **Corpus**: 1 / 1800 catalogued
* **Source Images**: 0 / 1800 extracted
* **Reconstructed**: 1 / 1800
* **Equation-linked**: 1 / 1800

*(This coverage is currently tracking the initial engine bootstrap. The systematic cataloging phase is beginning.)*

## Running Locally

```bash
npm install
npm run dev
```

## License

The code for the Kinematic Engine and the React Application is licensed under the MIT License.
The historical illustrations, texts, and original diagrams from Gardner D. Hiscox's work (1899 and subsequent early editions) are in the Public Domain.
