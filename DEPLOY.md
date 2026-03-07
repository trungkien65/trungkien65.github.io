# Deploy to GitHub Pages Guide

## Step 1: Prepare Repository

1. Create a new repository on GitHub (or use existing repository)
2. Clone repository to your machine (if not already)

## Step 2: Push code to GitHub

```bash
# Initialize git (if not already)
git init

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Add all files
git add .

# Commit
git commit -m "Initial commit: Todo List app"

# Push to GitHub
git push -u origin main
```

## Step 3: Configure GitHub Pages

1. Go to repository on GitHub
2. Go to **Settings** > **Pages**
3. In **Source** section, select **GitHub Actions**
4. Save

## Step 4: Automatic Deploy

After configuration, each time you push code to `main` branch, GitHub Actions will automatically:
- Build project
- Deploy to GitHub Pages

You can view deploy progress in the **Actions** tab of the repository.

## Verify Result

After successful deploy, site will be available at:
`https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## Notes

- Ensure repository is public (or you have GitHub Pro/Team for private)
- Workflow file is at `.github/workflows/deploy.yml`
- Build output will be in the `dist/` folder
