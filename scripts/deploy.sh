#!/bin/bash
# Construit le site et publie dist/ sur la branche gh-pages (GitHub Pages).
set -e
cd "$(dirname "$0")/.."
export SITE_URL="https://viktor59000.github.io" BASE_PATH="Site-Oni-Korp"
npm run build
node scripts/apply-base.mjs
touch dist/.nojekyll
cd dist
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -q -m "Déploiement $(date +%Y-%m-%d)"
git push -f "https://github.com/Viktor59000/Site-Oni-Korp.git" gh-pages
rm -rf .git
