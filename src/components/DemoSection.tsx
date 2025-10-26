import { useState } from "react";
import { GhostInput } from "./GhostInput";
import { SourcesDrawer } from "./SourcesDrawer";
import { Button } from "@/components/ui/button";
import { getDemoSuggestions } from "@/lib/mockApi";
import { toast } from "sonner";

interface Source {
  title: string;
  snippet: string;
  url: string;
}

interface Suggestion {
  text: string;
  sources: Source[];
}

export const DemoSection = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [currentScenario, setCurrentScenario] = useState<string>("");
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [currentSources, setCurrentSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadScenario = async (scenario: string) => {
    setIsLoading(true);
    setCurrentScenario(scenario);
    try {
      const response = await getDemoSuggestions(scenario);
      setSuggestions(response.suggestions);
    } catch (error) {
      toast.error("Erreur lors du chargement des suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = (suggestion: Suggestion) => {
    toast.success("Suggestion acceptée !");
    setCurrentSources(suggestion.sources);
  };

  const handleNextVariant = () => {
    toast.info("Variante suivante");
  };

  const handleDismiss = () => {
    setSuggestions([]);
    setCurrentScenario("");
    toast.info("Suggestions ignorées");
  };

  const showSources = () => {
    if (currentSources.length > 0) {
      setIsSourcesOpen(true);
    }
  };

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Démo interactive
          </h2>
          <p className="text-lg text-muted-foreground">
            Appuyez sur <kbd className="px-2 py-1 bg-muted rounded text-sm font-semibold">Tab</kbd> pour accepter, 
            <kbd className="px-2 py-1 bg-muted rounded text-sm font-semibold ml-2">Esc</kbd> pour ignorer, 
            <kbd className="px-2 py-1 bg-muted rounded text-sm font-semibold ml-2">Ctrl+Tab</kbd> pour une autre variante.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-lg mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Choisissez un scénario :
            </label>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={currentScenario === "suivi" ? "default" : "outline"}
                onClick={() => loadScenario("suivi")}
                disabled={isLoading}
              >
                Suivi de commande
              </Button>
              <Button
                variant={currentScenario === "retour" ? "default" : "outline"}
                onClick={() => loadScenario("retour")}
                disabled={isLoading}
              >
                Retour / RMA
              </Button>
              <Button
                variant={currentScenario === "garantie" ? "default" : "outline"}
                onClick={() => loadScenario("garantie")}
                disabled={isLoading}
              >
                Garantie
              </Button>
            </div>
          </div>

          {suggestions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Votre réponse :
              </label>
              <GhostInput
                suggestions={suggestions}
                onAccept={handleAccept}
                onNextVariant={handleNextVariant}
                onDismiss={handleDismiss}
                placeholder="Commencez à taper ou utilisez Tab pour accepter la suggestion..."
              />
              
              {currentSources.length > 0 && (
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={showSources}
                  >
                    Voir les sources ({currentSources.length})
                  </Button>
                </div>
              )}
            </div>
          )}

          {suggestions.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              Sélectionnez un scénario pour voir les suggestions
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              Chargement des suggestions...
            </div>
          )}
        </div>
      </div>

      <SourcesDrawer
        sources={currentSources}
        isOpen={isSourcesOpen}
        onClose={() => setIsSourcesOpen(false)}
      />
    </section>
  );
};
