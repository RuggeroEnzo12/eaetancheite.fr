#!/bin/bash
cd "$(dirname "$0")"
git add .
git commit -m "Mise à jour site $(date '+%d/%m/%Y %H:%M')"
git push origin main
echo "✅ Site déployé sur eaetancheite.fr"
