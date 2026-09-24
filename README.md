# SearchAPI

**https://searchapi.heiphaistos.org** — base de données mondiale d'APIs. Recherchez n'importe quelle API
**gratuite**, **freemium** ou **payante**, par mot-clé, catégorie, authentification, HTTPS et CORS.

- ~2 000 APIs dans 50+ catégories, interface FR / EN, thème clair / sombre.
- Site 100 % statique (HTML, CSS, JS sans dépendance) : hébergé sur GitHub Pages.
- L'annuaire est lui-même une API JSON : `https://searchapi.heiphaistos.org/data/apis.json`.

## Structure

```
index.html              page unique (recherche + filtres)
assets/css/style.css    styles (variables CSS, mode sombre)
assets/js/app.js        moteur de recherche côté client, i18n, synchronisation URL
data/apis.json          base complète générée (API publique du site)
data/apis.js            même base, chargée par la page (fonctionne aussi en file://)
data/paid-apis.json     liste curatée des APIs freemium / payantes (à éditer à la main)
data/extra-apis.json    ajouts communautaires (toute tarification)
scripts/build_data.py   régénère data/apis.json + data/apis.js
scripts/validate_data.py vérifie les listes JSON éditées à la main
CNAME                   domaine personnalisé GitHub Pages
```

## Sources des données

| Source | Contenu | Licence |
|---|---|---|
| [public-apis/public-apis](https://github.com/public-apis/public-apis) | ~1 900 APIs gratuites / publiques | MIT |
| `data/paid-apis.json` | ~130 APIs freemium et payantes (paiement, IA, SMS, cartes, finance…) | MIT |
| `data/extra-apis.json` | contributions de la communauté | MIT |

Un workflow GitHub Actions (`update-data.yml`) régénère la base chaque lundi à partir de public-apis.

## Ajouter une API

1. Ouvrez une [issue « Proposer une API »](https://github.com/Heiphaistos/SearchAPI/issues/new?template=new-api.yml), **ou**
2. ajoutez une entrée dans `data/extra-apis.json` (gratuite) ou `data/paid-apis.json` (freemium / payante) :

```json
{
  "name": "Mon API",
  "description": "What the API does (English preferred)",
  "url": "https://example.com/docs",
  "category": "Weather",
  "auth": "apiKey",
  "https": true,
  "cors": "yes",
  "pricing": "freemium",
  "pricing_model": "Free tier + subscription",
  "tags": ["weather", "forecast"]
}
```

Champs : `pricing` ∈ `free | freemium | paid`, `auth` ∈ `none | apiKey | OAuth | other`, `cors` ∈ `yes | no | unknown`.
Puis :

```bash
python3 scripts/validate_data.py
python3 scripts/build_data.py
```

## Développement local

```bash
python3 scripts/build_data.py       # télécharge public-apis et régénère data/
python3 -m http.server 8080         # puis ouvrir http://localhost:8080
```

L'ouverture directe de `index.html` (file://) fonctionne aussi, car la base est chargée depuis `data/apis.js`.

## Déploiement sur searchapi.heiphaistos.org

Le site est déployé par GitHub Pages via `.github/workflows/deploy.yml` à chaque push sur `main`.

1. Dans **Settings → Pages** du dépôt, choisir **Source : GitHub Actions**.
2. Dans **Settings → Pages → Custom domain**, saisir `searchapi.heiphaistos.org` (le fichier `CNAME` est déjà présent) et cocher **Enforce HTTPS** une fois le certificat émis.
3. Chez le registrar / DNS de `heiphaistos.org`, créer l'enregistrement :

   ```
   searchapi   CNAME   heiphaistos.github.io.
   ```

   (Si le compte GitHub qui héberge le dépôt n'est pas `heiphaistos`, remplacer par `<compte>.github.io`.)

Toute autre plateforme statique (Cloudflare Pages, Netlify, Vercel, Nginx) fonctionne aussi : il suffit de servir le dossier racine.

## Licence

MIT — voir [LICENSE](LICENSE). Les données de public-apis restent sous leur licence MIT d'origine.
