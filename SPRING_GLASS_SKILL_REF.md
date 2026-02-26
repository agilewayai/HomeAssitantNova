# RAVIS Spring Glass Skill Reference

## Design Source
- Local guide: `Ravis Spring Glass design guide.md`
- Skill source repo: `https://github.com/nextlevelbuilder/ui-ux-pro-max-skill`

## Active Skill Paths
- Built-in executable skill: `/Users/arthur/.agents/skills/ui-ux-pro-max`
- Installed reference copy: `/Users/arthur/.codex/skills/ui-ux-pro-max`

## Applied Design Direction
- Style: Spring Glass (high-transparency, low-pressure, soft green visual tone)
- Core palette: `#2DD4BF`, `#A7F3D0`, `#F0FDF4`, `#064E3B`, `#065F46`, `#FEF3C7`
- Material: frosted glass cards + large radii + micro shadows
- Motion: limited floating/breathing animation with `prefers-reduced-motion` fallback

## Implementation Targets
- `styles.css` (master visual system)
- `styles.lite.css` (performance mode + overrides)
- `app.js` / `app.lite.js` (theme previews and runtime behavior)
- Single-file releases:
  - `HomeAssistant-Nova.production.html`
  - `HomeAssistant-Nova.performance.html`
  - `iPad-executable/index.html`
