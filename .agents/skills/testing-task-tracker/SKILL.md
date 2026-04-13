# Testing the Task Tracker App

## Overview
This is a static vanilla JS app (HTML + CSS + JS). No build step or bundler is needed.

## Running Locally

```bash
cd /home/ubuntu/repos/devin-demo-app
python3 -m http.server 8080
```

Then open `http://localhost:8080/task-tracker.html` in a browser.

**Note**: If port 8080 is in use, try another port (e.g. 8081). Kill any stale server processes with `fuser -k <port>/tcp` before starting a new one.

## Key Test Scenarios

### 1. Task Persistence (localStorage)
- Add several tasks, mark some done, edit one
- Hard reload the page (Ctrl+Shift+R)
- All tasks, done states, titles, and timestamps should be restored
- Storage key is `task-tracker-tasks` in localStorage

### 2. Inline Edit
- Hover over a task to reveal Edit/Delete buttons
- Click Edit: input appears with current title selected, Save/Cancel buttons shown
- Enter key saves, Escape key cancels
- Saving an empty title keeps the old title (no-op)

### 3. Filters
- "All" shows all tasks
- "Active" shows only tasks not marked done
- "Done" shows only completed tasks
- Counter always shows total counts regardless of filter

### 4. Clear Completed
- "Clear completed" button only appears when there are done tasks
- Clicking it removes all done tasks and hides itself

### 5. Empty States
- All filter empty: "No tasks yet. Add one above to get started!"
- Active filter empty: "All tasks are done. Great job!"
- Done filter empty: "No completed tasks yet."

## Known Considerations
- The app uses `Date.now() + Math.random()` for task IDs (floating point). This works reliably in practice but is worth noting.
- The app loads Google Fonts (Inter) at runtime. It falls back to system fonts if the CDN is unreachable.
- Testing on a different port than previous sessions gives a fresh localStorage (different origin), which is useful for clean-state testing.
- No CI is configured on this repo.

## Devin Secrets Needed
None — this is a fully static app with no authentication or API keys required.
