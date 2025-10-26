import { useState } from "react";
import { GhostInput } from "@/components/GhostInput";
import { SourcesDrawer } from "@/components/SourcesDrawer";
import { Button } from "@/components/ui/button";
import { getDemoSuggestions } from "@/lib/mockApi";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, FileText, Upload, ExternalLink } from "lucide-react";

interface Source {
  title: string;
  snippet: string;
  url: string;
}

interface Suggestion {
  text: string;
  sources: Source[];
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Demo() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [currentScenario, setCurrentScenario] = useState<string>("");
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [currentSources, setCurrentSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      content: "Bonjour, où est ma commande #1234 ?",
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [acceptedResponse, setAcceptedResponse] = useState("");

  const loadScenario = async (scenario: string) => {
    setIsLoading(true);
    setCurrentScenario(scenario);
    setAcceptedResponse("");
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
    setAcceptedResponse(suggestion.text);
    setCurrentSources(suggestion.sources);
    toast.success("Suggestion acceptée !");
  };

  const handleNextVariant = () => {
    toast.info("Variante suivante");
  };

  const handleDismiss = () => {
    setSuggestions([]);
    setCurrentScenario("");
    setAcceptedResponse("");
    toast.info("Suggestions ignorées");
  };

  const handleSend = () => {
    if (!acceptedResponse.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: acceptedResponse,
      timestamp: new Date()
    };
    
    setMessages([...messages, newMessage]);
    setAcceptedResponse("");
    setSuggestions([]);
    setCurrentScenario("");
    toast.success("Réponse envoyée !");
  };

  const showSources = () => {
    if (currentSources.length > 0) {
      setIsSourcesOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Retour</span>
          </Link>
          <h1 className="text-lg font-semibold text-foreground">
            Interface Agent SAV
          </h1>
          <div className="w-24"></div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Conversation */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Conversation #CS-2024-1234
              </h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === "user"
                          ? "bg-muted text-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scenarios */}
              <div className="mb-4 pb-4 border-b border-border">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Scénarios suggérés :
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={currentScenario === "suivi" ? "default" : "outline"}
                    size="sm"
                    onClick={() => loadScenario("suivi")}
                    disabled={isLoading}
                  >
                    Suivi de commande
                  </Button>
                  <Button
                    variant={currentScenario === "retour" ? "default" : "outline"}
                    size="sm"
                    onClick={() => loadScenario("retour")}
                    disabled={isLoading}
                  >
                    Retour / RMA
                  </Button>
                  <Button
                    variant={currentScenario === "garantie" ? "default" : "outline"}
                    size="sm"
                    onClick={() => loadScenario("garantie")}
                    disabled={isLoading}
                  >
                    Garantie
                  </Button>
                </div>
              </div>

              {/* Response Area */}
              {suggestions.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Réponse assistée :
                  </label>
                  <GhostInput
                    suggestions={suggestions}
                    onAccept={handleAccept}
                    onNextVariant={handleNextVariant}
                    onDismiss={handleDismiss}
                  />
                  
                  {/* Sources citées */}
                  {currentSources.length > 0 && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Sources citées ({currentSources.length})
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={showSources}
                          className="text-xs"
                        >
                          Voir détails
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {currentSources.slice(0, 2).map((source, idx) => (
                          <div key={idx} className="text-xs bg-background p-2 rounded border border-border">
                            <div className="font-medium text-foreground mb-1 flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" />
                              {source.title}
                            </div>
                            <p className="text-muted-foreground line-clamp-2">
                              {source.snippet}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 flex items-center gap-3">
                    <Button
                      onClick={handleSend}
                      disabled={!acceptedResponse.trim()}
                      className="gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Envoyer la réponse
                    </Button>
                  </div>
                </div>
              )}

              {suggestions.length === 0 && !isLoading && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Sélectionnez un scénario pour obtenir des suggestions de réponse
                </div>
              )}

              {isLoading && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Génération de suggestions...
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Corpus documentaire */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Corpus documentaire
                </h3>
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Ajouter
                </Button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                  <FileText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      Procédure suivi colis
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Mis à jour: 12/10/2024
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                  <FileText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      Politique retours
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Mis à jour: 08/10/2024
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                  <FileText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      Garantie constructeur
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Mis à jour: 05/10/2024
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                  <FileText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      Procédure RMA
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Mis à jour: 01/10/2024
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  4 documents indexés • 2.3 MB
                </p>
              </div>
            </div>

            {/* Client Info */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Informations client
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Nom :</span>
                  <p className="font-medium text-foreground">Marie Dupont</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email :</span>
                  <p className="font-medium text-foreground">marie.d@example.com</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Commande :</span>
                  <p className="font-medium text-foreground">#1234</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Statut :</span>
                  <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                    En transit
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Actions rapides
              </h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Consulter la commande
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Générer étiquette retour
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Vérifier garantie
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Historique conversations
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-muted/50 border border-border rounded-xl p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">
                💡 Raccourcis clavier
              </h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>
                  <kbd className="px-2 py-1 bg-background rounded font-semibold text-foreground">Tab</kbd> - Accepter la suggestion
                </p>
                <p>
                  <kbd className="px-2 py-1 bg-background rounded font-semibold text-foreground">Esc</kbd> - Ignorer
                </p>
                <p>
                  <kbd className="px-2 py-1 bg-background rounded font-semibold text-foreground">Ctrl+Tab</kbd> - Variante suivante
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SourcesDrawer
        sources={currentSources}
        isOpen={isSourcesOpen}
        onClose={() => setIsSourcesOpen(false)}
      />
    </div>
  );
}
