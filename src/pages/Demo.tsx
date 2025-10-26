import { useState, useEffect, useRef } from "react";
import { SourcesDrawer } from "@/components/SourcesDrawer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, ExternalLink, Loader } from "lucide-react";
import { chatService, Chat, ChatMessageRole } from "@/lib/chatService";

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
  status?: "sending" | "sent" | "error"; // statut d'envoi
}

export default function Demo() {
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [currentSources, setCurrentSources] = useState<Source[]>([]);
  const [userInput, setUserInput] = useState("");
  const [corpusInput, setCorpusInput] = useState("");
  const [savedCorpus, setSavedCorpus] = useState("");
  const [isEditingCorpus, setIsEditingCorpus] = useState(false);
  const corpusInputRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas quand les messages changent
  useEffect(() => {
    if (messagesEndRef.current) {
      const messagesContainer = messagesEndRef.current.parentElement;
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Charger le premier chat au montage du composant
  useEffect(() => {
    const loadFirstChat = async () => {
      try {
        setIsLoadingChat(true);
        const chat = await chatService.getFirstChat();
        
        if (chat) {
          setCurrentChat(chat);
          // Convertir les messages du backend en messages pour l'affichage
          const displayMessages: Message[] = chat.messages.map((msg) => ({
            id: msg.id,
            role: msg.role as "user" | "assistant",
            content: msg.message,
            timestamp: new Date() // Le backend ne fournit pas les timestamps
          }));
          setMessages(displayMessages);
        } else {
          toast.error("Aucun chat disponible. Veuillez en créer un.");
        }
      } catch (error) {
        console.error("Erreur lors du chargement du chat:", error);
        toast.error("Erreur lors du chargement du chat");
      } finally {
        setIsLoadingChat(false);
      }
    };

    loadFirstChat();
  }, []);

    const handleSendMessage = async () => {
    if (!userInput.trim() || !currentChat) return;

    try {
      // Créer le message avec statut "sending"
      const messageId = Date.now().toString();
      const userMessage: Message = {
        id: messageId,
        role: "assistant",
        content: userInput,
        timestamp: new Date(),
        status: "sending"
      };
      
      // Ajouter le message localement immédiatement
      setMessages((prev) => [...prev, userMessage]);
      setUserInput("");

      // Envoyer le message au backend
      await chatService.addMessageToChat(currentChat.id, {
        message: userInput,
        role: ChatMessageRole.assistant
      });

      // Mettre à jour le statut à "sent"
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: "sent" } : msg
        )
      );
      
      toast.success("Message envoyé !");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      
      // Mettre à jour le statut à "error"
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 ? { ...msg, status: "error" } : msg
        )
      );
      
      toast.error("Erreur lors de l'envoi du message");
    }
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
                Conversation {currentChat ? `#${currentChat.id}` : "..."}
              </h2>
              
              {isLoadingChat ? (
                <div className="flex items-center justify-center h-40">
                  <div className="flex flex-col items-center gap-3">
                    <Loader className="w-6 h-6 animate-spin text-primary" />
                    <span className="text-muted-foreground">Chargement du chat...</span>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-40">
                  <span className="text-muted-foreground">Aucun message pour l'instant</span>
                </div>
              ) : (
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-3 ${
                          message.role === "user"
                            ? "bg-muted text-foreground border border-border"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                          {index === messages.length - 1 && message.status && (
                            <span className="text-xs">
                              {message.status === "sending" && (
                                <span className="inline-flex items-center gap-1">
                                  <Loader className="w-3 h-3 animate-spin" />
                                  Envoi...
                                </span>
                              )}
                              {message.status === "sent" && (
                                <span className="opacity-70">✓ Envoyé</span>
                              )}
                              {message.status === "error" && (
                                <span className="text-red-500">✗ Erreur</span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Input Area */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                    placeholder="Tapez votre réponse ici..."
                    disabled={isLoadingChat || !currentChat}
                    className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!userInput.trim() || isLoadingChat || !currentChat}
                    className="gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Envoyer
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Corpus documentaire */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Données contextuelles
                </h3>
                <div className="flex items-center gap-2">
                  {corpusInput !== savedCorpus && corpusInput && (
                    <>
                      <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full" title="Modifications non sauvegardées"></span>
                      <span className="text-xs italic text-yellow-600">Modifications en cours. Validez pour enregistrer.</span>
                    </>
                  )}
                  {savedCorpus && corpusInput === savedCorpus && (
                    <>
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full" title="Sauvegardé"></span>
                      <span className="text-xs italic text-muted-foreground">Contenu sauvegardé. Cliquez pour modifier.</span>
                    </>
                  )}
                  {!savedCorpus && !corpusInput && (
                    <span className="text-xs italic text-muted-foreground">Aucun contenu. Cliquez pour ajouter.</span>
                  )}
                </div>
              </div>
              
              <textarea
                ref={corpusInputRef}
                value={corpusInput}
                onChange={(e) => setCorpusInput(e.target.value)}
                onClick={() => {
                  if (!isEditingCorpus && savedCorpus) {
                    setIsEditingCorpus(true);
                    setCorpusInput(savedCorpus);
                    setTimeout(() => {
                      if (corpusInputRef.current) {
                        corpusInputRef.current.setSelectionRange(
                          corpusInputRef.current.value.length,
                          corpusInputRef.current.value.length
                        );
                        corpusInputRef.current.focus();
                      }
                    }, 0);
                  }
                }}
                placeholder="Entrez le contenu ou les informations documentaires ici..."
                className={`w-full h-32 px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 transition-colors cursor-pointer ${
                  !isEditingCorpus && savedCorpus
                    ? "bg-muted text-muted-foreground border-border"
                    : "bg-background text-foreground border-border focus:ring-primary placeholder-muted-foreground"
                }`}
              />
              
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (corpusInput.trim()) {
                      setSavedCorpus(corpusInput);
                      setIsEditingCorpus(false);
                      toast.success("Corpus documentaire sauvegardé !");
                    }
                  }}
                  disabled={corpusInput === savedCorpus}
                  className="flex-1"
                >
                  Valider
                </Button>
                {savedCorpus && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCorpusInput(savedCorpus);
                      setIsEditingCorpus(false);
                    }}
                    disabled={corpusInput === savedCorpus}
                  >
                    Annuler
                  </Button>
                )}
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
