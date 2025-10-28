// Configuration de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Types
export enum ChatMessageRole {
  user = "user",
  assistant = "assistant",
}

export interface ChatMessage {
  id: string;
  message: string;
  role: ChatMessageRole;
}

export interface Chat {
  id: string;
  messages: ChatMessage[];
  context: string;
}

export interface CreateChatMessageDTO {
  message: string;
  role: ChatMessageRole;
}

// Service API
class ChatService {
  private apiUrl = `${API_BASE_URL}/api`;
  private eventSources: Map<string, EventSource> = new Map();

  /**
   * Récupère tous les chats
   */
  async getChats(): Promise<Chat[]> {
    try {
      const response = await fetch(`${this.apiUrl}/chats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des chats: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur ChatService.getChats:", error);
      throw error;
    }
  }

  /**
   * Récupère le premier chat de la liste
   */
  async getFirstChat(): Promise<Chat | null> {
    try {
      const chats = await this.getChats();
      return chats.length > 0 ? chats[0] : null;
    } catch (error) {
      console.error("Erreur ChatService.getFirstChat:", error);
      throw error;
    }
  }

  /**
   * Crée un nouveau chat
   */
  async createChat(): Promise<Chat> {
    try {
      const response = await fetch(`${this.apiUrl}/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la création du chat: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur ChatService.createChat:", error);
      throw error;
    }
  }

  /**
   * Récupère un chat par son ID
   */
  async getChatById(chatId: string): Promise<Chat | null> {
    try {
      const response = await fetch(`${this.apiUrl}/chats/${chatId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Erreur lors de la récupération du chat: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur ChatService.getChatById:", error);
      throw error;
    }
  }

  /**
   * Ajoute un message à un chat
   */
  async addMessageToChat(chatId: string, message: CreateChatMessageDTO): Promise<ChatMessage> {
    try {
      const response = await fetch(`${this.apiUrl}/chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de l'ajout du message: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur ChatService.addMessageToChat:", error);
      throw error;
    }
  }

  /**
   * S'abonne aux messages SSE d'un chat
   * @param chatId ID du chat
   * @param onMessage Callback appelé à chaque nouveau message
   */
  subscribeToChat(chatId: string, onMessage: (message: ChatMessage) => void): void {
    // Fermer une connexion existante si elle existe
    if (this.eventSources.has(chatId)) {
      this.eventSources.get(chatId)?.close();
    }

    const eventSource = new EventSource(`${this.apiUrl}/chats/${chatId}/sse`);

    eventSource.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as ChatMessage;
        onMessage(message);
      } catch (error) {
        console.error("Erreur lors du parsing du message SSE:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("Erreur SSE:", error);
      // La connexion se fermera automatiquement en cas d'erreur
      this.eventSources.delete(chatId);
    };

    this.eventSources.set(chatId, eventSource);
  }

  /**
   * Se désabonne des messages SSE d'un chat
   */
  unsubscribeFromChat(chatId: string): void {
    const eventSource = this.eventSources.get(chatId);
    if (eventSource) {
      eventSource.close();
      this.eventSources.delete(chatId);
    }
  }

  /**
   * S'abonne aux suggestions SSE d'un chat
   * @param chatId ID du chat
   * @param onChunk Callback appelé à chaque morceau de suggestion reçu
   * @param onComplete Callback appelé quand la suggestion est complète
   * @param onError Callback appelé en cas d'erreur
   */
  subscribeToSuggestions(
    chatId: string,
    onChunk: (chunk: string) => void,
    onComplete?: () => void,
    onError?: (error: string) => void
  ): () => void {
    const suggestionKey = `suggestion-${chatId}`;
    
    // Fermer une connexion existante si elle existe
    if (this.eventSources.has(suggestionKey)) {
      this.eventSources.get(suggestionKey)?.close();
    }

    const eventSource = new EventSource(`${this.apiUrl}/chats/${chatId}/suggest`);

    eventSource.onmessage = (event) => {
      try {
        const data = event.data;
        
        // Vérifier si c'est la fin du stream
        if (data === "[DONE]") {
          eventSource.close();
          this.eventSources.delete(suggestionKey);
          if (onComplete) {
            onComplete();
          }
          return;
        }
        
        // Envoyer le chunk au callback
        onChunk(data);
      } catch (error) {
        console.error("Erreur lors du parsing de la suggestion SSE:", error);
      }
    };

    eventSource.addEventListener("error", (event: Event) => {
      const messageEvent = event as MessageEvent;
      if (messageEvent.data) {
        const errorMessage = messageEvent.data;
        if (onError) {
          onError(errorMessage);
        }
      } else {
        console.error("Erreur SSE suggestion:", event);
      }
      eventSource.close();
      this.eventSources.delete(suggestionKey);
    });

    eventSource.onerror = () => {
      // La connexion se fermera automatiquement en cas d'erreur
      this.eventSources.delete(suggestionKey);
      if (onError) {
        onError("Connexion perdue");
      }
    };

    this.eventSources.set(suggestionKey, eventSource);

    // Retourner une fonction pour se désabonner
    return () => {
      eventSource.close();
      this.eventSources.delete(suggestionKey);
    };
  }

  /**
   * Met à jour le contexte d'un chat
   */
  async updateChatContext(chatId: string, context: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/chats/${chatId}/context`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(context),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la mise à jour du contexte: ${response.status}`);
      }
    } catch (error) {
      console.error("Erreur ChatService.updateChatContext:", error);
      throw error;
    }
  }
}

// Export singleton
export const chatService = new ChatService();