---
title: "On the Craft of Explaining Complex Systems"
summary: "Why engineering documentation is fundamentally a form of translation — and how to write technical explanations that stick."
tags: [writing, engineering, communication, reflections]
pinned: true
---

The hardest part of building complex systems is rarely the code itself. It is preserving the mental model in a form that another human being can inhabit six months later without losing their mind.

When engineers write about their work, they often fall into one of two traps:

1. **The Reference Manual Trap**: Dumping every parameter, flag, and method signature in alphabetical order without a conceptual spine.
2. **The Hand-Waving Narrative Trap**: Speaking in vague abstractions and marketing buzzwords without ever showing the concrete mechanics under the hood.

Effective technical writing lives in the tension between these two extremes. It requires treating documentation not as an administrative chore to be performed after the code is merged, but as the final, essential stage of the system architecture itself.

### The Inverted Pyramid of Understanding

When introducing a new architecture or tool, always establish the invariants first:

- **What problem exists in the world?** Not the solution, but the friction.
- **What is the simplest honest mental model?** A three-sentence conceptual anchor.
- **What are the moving parts?** Diagram or trace the path of a single request or byte.
- **What are the edge cases and trade-offs?** Where does this system break, and why?

When you explain something well, you are not just documenting a tool — you are respecting your reader's time and intellect.

