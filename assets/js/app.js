/* SearchAPI - client side search over data/apis.js (window.SEARCHAPI_DATA). No dependencies. */
(function () {
  'use strict';

  var PAGE_SIZE = 48;
  var SUGGEST_URL = 'https://github.com/Heiphaistos/SearchAPI/issues/new?template=new-api.yml';

  /* ---------------------------------------------------------------- i18n */
  var I18N = {
    fr: {
      skip: 'Aller aux résultats',
      jsonApi: 'API JSON',
      theme: 'Changer de thème',
      heroTitle: "Trouvez n'importe quelle API, gratuite ou payante",
      heroSub: "Une base de données mondiale d'APIs publiques : recherchez par nom, mot-clé, catégorie, type d'authentification, HTTPS ou CORS.",
      searchLabel: 'Rechercher une API',
      searchPlaceholder: 'Météo, paiement, traduction, crypto, IA…',
      clear: 'Effacer',
      all: 'Toutes', free: 'Gratuites', freemium: 'Freemium', paid: 'Payantes',
      statApis: 'APIs', statCategories: 'catégories', statNoAuth: 'sans clé', updated: 'Mise à jour',
      categories: 'Catégories', allCategories: 'Toutes', filterCategories: 'Filtrer les catégories…',
      auth: 'Auth', any: 'Toutes', authNone: 'Sans clé', other: 'Autre', yes: 'Oui', no: 'Non', unknown: 'Inconnu',
      sort: 'Tri', sortRelevance: 'Pertinence', sortName: 'Nom A→Z', sortCategory: 'Catégorie',
      random: '🎲 Au hasard', reset: 'Réinitialiser', loadMore: 'Afficher plus',
      emptyTitle: 'Aucune API ne correspond à votre recherche.',
      emptyHint: 'Essayez un autre mot-clé, retirez un filtre, ou proposez cette API !',
      suggest: 'Proposer une API',
      aboutTitle: 'À propos de SearchAPI',
      aboutText: "SearchAPI est un annuaire mondial et open source d'APIs. Les APIs gratuites proviennent du projet communautaire public-apis, complétées par une liste curatée d'APIs freemium et payantes. Tout est consultable ici, et l'annuaire complet est lui-même disponible en JSON.",
      contribTitle: 'Contribuer',
      contribText: "Une API manque ? Ouvrez une issue ou une pull request sur GitHub : un fichier JSON suffit pour ajouter une API gratuite, freemium ou payante.",
      apiTitle: 'Utiliser la base en JSON',
      apiText: 'Toute la base, avec catégories, tarification, authentification, HTTPS et CORS.',
      footerLicense: 'Code et données sous licence MIT.',
      footerSource: 'Données gratuites issues de',
      results: function (n, total) { return n === total ? n + ' APIs' : n + ' API' + (n > 1 ? 's' : '') + ' sur ' + total; },
      openDocs: 'Documentation ↗', copy: 'Copier le lien', copied: 'Copié !',
      httpsYes: 'HTTPS', httpsNo: 'HTTP seulement', corsYes: 'CORS', corsNo: 'Pas de CORS', corsUnknown: 'CORS inconnu',
      authNoneChip: 'Sans clé', pricingFree: 'Gratuite', pricingFreemium: 'Freemium', pricingPaid: 'Payante',
      filterQuery: 'Recherche', filterCategory: 'Catégorie', filterAuth: 'Auth', filterHttps: 'HTTPS', filterCors: 'CORS',
      removeFilter: 'Retirer ce filtre'
    },
    en: {
      skip: 'Skip to results',
      jsonApi: 'JSON API',
      theme: 'Toggle theme',
      heroTitle: 'Find any API, free or paid',
      heroSub: 'A worldwide database of public APIs: search by name, keyword, category, authentication type, HTTPS or CORS.',
      searchLabel: 'Search an API',
      searchPlaceholder: 'Weather, payments, translation, crypto, AI…',
      clear: 'Clear',
      all: 'All', free: 'Free', freemium: 'Freemium', paid: 'Paid',
      statApis: 'APIs', statCategories: 'categories', statNoAuth: 'no key needed', updated: 'Updated',
      categories: 'Categories', allCategories: 'All', filterCategories: 'Filter categories…',
      auth: 'Auth', any: 'Any', authNone: 'No key', other: 'Other', yes: 'Yes', no: 'No', unknown: 'Unknown',
      sort: 'Sort', sortRelevance: 'Relevance', sortName: 'Name A→Z', sortCategory: 'Category',
      random: '🎲 Random', reset: 'Reset', loadMore: 'Show more',
      emptyTitle: 'No API matches your search.',
      emptyHint: 'Try another keyword, remove a filter, or suggest this API!',
      suggest: 'Suggest an API',
      aboutTitle: 'About SearchAPI',
      aboutText: 'SearchAPI is a worldwide, open source directory of APIs. Free APIs come from the community project public-apis, extended with a curated list of freemium and paid APIs. Everything is searchable here, and the whole directory is itself available as JSON.',
      contribTitle: 'Contribute',
      contribText: 'Missing an API? Open an issue or a pull request on GitHub: a JSON file is all it takes to add a free, freemium or paid API.',
      apiTitle: 'Use the database as JSON',
      apiText: 'The whole database, with categories, pricing, authentication, HTTPS and CORS.',
      footerLicense: 'Code and data under the MIT license.',
      footerSource: 'Free API data from',
      results: function (n, total) { return n === total ? n + ' APIs' : n + ' API' + (n > 1 ? 's' : '') + ' of ' + total; },
      openDocs: 'Documentation ↗', copy: 'Copy link', copied: 'Copied!',
      httpsYes: 'HTTPS', httpsNo: 'HTTP only', corsYes: 'CORS', corsNo: 'No CORS', corsUnknown: 'CORS unknown',
      authNoneChip: 'No key', pricingFree: 'Free', pricingFreemium: 'Freemium', pricingPaid: 'Paid',
      filterQuery: 'Search', filterCategory: 'Category', filterAuth: 'Auth', filterHttps: 'HTTPS', filterCors: 'CORS',
      removeFilter: 'Remove this filter'
    }
  };

  var CATEGORY_FR = {
    'Animals': 'Animaux', 'Anime': 'Anime', 'Anti-Malware': 'Anti-malware', 'Art & Design': 'Art & design',
    'Authentication & Authorization': 'Authentification', 'Blockchain': 'Blockchain', 'Books': 'Livres',
    'Business': 'Entreprise', 'Calendar': 'Calendrier', 'Cloud Storage & File Sharing': 'Stockage cloud & fichiers',
    'Continuous Integration': 'Intégration continue', 'Cryptocurrency': 'Cryptomonnaies', 'Currency Exchange': 'Taux de change',
    'Data Validation': 'Validation de données', 'Development': 'Développement', 'Dictionaries': 'Dictionnaires',
    'Documents & Productivity': 'Documents & productivité', 'Email': 'E-mail', 'Entertainment': 'Divertissement',
    'Environment': 'Environnement', 'Events': 'Événements', 'Finance': 'Finance', 'Food & Drink': 'Cuisine & boissons',
    'Games & Comics': 'Jeux & BD', 'Geocoding': 'Géolocalisation & cartes', 'Government': 'Gouvernement', 'Health': 'Santé',
    'Jobs': 'Emploi', 'Machine Learning': 'IA & machine learning', 'Messaging': 'Messagerie & SMS', 'Music': 'Musique',
    'News': 'Actualités', 'Open Data': 'Open data', 'Open Source Projects': 'Projets open source', 'Patent': 'Brevets',
    'Payments': 'Paiements', 'Personality': 'Personnalité', 'Phone': 'Téléphone', 'Photography': 'Photo & images',
    'Programming': 'Programmation', 'Science & Math': 'Sciences & maths', 'Security': 'Sécurité', 'Shopping': 'E-commerce',
    'Social': 'Réseaux sociaux', 'Sports & Fitness': 'Sport & fitness', 'Test Data': 'Données de test',
    'Text Analysis': 'Analyse de texte & traduction', 'Tracking': 'Suivi & livraison', 'Transportation': 'Transport & voyage',
    'URL Shorteners': "Raccourcisseurs d'URL", 'Vehicle': 'Véhicules', 'Video': 'Vidéo', 'Weather': 'Météo', 'Other': 'Autres'
  };

  /* Synonyms broaden the search: typing "météo" also finds "weather". */
  var SYNONYMS = {
    'meteo': ['weather', 'forecast'], 'temps': ['weather'], 'paiement': ['payment', 'payments', 'checkout', 'billing'],
    'traduction': ['translation', 'translate'], 'ia': ['ai', 'machine learning', 'llm'], 'ai': ['machine learning', 'llm'],
    'crypto': ['cryptocurrency', 'bitcoin', 'blockchain'], 'carte': ['map', 'maps', 'geocoding'], 'cartes': ['map', 'maps'],
    'sms': ['messaging', 'twilio'], 'mail': ['email'], 'courriel': ['email'], 'email': ['mail'],
    'film': ['movie', 'movies'], 'films': ['movies'], 'musique': ['music'], 'jeu': ['game'], 'jeux': ['games'],
    'livre': ['book', 'books'], 'livres': ['books'], 'actualite': ['news'], 'actualites': ['news'], 'nouvelles': ['news'],
    'sante': ['health'], 'bourse': ['stock', 'stocks', 'finance'], 'action': ['stock'], 'devise': ['currency'], 'devises': ['currency'],
    'image': ['photo', 'images', 'picture'], 'images': ['photo', 'pictures'], 'photo': ['image'], 'video': ['videos'],
    'chat': ['cat', 'cats'], 'chien': ['dog', 'dogs'], 'animaux': ['animals'], 'voiture': ['car', 'vehicle'], 'vehicule': ['vehicle'],
    'vol': ['flight', 'flights'], 'vols': ['flights'], 'avion': ['flight', 'aviation'], 'train': ['transit', 'rail'],
    'emploi': ['job', 'jobs'], 'recette': ['recipe', 'recipes'], 'recettes': ['recipes'], 'nourriture': ['food'],
    'securite': ['security'], 'test': ['mock', 'fake', 'placeholder'], 'faux': ['fake', 'mock'], 'gouvernement': ['government'],
    'espace': ['space', 'nasa'], 'science': ['sciences'], 'dictionnaire': ['dictionary'], 'blague': ['joke', 'jokes'], 'blagues': ['jokes'],
    'citation': ['quote', 'quotes'], 'citations': ['quotes'], 'pays': ['country', 'countries'], 'ville': ['city'],
    'telephone': ['phone'], 'adresse': ['address', 'geocoding'], 'ip': ['geolocation'], 'stockage': ['storage'], 'fichier': ['file', 'files'],
    'reseau': ['social'], 'reseaux': ['social'], 'sport': ['sports', 'football'], 'foot': ['football', 'soccer'],
    'gratuit': ['free'], 'gratuite': ['free'], 'payant': ['paid'], 'payante': ['paid'], 'traduire': ['translate'],
    'texte': ['text'], 'parole': ['speech', 'voice'], 'voix': ['voice', 'speech'], 'raccourcisseur': ['shortener', 'url']
  };

  /* ---------------------------------------------------------------- data */
  var DATA = window.SEARCHAPI_DATA;
  if (!DATA || !DATA.apis) {
    document.getElementById('results').innerHTML = '<p class="muted">Data file missing. Run <code>python3 scripts/build_data.py</code>.</p>';
    return;
  }
  var APIS = DATA.apis.map(function (api) {
    var hay = [api.name, api.description, api.category, (api.tags || []).join(' '), api.pricing_model || ''].join(' ');
    api._name = normalize(api.name);
    api._desc = normalize(api.description);
    api._cat = normalize(api.category);
    api._catFr = normalize(CATEGORY_FR[api.category] || '');
    api._tags = normalize((api.tags || []).join(' '));
    api._hay = normalize(hay) + ' ' + api._catFr;
    return api;
  });

  /* --------------------------------------------------------------- state */
  var state = {
    q: '', pricing: 'all', category: '', auth: 'all', https: 'all', cors: 'all', sort: 'relevance',
    lang: 'fr', page: 1
  };
  var els = {};
  ['q', 'clearSearch', 'pricingTabs', 'catList', 'catFilter', 'resetCategory', 'authFilter', 'httpsFilter', 'corsFilter',
    'sortSelect', 'randomBtn', 'resetAll', 'resultCount', 'activeFilters', 'results', 'loadMore', 'empty', 'themeToggle',
    'langToggle', 'cardTemplate', 'stats', 'year'].forEach(function (id) { els[id] = document.getElementById(id); });

  var lastResults = [];

  /* ------------------------------------------------------------- helpers */
  function normalize(str) {
    return String(str || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  function t(key) {
    var dict = I18N[state.lang] || I18N.fr;
    return dict[key] !== undefined ? dict[key] : (I18N.fr[key] !== undefined ? I18N.fr[key] : key);
  }
  function catLabel(cat) {
    return state.lang === 'fr' ? (CATEGORY_FR[cat] || cat) : cat;
  }
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function escapeRegExp(str) { return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function highlight(text, tokens) {
    var safe = escapeHtml(text);
    if (!tokens.length) return safe;
    var parts = tokens.filter(function (tk) { return tk.length >= 2; }).map(escapeRegExp);
    if (!parts.length) return safe;
    var re = new RegExp('(' + parts.join('|') + ')', 'gi');
    /* Match on a normalized copy so accents in the text still highlight. */
    var norm = normalize(text);
    if (norm.length !== text.length) return safe; /* rare: skip highlight when normalisation changes length */
    var out = '';
    var last = 0;
    var m;
    while ((m = re.exec(norm)) !== null) {
      out += escapeHtml(text.slice(last, m.index)) + '<mark>' + escapeHtml(text.slice(m.index, m.index + m[0].length)) + '</mark>';
      last = m.index + m[0].length;
      if (m[0].length === 0) re.lastIndex++;
    }
    return out + escapeHtml(text.slice(last));
  }
  function formatNumber(n) { return n.toLocaleString(state.lang === 'fr' ? 'fr-FR' : 'en-US'); }
  function debounce(fn, ms) {
    var timer;
    return function () { var args = arguments; clearTimeout(timer); timer = setTimeout(function () { fn.apply(null, args); }, ms); };
  }

  /* --------------------------------------------------------------- search */
  function tokenize(q) {
    var base = normalize(q).split(/[\s,;]+/).filter(Boolean);
    var expanded = [];
    base.forEach(function (tk) {
      expanded.push(tk);
      (SYNONYMS[tk] || []).forEach(function (s) { if (expanded.indexOf(s) === -1) expanded.push(s); });
    });
    return { base: base, all: expanded };
  }

  function score(api, tokens) {
    if (!tokens.base.length) return 1;
    var total = 0;
    var qFull = tokens.base.join(' ');
    if (api._name === qFull) total += 100;
    else if (api._name.indexOf(qFull) === 0) total += 60;
    else if (api._name.indexOf(qFull) !== -1) total += 40;
    for (var i = 0; i < tokens.base.length; i++) {
      var tk = tokens.base[i];
      var syns = SYNONYMS[tk] || [];
      var hit = matchToken(api, tk);
      if (!hit) {
        for (var j = 0; j < syns.length && !hit; j++) hit = matchToken(api, syns[j]) * 0.8;
      }
      if (!hit) return 0; /* every token (or one of its synonyms) must match */
      total += hit;
    }
    return total;
  }

  function matchToken(api, tk) {
    var s = 0;
    if (api._name.indexOf(tk) !== -1) s += api._name.indexOf(tk) === 0 ? 30 : 20;
    if (api._cat.indexOf(tk) !== -1 || api._catFr.indexOf(tk) !== -1) s += 12;
    if (api._tags.indexOf(tk) !== -1) s += 10;
    if (api._desc.indexOf(tk) !== -1) s += 8;
    if (!s && api._hay.indexOf(tk) !== -1) s += 3;
    return s;
  }

  function passesFilters(api) {
    if (state.pricing !== 'all' && api.pricing !== state.pricing) return false;
    if (state.category && api.category !== state.category) return false;
    if (state.auth !== 'all') {
      if (state.auth === 'other') { if (api.auth === 'none' || api.auth === 'apiKey' || api.auth === 'OAuth') return false; }
      else if (api.auth !== state.auth) return false;
    }
    if (state.https !== 'all' && api.https !== (state.https === 'yes')) return false;
    if (state.cors !== 'all' && api.cors !== state.cors) return false;
    return true;
  }

  function runSearch() {
    var tokens = tokenize(state.q);
    var results = [];
    for (var i = 0; i < APIS.length; i++) {
      var api = APIS[i];
      if (!passesFilters(api)) continue;
      var s = score(api, tokens);
      if (s > 0) results.push({ api: api, score: s });
    }
    if (state.sort === 'name' || (state.sort === 'relevance' && !tokens.base.length)) {
      results.sort(function (a, b) { return a.api.name.localeCompare(b.api.name, undefined, { sensitivity: 'base' }); });
    } else if (state.sort === 'category') {
      results.sort(function (a, b) {
        return catLabel(a.api.category).localeCompare(catLabel(b.api.category)) || a.api.name.localeCompare(b.api.name, undefined, { sensitivity: 'base' });
      });
    } else {
      results.sort(function (a, b) { return b.score - a.score || a.api.name.localeCompare(b.api.name, undefined, { sensitivity: 'base' }); });
    }
    return { tokens: tokens, results: results };
  }

  /* -------------------------------------------------------------- render */
  function render() {
    var out = runSearch();
    lastResults = out.results;
    var total = APIS.length;
    var shown = out.results.slice(0, PAGE_SIZE * state.page);

    els.results.innerHTML = '';
    var frag = document.createDocumentFragment();
    shown.forEach(function (r) { frag.appendChild(renderCard(r.api, out.tokens.all)); });
    els.results.appendChild(frag);

    els.resultCount.textContent = t('results')(out.results.length, total);
    els.loadMore.hidden = shown.length >= out.results.length;
    els.empty.hidden = out.results.length > 0;
    els.clearSearch.hidden = !state.q;

    renderActiveFilters();
    renderCategoryCounts();
    updateTabCounts();
    syncUrl();
  }

  function renderCard(api, tokens) {
    var node = els.cardTemplate.content.firstElementChild.cloneNode(true);
    var titleLink = node.querySelector('.card-title a');
    titleLink.href = api.url;
    titleLink.innerHTML = highlight(api.name, tokens);

    var badge = node.querySelector('.badge-pricing');
    badge.classList.add('badge-' + api.pricing);
    badge.textContent = t('pricing' + api.pricing.charAt(0).toUpperCase() + api.pricing.slice(1));

    node.querySelector('.card-desc').innerHTML = highlight(api.description, tokens);

    var catBtn = node.querySelector('.chip-cat');
    catBtn.textContent = catLabel(api.category);
    catBtn.title = api.category;
    catBtn.addEventListener('click', function () { setCategory(api.category); window.scrollTo({ top: els.results.offsetTop - 90, behavior: 'smooth' }); });

    var authChip = node.querySelector('.meta-auth .chip');
    authChip.textContent = api.auth === 'none' ? '🔓 ' + t('authNoneChip') : '🔑 ' + api.auth;
    if (api.auth === 'none') authChip.classList.add('chip-ok');

    var httpsChip = node.querySelector('.meta-https .chip');
    httpsChip.textContent = api.https ? '🔒 ' + t('httpsYes') : '⚠️ ' + t('httpsNo');
    httpsChip.classList.add(api.https ? 'chip-ok' : 'chip-bad');

    var corsChip = node.querySelector('.meta-cors .chip');
    corsChip.textContent = api.cors === 'yes' ? '🌐 ' + t('corsYes') : api.cors === 'no' ? '🚫 ' + t('corsNo') : '❔ ' + t('corsUnknown');
    if (api.cors !== 'unknown') corsChip.classList.add(api.cors === 'yes' ? 'chip-ok' : 'chip-warn');

    if (api.pricing !== 'free' && api.pricing_model) {
      node.querySelector('.card-pricing-model').textContent = '💳 ' + api.pricing_model;
    }

    var link = node.querySelector('.card-link');
    link.href = api.url;
    link.textContent = t('openDocs');

    var copy = node.querySelector('.card-copy');
    copy.textContent = t('copy');
    copy.addEventListener('click', function () {
      var text = api.url;
      var done = function () {
        copy.textContent = t('copied');
        copy.classList.add('is-copied');
        setTimeout(function () { copy.textContent = t('copy'); copy.classList.remove('is-copied'); }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
      else { window.prompt('URL', text); }
    });
    return node;
  }

  function renderActiveFilters() {
    var chips = [];
    if (state.q) chips.push({ key: 'q', label: t('filterQuery') + ' : ' + state.q });
    if (state.category) chips.push({ key: 'category', label: t('filterCategory') + ' : ' + catLabel(state.category) });
    if (state.auth !== 'all') chips.push({ key: 'auth', label: t('filterAuth') + ' : ' + (state.auth === 'none' ? t('authNone') : state.auth === 'other' ? t('other') : state.auth) });
    if (state.https !== 'all') chips.push({ key: 'https', label: t('filterHttps') + ' : ' + t(state.https) });
    if (state.cors !== 'all') chips.push({ key: 'cors', label: t('filterCors') + ' : ' + t(state.cors) });
    els.activeFilters.innerHTML = '';
    chips.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.title = t('removeFilter');
      b.textContent = c.label + ' ✕';
      b.addEventListener('click', function () {
        if (c.key === 'q') { state.q = ''; els.q.value = ''; }
        else if (c.key === 'category') state.category = '';
        else { state[c.key] = 'all'; els[c.key + 'Filter'].value = 'all'; }
        state.page = 1;
        render();
      });
      els.activeFilters.appendChild(b);
    });
  }

  /* Category counts respect the pricing tab and the query, so the sidebar doubles as a facet. */
  function renderCategoryCounts() {
    var tokens = tokenize(state.q);
    var counts = {};
    APIS.forEach(function (api) {
      if (state.pricing !== 'all' && api.pricing !== state.pricing) return;
      if (score(api, tokens) <= 0) return;
      counts[api.category] = (counts[api.category] || 0) + 1;
    });
    var filter = normalize(els.catFilter.value);
    var cats = DATA.categories.slice().sort(function (a, b) { return catLabel(a).localeCompare(catLabel(b)); });
    els.catList.innerHTML = '';
    cats.forEach(function (cat) {
      var label = catLabel(cat);
      if (filter && normalize(label).indexOf(filter) === -1 && normalize(cat).indexOf(filter) === -1) return;
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      if (state.category === cat) btn.classList.add('is-active');
      var name = document.createElement('span');
      name.textContent = label;
      var count = document.createElement('span');
      count.className = 'count';
      count.textContent = counts[cat] || 0;
      btn.appendChild(name);
      btn.appendChild(count);
      btn.addEventListener('click', function () { setCategory(state.category === cat ? '' : cat); });
      li.appendChild(btn);
      els.catList.appendChild(li);
    });
  }

  function updateTabCounts() {
    var tokens = tokenize(state.q);
    var counts = { all: 0, free: 0, freemium: 0, paid: 0 };
    APIS.forEach(function (api) {
      if (state.category && api.category !== state.category) return;
      if (score(api, tokens) <= 0) return;
      counts.all++;
      counts[api.pricing]++;
    });
    els.pricingTabs.querySelectorAll('[data-count]').forEach(function (el) {
      el.textContent = formatNumber(counts[el.getAttribute('data-count')]);
    });
    els.pricingTabs.querySelectorAll('.tab').forEach(function (tab) {
      var active = tab.getAttribute('data-pricing') === state.pricing;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function renderStats() {
    var noauth = APIS.filter(function (a) { return a.auth === 'none'; }).length;
    var updated = DATA.generated_at ? new Date(DATA.generated_at) : null;
    els.stats.querySelector('[data-stat="total"]').textContent = formatNumber(APIS.length);
    els.stats.querySelector('[data-stat="categories"]').textContent = formatNumber(DATA.categories.length);
    els.stats.querySelector('[data-stat="noauth"]').textContent = formatNumber(noauth);
    els.stats.querySelector('[data-stat="updated"]').textContent = updated
      ? updated.toLocaleDateString(state.lang === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : '–';
  }

  function applyI18n() {
    document.documentElement.lang = state.lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) { el.placeholder = t(el.getAttribute('data-i18n-placeholder')); });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    els.langToggle.textContent = state.lang === 'fr' ? 'EN' : 'FR';
    document.title = state.lang === 'fr'
      ? "SearchAPI – Trouvez n'importe quelle API gratuite ou payante"
      : 'SearchAPI – Find any free or paid API';
    renderStats();
  }

  /* ---------------------------------------------------------------- url */
  function syncUrl() {
    var p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.pricing !== 'all') p.set('pricing', state.pricing);
    if (state.category) p.set('cat', state.category);
    if (state.auth !== 'all') p.set('auth', state.auth);
    if (state.https !== 'all') p.set('https', state.https);
    if (state.cors !== 'all') p.set('cors', state.cors);
    if (state.sort !== 'relevance') p.set('sort', state.sort);
    var qs = p.toString();
    var url = window.location.pathname + (qs ? '?' + qs : '');
    if (url !== window.location.pathname + window.location.search) history.replaceState(null, '', url);
  }

  function readUrl() {
    var p = new URLSearchParams(window.location.search);
    state.q = p.get('q') || '';
    state.pricing = ['free', 'freemium', 'paid'].indexOf(p.get('pricing')) !== -1 ? p.get('pricing') : 'all';
    state.category = DATA.categories.indexOf(p.get('cat')) !== -1 ? p.get('cat') : '';
    state.auth = ['none', 'apiKey', 'OAuth', 'other'].indexOf(p.get('auth')) !== -1 ? p.get('auth') : 'all';
    state.https = ['yes', 'no'].indexOf(p.get('https')) !== -1 ? p.get('https') : 'all';
    state.cors = ['yes', 'no', 'unknown'].indexOf(p.get('cors')) !== -1 ? p.get('cors') : 'all';
    state.sort = ['name', 'category'].indexOf(p.get('sort')) !== -1 ? p.get('sort') : 'relevance';
    var lang = p.get('lang') || safeStorage('get', 'searchapi.lang') || (navigator.language || 'fr').slice(0, 2);
    state.lang = lang === 'en' ? 'en' : 'fr';
    els.q.value = state.q;
    els.authFilter.value = state.auth;
    els.httpsFilter.value = state.https;
    els.corsFilter.value = state.cors;
    els.sortSelect.value = state.sort;
  }

  function safeStorage(op, key, value) {
    try {
      if (op === 'get') return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (e) { return null; }
    return null;
  }

  /* -------------------------------------------------------------- events */
  function setCategory(cat) {
    state.category = cat;
    state.page = 1;
    render();
  }

  var onInput = debounce(function () {
    state.q = els.q.value.trim();
    state.page = 1;
    render();
  }, 120);
  els.q.addEventListener('input', onInput);
  els.q.addEventListener('keydown', function (e) { if (e.key === 'Escape') { els.q.value = ''; onInput(); } });
  els.clearSearch.addEventListener('click', function () { els.q.value = ''; state.q = ''; state.page = 1; render(); els.q.focus(); });

  els.pricingTabs.addEventListener('click', function (e) {
    var tab = e.target.closest('.tab');
    if (!tab) return;
    state.pricing = tab.getAttribute('data-pricing');
    state.page = 1;
    render();
  });

  ['auth', 'https', 'cors'].forEach(function (key) {
    els[key + 'Filter'].addEventListener('change', function () { state[key] = this.value; state.page = 1; render(); });
  });
  els.sortSelect.addEventListener('change', function () { state.sort = this.value; state.page = 1; render(); });
  els.catFilter.addEventListener('input', debounce(renderCategoryCounts, 80));
  els.resetCategory.addEventListener('click', function () { setCategory(''); });
  els.loadMore.addEventListener('click', function () { state.page++; render(); });

  els.resetAll.addEventListener('click', function () {
    state.q = ''; state.pricing = 'all'; state.category = ''; state.auth = 'all'; state.https = 'all'; state.cors = 'all';
    state.sort = 'relevance'; state.page = 1;
    els.q.value = ''; els.authFilter.value = 'all'; els.httpsFilter.value = 'all'; els.corsFilter.value = 'all'; els.sortSelect.value = 'relevance';
    els.catFilter.value = '';
    render();
  });

  els.randomBtn.addEventListener('click', function () {
    var pool = lastResults.length ? lastResults.map(function (r) { return r.api; }) : APIS;
    var api = pool[Math.floor(Math.random() * pool.length)];
    els.q.value = api.name;
    state.q = api.name;
    state.page = 1;
    render();
    window.scrollTo({ top: els.results.offsetTop - 90, behavior: 'smooth' });
  });

  els.langToggle.addEventListener('click', function () {
    state.lang = state.lang === 'fr' ? 'en' : 'fr';
    safeStorage('set', 'searchapi.lang', state.lang);
    applyI18n();
    render();
  });

  els.themeToggle.addEventListener('click', function () {
    var root = document.documentElement;
    var current = root.getAttribute('data-theme');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = current ? current === 'dark' : prefersDark;
    var next = isDark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    safeStorage('set', 'searchapi.theme', next);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== els.q && !/^(input|textarea|select)$/i.test(document.activeElement.tagName)) {
      e.preventDefault();
      els.q.focus();
      els.q.select();
    }
  });

  window.addEventListener('popstate', function () { readUrl(); applyI18n(); render(); });

  /* ---------------------------------------------------------------- init */
  var savedTheme = safeStorage('get', 'searchapi.theme');
  if (savedTheme === 'dark' || savedTheme === 'light') document.documentElement.setAttribute('data-theme', savedTheme);
  els.year.textContent = String(new Date().getFullYear());
  readUrl();
  applyI18n();
  render();
})();
