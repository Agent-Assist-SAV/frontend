# Agent Assist SAV — WhatsApp & co

Assistant de réponse pour équipes SAV sur messageries (WhatsApp en premier). Autocomplétion instantanée, fondée sur vos documents (corpus) et vos règles (préprompt), avec citations et actions SAV simples.

## Points clés
- Autocomplétion inline (Tab accepter, Esc ignorer), 2–3 variantes.
- RAG: réponses appuyées sur vos docs (citations cliquables).
- “Préprompt” par tenant: persona/ton/règles.
- WhatsApp Business prêt: fenêtre 24h, templates, messages interactifs.
- Outils (optionnels): statut commande, RMA, prise de RDV.
- Multilingue + résumés de fil.

## Stack
- Front: React + Vite
- Backend: Node/TypeScript (API + Webhook WhatsApp)
- Recherche: PostgreSQL + pgvector (ou Azure AI Search)
- Modèles: petit modèle pour “ghost text”, LLM cloud mini (GPT‑4o mini/Haiku) pour la version validée
- Déploiement: Docker/Compose (POC), OVHcloud (VM ou MKS) en prod

## Démarrage rapide (POC)
Prérequis: Node 20+, Docker, ngrok (ou équivalent), clé LLM/embeddings. Optionnel: compte Meta (WhatsApp Cloud API) ou Twilio Sandbox.

1) Cloner et configurer
- git clone https://github.com/votre-org/agent-assist-sav.git
- cp .env.example .env et compléter (voir ci-dessous)

2) Lancer services
- docker compose up -d  (Postgres + pgvector)
- cd backend && npm i && npm run dev
- cd frontend && npm i && npm run dev
- Ouvrir http://localhost:5173

3) Ingestion du corpus
- Déposer vos fichiers dans corpus/raw
- cd tools && npm i && npm run ingest

4) (Optionnel) WhatsApp
- ngrok http 3000 → configurer le webhook Meta sur https://votre-ngrok.io/webhooks/whatsapp
- Utiliser des templates approuvés si >24h depuis le dernier message

## .env minimal (extrait)
```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/assist

# LLM/Embeddings (au choix)
OPENAI_API_KEY=sk-...
OPENAI_COMPLETION_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-large
# ou HF (e5): HF_API_TOKEN=hf_... EMBEDDING_MODEL=intfloat/e5-large-v2

# WhatsApp Cloud API (optionnel)
WA_PHONE_NUMBER_ID=...
WA_TOKEN=EAAG...
WA_VERIFY_TOKEN=une_valeur_secrete
```

## Utilisation
- Onglet Corpus: importer fichiers, vérifier métadonnées.
- Onglet Config: définir le préprompt (persona, ton, règles).
- Chat: écrire; suggestions apparaissent en “ghost text”.
  - Tab = accepter, Ctrl+Tab = variante, Esc = ignorer
  - Icône “Sources” → voir les extraits utilisés

## Bonnes pratiques
- Citations obligatoires pour toute info spécifique.
- Mode “silence” si pas de source fiable (réduit les hallucinations).
- N’ingérez pas de PII réelle en POC; logs anonymisés par défaut.

## Roadmap (court)
- PDF/OCR, reranking, seuils de confiance
- Connecteurs: Shopify/WooCommerce, transporteurs, Zendesk/Freshdesk
- Templates WhatsApp par langue, messages interactifs
- Vision (photos dommages), scorecards qualité

## Licence
MIT

Déploiement OVHcloud: VM + Docker (POC) ou MKS managé (prod). Besoin d’un docker-compose, manifests K8s ou un guide OVHcloud succinct ? Dis-moi ton option (VM ou MKS) et je te fournis les fichiers prêts à l’emploi.