# Todo App

A local-storage-backed React todo list, built to exercise a full E2E-tested
CI/CD pipeline on GitHub.

## Development

    npm install
    npm run dev

## Build

    npm run build

## Run E2E tests locally

    npm run build
    npm run test:e2e

## Deployment

Pushing to `main` runs the E2E suite in GitHub Actions; if it passes, the app
is automatically built and deployed to GitHub Pages at:

https://giladovich.github.io/HelloWorld/
