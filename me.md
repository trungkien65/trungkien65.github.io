# Quick guide

## Edit New Year greetings list

- **File to edit:** `src/data/greetings.ts`
- Open that file and edit the `greetings` array: add/remove/edit strings. Each reload of **/2026** page will display **1 random greeting** from the list.

If you want to put the list in another file (e.g. config), just export the `greetings` array from that file and import it in `src/pages/2026.astro` instead of `@/data/greetings`.
