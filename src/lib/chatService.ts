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
