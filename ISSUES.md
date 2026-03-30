# Issue #1

Title: git diff fails on untracked or unstaged files

### Problem

Running the CLI on a file that is not staged causes a crash:
fatal: ambiguous argument 'tests/.gitkeep'

### Cause

The tool runs:
git diff --cached <file>

This fails when the file is:

- untracked
- not staged

### Expected Behavior

- Tool should not crash
- Should either:
  - skip unstaged files
  - or show a message like "No staged changes found"

### Suggested Fix

Use:
git diff --cached -- <file>

Also handle empty staged files case gracefully.

### Notes

This affects first-time users who haven't staged files yet.
