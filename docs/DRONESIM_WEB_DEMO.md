# DroneSim web demo

The portfolio keeps DroneSim outside the Astro runtime. Visitors open the deployed [DroneSim web app](https://cgantro.github.io/DroneSim/) only after activating the demo link.

The WebAssembly build uses the kinematic baseline. Windows native builds can use AirSim rigid-body physics; do not describe the web page as exercising that path or validating real flight performance.

The portfolio does not copy DroneSim's runtime bundle, register a cross-origin-isolation service worker for it, or render it in an iframe. The public app can be checked separately with `pnpm test:live-simulator`; that network-dependent browser run records a screenshot and diagnostics under `artifacts/design-review/`.
