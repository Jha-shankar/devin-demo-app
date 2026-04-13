# Devin Demo App

A tiny vanilla JavaScript task tracker app designed to help understand how a simple app is structured in a GitHub repository.

## What this app does
- Add a task
- Mark a task as done
- Delete a task
- Filter tasks by all, active, or done
- Show counts

## Run locally
Because this is a static app, you can run it in any of these simple ways:

### Option 1: Open directly
Open `task-tracker.html` in a browser.

### Option 2: Python server
```bash
python -m http.server 8000
```
Then open `http://localhost:8000/output/devin-demo-app/task-tracker.html` if you run it from the workspace root.

## Suggested GitHub workflow
```bash
git init
git add .
git commit -m "Initial commit: basic task tracker"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Repo structure
- `task-tracker.html` → UI structure
- `styles.css` → styling
- `app.js` → application logic
- `README.md` → project explanation

## Why this is useful for learning Devin
This repo is intentionally small, so you can inspect how an AI coding agent would:
- understand the file structure
- modify UI behavior
- add features incrementally
- create commits and PRs against a GitHub repo
