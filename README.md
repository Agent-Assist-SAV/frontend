# Agent Assist SAV — WhatsApp & co (frontend)

Assistant de réponse pour équipes SAV, intégré aux messageries (WhatsApp en premier). Il suggère des réponses courtes et contextualisées, appuyées par vos documents (RAG avec citations) et peut déclencher des actions simples (statut commande, RMA, RDV), tout en respectant les règles WhatsApp (fenêtre 24h, templates).

## Pour qui
- SAV/Support de marques e‑commerce, retail, services.
- Plateformes relation client souhaitant un “copilot” prêt à intégrer.

## Ce que le produit apporte
- Gain de temps: autocomplétion inline (Tab accepter, Esc ignorer), 2–3 variantes.
- Fiabilité: réponses fondées sur des sources internes, citations cliquables, mode “silence” si confiance basse.
- Efficacité: détection d’intentions, résumés de fil, multilingue.
- Conformité WhatsApp: gestion automatique des templates hors 24h, messages interactifs.

## Composants produit
- Interface opérateur: zone de saisie avec “ghost text”, panneau Sources, snippets “/retour, /suivi…”, contexte client.
- Moteur d’assistance: recherche hybride (RAG), génération de suggestions, gestion templates, connecteurs SAV (status, RMA, RDV).

## Fonctionnement (en bref)
1) Analyse du message (langue, intention, contexte).
2) Recherche d’extraits pertinents dans vos docs.
3) Génération de 2–3 réponses courtes avec citations.
4) Acceptation par l’agent → options (template, boutons, lien suivi).
5) Journalisation anonymisée pour améliorer la qualité.

## Tech stack

- **React** 18 + **TypeScript** — frontend framework
- **Vite** — build tool & dev server
- **Tailwind CSS** + **shadcn/ui** — styling & components
- **React Router** — routing SPA
- **React Hook Form** + **Zod** — formulaires & validation
- **TanStack Query** — requêtes & cache
- **Radix UI** — primitives composants
- **Sonner**, **Recharts**, **Lucide** — toast, graphiques, icônes
- **ESLint** + **TypeScript** — code quality
