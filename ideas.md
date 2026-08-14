# Flux Studio — Design Direction

## Approach 1: Carbon Editorial Console

### Theme Name
Carbon Editorial Console

### Very Brief Intro
A dark, gallery-first studio interface inspired by high-end creative software and editorial contact sheets. It should feel focused, calm, and built for making images rather than configuring a dashboard.

### Probability
0.07

## Approach 2: Paperlight Atelier

### Theme Name
Paperlight Atelier

### Very Brief Intro
A warm, tactile workspace with parchment neutrals, ink typography, and a carefully framed canvas. The mood is analog craft translated into a modern image-making tool.

### Probability
0.03

## Approach 3: Signal Garden

### Theme Name
Signal Garden

### Very Brief Intro
A bright, modular interface using cobalt, saffron, and soft mint to make model choices feel approachable. It leans playful and contemporary without becoming toy-like.

### Probability
0.09

## Chosen Approach: Carbon Editorial Console

### Design Movement
Contemporary editorial software design with references to Swiss International Typographic Style, darkroom contact sheets, and premium creative-tool interfaces.

### Core Principles
1. **Canvas before chrome:** the generated image is the primary visual object; controls frame it without competing for attention.
2. **Quiet hierarchy:** use restrained contrast, a disciplined type scale, and one signature accent instead of decorative noise.
3. **Editorial rhythm:** use deliberate columns, thin rules, metadata labels, and contact-sheet patterns to make the app feel curated.
4. **State clarity:** loading, empty, success, and failure states should be explicit and useful, never ambiguous.

### Color Philosophy
The base is near-black graphite rather than pure black, giving images room to glow without harsh contrast. Bone-white text keeps long labels readable, while a single electric chartreuse accent marks actions and active states. Muted mineral blue is reserved for secondary information and external-model configuration so it feels distinct from the native generation path.

### Layout Paradigm
A responsive studio shell: a compact top bar, a two-column desktop workspace with a fixed-feeling control rail and a wide canvas, then a contact-sheet gallery below. At tablet widths the rail becomes a top control band; on mobile it becomes stacked, with the primary generate action remaining reachable after prompt entry.

### Signature Elements
1. A small **signal dot** beside the Flux Studio wordmark that changes state with generation.
2. Thin **editorial rules** separating prompt, parameters, result, and gallery metadata.
3. A **contact-sheet gallery** with consistent image windows and tiny metadata captions.

### Interaction Philosophy
Every action should answer the question “what changed?” Buttons use crisp active feedback, inputs preserve user work locally, and dialogs only appear when the user is changing a meaningful connection such as an external model. No interaction should unexpectedly move the primary canvas.

### Animation
Use short 140–220ms ease-out transitions for controls and drawers. Let the signal dot pulse only while generating. New images enter with a subtle opacity-and-translate transition, never a scale-from-zero effect. Respect reduced-motion preferences and keep keyboard actions instantaneous.

### Typography System
Use **Space Grotesk** for wordmark, headings, and labels; use **DM Sans** for body copy and controls. Large titles are compact and slightly tracked out, while metadata uses uppercase 10–11px labels with generous letter spacing. Never use a default system stack for the primary hierarchy.

### Brand Essence
Flux Studio is a focused image-making workspace for people who want professional control without a cluttered AI dashboard. Personality: **precise, composed, generous**.

### Brand Voice
Headlines are direct and visual. CTAs describe the result, not the process. Microcopy is calm, honest, and specific.

Example lines:

> Shape the frame. Keep the signal.

> Bring a prompt; leave with a direction.

### Wordmark & Logo
The mark is a compact four-point aperture: two offset brackets creating a small luminous center, paired with a geometric wordmark. It should work as a standalone favicon and as a signal indicator in the header.

### Signature Brand Color
**Signal Lime — `#D7F36B`**. It is bright enough to guide the eye on graphite, unusual enough to own, and restrained enough to avoid generic neon-cyberpunk styling.
