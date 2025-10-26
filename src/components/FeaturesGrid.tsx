import { Zap, FileText, Settings, MessageSquare, Wrench, Shield } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Autocomplétion rapide",
    description: "Tab/Esc pour accepter ou ignorer. 2-3 variantes disponibles pour chaque contexte."
  },
  {
    icon: FileText,
    title: "Réponses avec citations",
    description: "Chaque suggestion est accompagnée de ses sources (RAG). Traçabilité totale."
  },
  {
    icon: Settings,
    title: "Préprompt configurable",
    description: "Définissez le persona, le ton et les règles de votre équipe SAV."
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Business",
    description: "Respect de la fenêtre 24h et des templates WhatsApp. Intégration native."
  },
  {
    icon: Wrench,
    title: "Actions SAV",
    description: "Statut commande, création RMA, prise de RDV. Bientôt : plus d'intégrations."
  },
  {
    icon: Shield,
    title: "Sécurité",
    description: "RGPD compliant. Hébergement EU (OVHcloud). Vos données restent chez vous."
  }
];

export const FeaturesGrid = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Fonctionnalités
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tout ce dont vos équipes SAV ont besoin pour répondre plus vite et mieux
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
