# GraspLink direct WebAssembly embed (experimental)

This draft adds an opt-in direct Canvas, not a production replacement for the existing iframe.

Open the GraspLink project URL with the query parameter embed=1. The React component registers the already-vendored COI Service Worker under /Portfolio/ when isolation is unavailable, reloads the top-level page, fetches /GraspLink/embed/manifest.json with no-store, and loads the SHA-versioned JavaScript factory from the original GraspLink Pages. It then calls createGraspLink with the actual React canvas. The two GitHub Pages projects share the cgantro.github.io origin, so no build copy or Portfolio redeployment is required after the source repository publishes changes.

Before changing the default viewer: merge and deploy GraspLink's modular Pthreads build, test browser worker startup and crossOriginIsolated/SharedArrayBuffer, confirm WebGL resources and controller interaction, verify COEP compatibility for CDN stylesheet/fonts, and implement native runtime teardown. As a temporary guard, navigating away from a started Canvas triggers a full-page reload instead of leaving orphaned Emscripten callbacks behind.

The stable iframe remains the default on this branch. This experimental mode must not be described as verified multithreaded deployment.
