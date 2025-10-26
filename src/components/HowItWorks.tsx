import { Search, FileSearch, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Message entrant → intention/langue",
    description: "L'assistant détecte automatiquement l'intention du client et la langue utilisée."
  },
  {
    icon: FileSearch,
    title: "Recherche dans vos documents (RAG)",
    description: "Le système recherche les extraits pertinents dans votre base de connaissances."
  },
  {
    icon: CheckCircle,
    title: "Suggestion avec sources → validation (Tab)",
    description: "Une réponse courte est proposée avec ses sources. L'agent valide en un appui sur Tab."
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-muted-foreground">
            Un processus simple en 3 étapes
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      Étape {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
