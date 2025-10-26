interface Source {
  title: string;
  snippet: string;
  url: string;
}

interface Suggestion {
  text: string;
  sources: Source[];
}

interface DemoResponse {
  suggestions: Suggestion[];
}

const mockSuggestions: Record<string, DemoResponse> = {
  suivi: {
    suggestions: [
      {
        text: "Bonjour, je vérifie votre commande #1234. Elle est expédiée depuis hier. Livraison estimée: 27/10. Voici le lien de suivi:",
        sources: [
          {
            title: "Procédure suivi colis",
            snippet: "Consulter le suivi via le transporteur. Fournir le numéro de tracking au client. Délais de mise à jour : 2-4h.",
            url: "#/kb/suivi"
          },
          {
            title: "Politique de délais",
            snippet: "Délais standard 48-72h pour livraison France métropolitaine. DOM-TOM : 5-7 jours ouvrés.",
            url: "#/kb/delais"
          }
        ]
      },
      {
        text: "Votre colis #1234 a été expédié hier via Colissimo. Vous recevrez un SMS avec le lien de suivi sous 2h. Livraison prévue vendredi 27/10.",
        sources: [
          {
            title: "Procédure suivi colis",
            snippet: "Consulter le suivi via le transporteur. Fournir le numéro de tracking au client.",
            url: "#/kb/suivi"
          },
          {
            title: "Notifications clients",
            snippet: "SMS envoyé automatiquement à l'expédition avec lien de suivi. Délai : 2h max.",
            url: "#/kb/notifications"
          }
        ]
      }
    ]
  },
  retour: {
    suggestions: [
      {
        text: "Je peux vous générer un retour gratuit sous 30 jours. Souhaitez-vous recevoir l'étiquette ?",
        sources: [
          {
            title: "Politique retours",
            snippet: "Retours gratuits sous 30 jours. Produits en état neuf avec emballage d'origine. Remboursement sous 7 jours après réception.",
            url: "#/kb/retours"
          },
          {
            title: "Procédure RMA",
            snippet: "Créer un numéro RMA dans le système. Générer l'étiquette retour. Envoyer au client par email.",
            url: "#/kb/rma"
          }
        ]
      },
      {
        text: "Pas de souci, je crée votre retour gratuit. Vous recevrez l'étiquette par email dans 5 min. Déposez le colis en point relais sous 14 jours.",
        sources: [
          {
            title: "Politique retours",
            snippet: "Retours gratuits sous 30 jours. Produits en état neuf avec emballage d'origine.",
            url: "#/kb/retours"
          },
          {
            title: "Procédure RMA",
            snippet: "Créer un numéro RMA dans le système. Générer l'étiquette retour. Délai d'envoi email : 5 min max.",
            url: "#/kb/rma"
          }
        ]
      }
    ]
  },
  garantie: {
    suggestions: [
      {
        text: "Votre produit est sous garantie constructeur 2 ans. Je peux organiser une réparation ou un échange. Préférez-vous un dépôt en magasin ou un enlèvement à domicile ?",
        sources: [
          {
            title: "Garantie constructeur",
            snippet: "2 ans pour tous les produits électroniques. Couvre les défauts de fabrication. Preuve d'achat requise.",
            url: "#/kb/garantie"
          },
          {
            title: "Procédure SAV garantie",
            snippet: "Options : dépôt en magasin (délai 5-7j) ou enlèvement à domicile (délai 10-15j). Produit de remplacement possible selon stock.",
            url: "#/kb/sav-garantie"
          }
        ]
      },
      {
        text: "Je vérifie votre garantie... Vous êtes couvert jusqu'au 15/12/2025. Je peux vous proposer un échange standard ou une réparation. L'échange est plus rapide (3-5 jours).",
        sources: [
          {
            title: "Garantie constructeur",
            snippet: "2 ans pour tous les produits électroniques. Couvre les défauts de fabrication.",
            url: "#/kb/garantie"
          },
          {
            title: "Procédure SAV garantie",
            snippet: "Échange standard prioritaire si stock disponible. Sinon réparation avec délai moyen 10 jours.",
            url: "#/kb/sav-garantie"
          }
        ]
      }
    ]
  }
};

export const getDemoSuggestions = (scenario: string): Promise<DemoResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSuggestions[scenario] || mockSuggestions.suivi);
    }, 300);
  });
};

export const sendContactForm = (data: {
  name: string;
  email: string;
  company: string;
  message: string;
}): Promise<{ ok: boolean }> => {
  return new Promise((resolve) => {
    console.log("Contact form submitted:", data);
    setTimeout(() => {
      resolve({ ok: true });
    }, 500);
  });
};
