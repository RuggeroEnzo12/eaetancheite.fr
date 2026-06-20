# EA Étanchéité — Site vitrine

Site vitrine professionnel pour **EA Étanchéité**, spécialiste de l'étanchéité en région **PACA**.

Stack : HTML5 sémantique + CSS pur + JavaScript vanilla. Aucune dépendance, ultra-rapide, SEO optimisé.

---

## Structure du projet

```
ea-etancheite-site/
├── index.html           ← page unique du site vitrine
├── styles.css           ← charte graphique + responsive
├── script.js            ← menu mobile, scroll, formulaire
├── robots.txt           ← indexation Google
├── sitemap.xml          ← plan du site pour Google
├── manifest.json        ← PWA / installation mobile
├── README.md
└── assets/
    ├── logo.svg              ← ⚠️  À REMPLACER par ton vrai logo
    ├── favicon.svg
    ├── apple-touch-icon.png  ← (optionnel) icône iOS 180x180
    └── og-image.jpg          ← (optionnel) image Open Graph 1200x630
```

---

## Étapes à faire AVANT mise en ligne (5 minutes)

### 1. Remplacer le logo

Remplace `assets/logo.svg` par ton vrai logo (format `.svg` recommandé, ou `.png` 200×200 minimum, fond transparent).

Si tu utilises un PNG, ouvre `index.html` et remplace les deux références à `assets/logo.svg` par `assets/logo.png`.

### 2. Remplir les informations de contact

Fais un **Rechercher/Remplacer** dans `index.html` et `script.js` sur ces 4 placeholders :

| Placeholder | Remplacer par | Exemple |
|---|---|---|
| `[TÉLÉPHONE]` | Ton numéro affiché | `04 91 00 00 00` |
| `[TÉLÉPHONE_E164]` | Le même au format international (pour WhatsApp) | `33491000000` |
| `[EMAIL]` | Ton email pro | `contact@ea-etancheite.fr` |
| `[ADRESSE]`, `[VILLE]`, `[CODE POSTAL]` | Adresse du siège (dans le JSON-LD) | `12 rue X`, `Marseille`, `13001` |

### 3. Configurer le formulaire de devis (Web3Forms, gratuit)

1. Va sur [https://web3forms.com](https://web3forms.com)
2. Entre ton email pro → tu reçois une **Access Key** par email
3. Dans `index.html`, remplace `[WEB3FORMS_ACCESS_KEY]` par la clé reçue
4. C'est tout : les demandes de devis arriveront directement dans ta boîte mail

> Web3Forms est 100% gratuit jusqu'à 250 soumissions/mois, sans inscription, sans backend.

### 4. (Optionnel mais recommandé) Générer une image Open Graph

L'image `og-image.jpg` (1200×630px) est celle qui apparaît quand ton site est partagé sur Facebook, WhatsApp, LinkedIn, etc.
Place-la dans `assets/og-image.jpg` — ou laisse la balise telle quelle, ce n'est pas bloquant.

---

## Mise en ligne

### Option A — Netlify (le plus simple, gratuit)

1. Va sur [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Glisse-dépose le dossier `ea-etancheite-site` entier
3. Tu obtiens une URL `xxx.netlify.app` immédiatement
4. Dans les paramètres, branche ton domaine `ea-etancheite.fr`

### Option B — Vercel

1. `npm i -g vercel` puis `vercel` dans le dossier
2. Suivre les instructions, le site est en ligne en 30s

### Option C — OVH / Hébergeur classique

Upload tout le contenu du dossier via FTP dans le répertoire `www/` ou `public_html/`.

---

## Référencement Google (étapes après mise en ligne)

### 1. Google Search Console (indispensable)

1. Va sur [https://search.google.com/search-console](https://search.google.com/search-console)
2. Ajoute la propriété `https://www.ea-etancheite.fr`
3. Vérifie la propriété (méthode "balise HTML" la plus simple — à coller dans `<head>` de `index.html`)
4. Soumets ton sitemap : `https://www.ea-etancheite.fr/sitemap.xml`

→ Google indexera ton site sous 2 à 7 jours.

### 2. Google Business Profile (CRUCIAL pour les recherches locales "étancheur Marseille")

1. Va sur [https://www.google.com/business](https://www.google.com/business)
2. Crée une fiche pour "EA Étanchéité"
3. Catégorie principale : **Couvreur** ou **Entreprise d'étanchéité**
4. Renseigne : adresse, téléphone, horaires, zone d'intervention (les 6 départements)
5. **Ajoute le lien vers `https://www.ea-etancheite.fr`** dans le champ "Site Web"
6. Ajoute 5-10 photos de tes chantiers (avant/après si possible)

→ Cette fiche apparaîtra dans Google Maps + dans le bloc à droite des recherches locales.

### 3. Annuaires professionnels (backlinks gratuits)

Inscris-toi sur ces annuaires pour booster ton SEO local :
- [Pages Jaunes](https://www.pagesjaunes.fr/) (fiche pro gratuite)
- [Houzz](https://www.houzz.fr/) (catégorie étanchéité)
- [Travaux.com](https://www.travaux.com/), [Habitatpresto](https://www.habitatpresto.com/) (génère aussi des leads)
- Annuaire de ta CMA / Chambre des Métiers locale

### 4. Vérifications techniques

Une fois en ligne, teste sur :
- [PageSpeed Insights](https://pagespeed.web.dev/) → vise > 90 sur mobile
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Rich Results Test](https://search.google.com/test/rich-results) → vérifie que le JSON-LD `RoofingContractor` est bien détecté

---

## Personnalisation rapide

### Modifier les couleurs

Tout est centralisé dans `styles.css`, section `:root` :
```css
--blue: #2563B8;      /* couleur principale (extraite du logo) */
--orange: #D88B3D;    /* couleur d'accent */
--ink: #2F3438;       /* texte */
```

### Ajouter / modifier une prestation

Dans `index.html`, section `#prestations`, duplique un bloc `<article class="service-card">`.
Pense aussi à ajouter la prestation dans le `<select>` du formulaire de devis + dans le JSON-LD du `<head>`.

### Modifier la zone d'intervention

Dans `index.html`, section `#zone` → ajoute/retire des `<li>` dans `.deps-list` et des `<span class="city-chip">` dans `.cities-cloud`.
Pense aussi à mettre à jour le JSON-LD `areaServed`.

---

## Maintenance

- **Aucune dépendance** → aucune mise à jour de sécurité à faire
- Pour modifier le contenu, édite simplement les fichiers HTML/CSS/JS dans n'importe quel éditeur
- Tout est en français, commenté et structuré clairement

---

**Conçu pour générer des demandes de devis et accroître la visibilité locale d'EA Étanchéité dans toute la région PACA.**
