import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Copy, Check, Loader2, RefreshCw } from "lucide-react";
import { chatService } from "@/lib/chatService";
import { toast } from "sonner";

interface SuggestionPanelProps {
  chatId: string;
  onUseSuggestion: (suggestion: string) => void;
}

export function SuggestionPanel({ chatId, onUseSuggestion }: SuggestionPanelProps) {
  const [suggestion, setSuggestion] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFirstChunk, setIsFirstChunk] = useState(true);

  // S'abonner automatiquement au canal SSE au montage du composant
  useEffect(() => {
    if (!chatId) return;

    console.log(`[SuggestionPanel] Connexion au canal SSE pour chat ${chatId}`);

    const unsubscribe = chatService.subscribeToSuggestions(
      chatId,
      // onChunk
      (chunk: string) => {
        // Si c'est le premier chunk d'une nouvelle suggestion, réinitialiser
        if (!isStreaming) {
          console.log("[SuggestionPanel] Nouvelle suggestion détectée, réinitialisation...");
          setSuggestion("");
          setError(null);
          setCopied(false);
        }
        
        setIsStreaming(true);
        setSuggestion((prev) => prev + chunk);
        setError(null);
      },
      // onComplete
      () => {
        setIsStreaming(false);
        console.log("[SuggestionPanel] Suggestion complète reçue");
      },
      // onError
      (errorMsg: string) => {
        setIsStreaming(false);
        setError(errorMsg);
        toast.error("Erreur lors de la génération de la suggestion");
      }
    );

    // Cleanup : se désabonner quand le composant est détruit ou chatId change
    return () => {
      console.log(`[SuggestionPanel] Déconnexion du canal SSE pour chat ${chatId}`);
      unsubscribe();
    };
  }, [chatId, isStreaming]);

  const resetSuggestion = () => {
    setSuggestion("");
    setError(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion);
    setCopied(true);
    toast.success("Suggestion copiée !");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUse = () => {
    onUseSuggestion(suggestion);
    toast.success("Suggestion utilisée !");
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Suggestion IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!suggestion && !isStreaming && !error && (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">
              En attente d'un message client...
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Une suggestion sera générée automatiquement quand un message utilisateur sera reçu.
            </p>
          </div>
        )}

        {isStreaming && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Génération en cours...</span>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 min-h-[100px] text-sm whitespace-pre-wrap">
              {suggestion}
              <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1"></span>
            </div>
          </div>
        )}

        {suggestion && !isStreaming && (
          <div className="space-y-3">
            <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap">
              {suggestion}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUse} className="flex-1 gap-2">
                Utiliser
              </Button>
              <Button
                onClick={handleCopy}
                variant="outline"
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copier
                  </>
                )}
              </Button>
              <Button
                onClick={resetSuggestion}
                variant="outline"
                size="icon"
                title="Effacer la suggestion"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={resetSuggestion} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Effacer l'erreur
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
