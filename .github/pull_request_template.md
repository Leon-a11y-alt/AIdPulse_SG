## What changed

<!-- One or two sentences. What does this PR do, and why? -->

## How it was verified

<!-- Tick what applies. CI runs all of these automatically on this PR. -->

- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm test` passes (new/changed logic has a test)
- [ ] `npm run build` succeeds
- [ ] Checked manually in the browser

## Risk and rollback

<!-- What breaks if this is wrong, and how do we undo it? -->

---

CI must be green before merge — the **CI result** check on this PR is the gate.
See [docs/05-ci-pipeline.md](../docs/05-ci-pipeline.md) for what each stage does.
