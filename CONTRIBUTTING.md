# Contributing to TaxNaija

Thank you for helping make tax filing accessible to all Nigerians. 🇳🇬

## Quick start

```bash
git clone https://github.com/taxnaija/taxnaija.git
cd taxnaija
npm install
npm run dev      # http://localhost:5173
npm test         # run the tax engine test suite
```

## Three entry points — sorted easiest to hardest

### 1. Translations (no code needed)

Add or improve locale files in `src/i18n/locales/`.

```
src/i18n/locales/
├── en.json          ← English (base)
├── pidgin.json      ← Nigerian Pidgin (in progress)
├── yo.json          ← Yoruba (wanted!)
├── ha.json          ← Hausa (wanted!)
└── ig.json          ← Igbo (wanted!)
```

Each key maps to a UI string. Copy `en.json`, translate the values, open a PR.

### 2. State IRS data (JSON, no code)

Add or update state-specific submission info in `src/ui/StatePortalCard.tsx`
under the `STATE_REGISTRY` object.

Each state needs:

- `irsName` — official name of the state IRS
- `portalUrl` — online filing portal URL (if available)
- `officeAddress` — physical office for walk-in submission
- `phone` — contact number
- `notes` — anything filers need to know

### 3. Tax engine (TypeScript + tests)

The tax engine lives entirely in `src/tax-engine/`. It is:

- **Pure functions only** — no React, no I/O
- **100% tested** — every PR must maintain passing tests
- **Single source of truth** — rate changes go in `brackets.ts` only

When NRS updates rates or reliefs:

1. Edit `src/tax-engine/brackets.ts`
2. Update the relevant tests in `src/tax-engine/compute.test.ts`
3. Run `npm test` — all 59 tests must pass
4. Open a PR with a link to the official FIRS/legislative source

## PR checklist

- [ ] `npm test` passes (59 tests)
- [ ] `npm run type-check` passes
- [ ] Any new tax logic has a test with a worked example
- [ ] Any new UI component has English + Pidgin text strings
- [ ] NRS/legislative sources are cited in comments for any rate changes

## Filing deadline reminder

The filing deadline is **March 31** each year. If you're contributing
rate updates for the new tax year, please open the PR by **February 1**
so it can be reviewed and merged before the deadline rush.

## Licence

MIT — contributions remain under MIT licence.
