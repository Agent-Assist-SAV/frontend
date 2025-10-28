import { useEffect, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { X, Send, ChevronDown, Loader } from "lucide-react";
import { chatService, ChatMessageRole } from "@/lib/chatService";
import { toast } from "sonner";


export interface MockMessage {
  id: string;
  role: "user" | "customer" | "incoming";
  content: string;
  chatId: string;
  createdAt: string;
  _mock: true;
}

export interface ClientSimulatorProps {
  chatId?: string;
  getCurrentChatId?: () => string | undefined;
  onInject?: (msg: MockMessage) => void;
}

/**
 * Builds a mock message object following the app's message model.
 * Exported for testing purposes.
 *
 * @param input - The message input data
 * @returns A MockMessage object
 */
// eslint-disable-next-line react-refresh/only-export-components
export function buildMockMessage(input: {
  text: string;
  chatId: string;
}): MockMessage {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    role: "user", // Matches the Demo.tsx Message interface role type
    content: input.text,
    chatId: input.chatId,
    createdAt: now,
    _mock: true,
  };
}

/**
 * Client message simulator panel (dev-only)
 * - Allows injecting mock inbound messages into the current chat
 * - Uses the same pipeline as real messages (TanStack Query or custom handler)
 * - Toggle with Ctrl/Cmd+Shift+I
 */
export function ClientSimulator(props: ClientSimulatorProps) {
  const [open, setOpen] = useState(true);
  const [text, setText] = useState("Où en est ma commande ?");
  const [chatIdInput, setChatIdInput] = useState(props.chatId ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Get chat ID from props, input, or default
  const resolvedChatId = props.getCurrentChatId?.() || props.chatId || chatIdInput || "demo-chat";

  // Keyboard shortcut: Ctrl/Cmd + Shift + I
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (mod && e.shiftKey && e.key.toLowerCase() === "i") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  async function inject() {
    if (!text.trim()) return;

    setIsLoading(true);

    const msg = buildMockMessage({
      text,
      chatId: resolvedChatId,
    });

    try {
      // 1) Send to backend API
      // Le message sera automatiquement reçu via SSE et ajouté par le composant Demo
      await chatService.addMessageToChat(resolvedChatId, {
        message: text,
        role: ChatMessageRole.user,
      });

      // 2) Dispatch a custom event for alternative handlers
      const evt = new CustomEvent("message:received", { detail: msg });
      window.dispatchEvent(evt);

      // 3) Call external handler if provided
      props.onInject?.(msg);

      toast.success("[DEV] Mock message sent to backend!");
      console.log("[DEV] Mock message sent to backend:", msg);

      // Clear input after sending
      setText("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error("[DEV] Error injecting mock message:", error);
      toast.error("Erreur lors de l'envoi du message simulé");
    } finally {
      setIsLoading(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 w-96 rounded-lg border border-border bg-card shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/50 p-3">
        <div className="flex items-center gap-2">
          <div className="text-xs font-medium text-primary">DEV</div>
          <span className="text-sm font-medium text-foreground">
            Simuler un message client
          </span>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="rounded p-0.5 hover:bg-muted"
          title="Fermer (Cmd/Ctrl+Shift+I)"
          aria-label="Close simulator"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3 p-4">
        {/* Message textarea */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Message client
          </label>
          <textarea
            ref={inputRef}
            className="h-20 w-full resize-none rounded border border-border bg-background p-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Bonjour, où en est ma commande ?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                inject();
              }
            }}
          />
        </div>

        {/* Chat ID input */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Chat ID{" "}
            <span className="text-xs text-muted-foreground">
              (autodétecté si dispo)
            </span>
          </label>
          <input
            type="text"
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="demo-chat"
            value={chatIdInput}
            onChange={(e) => setChatIdInput(e.target.value)}
          />
          {resolvedChatId && (
            <div className="text-xs text-muted-foreground">
              → Utilisé: <span className="font-mono font-medium">{resolvedChatId}</span>
            </div>
          )}
        </div>

        {/* Send button */}
        <button
          onClick={inject}
          disabled={!text.trim() || isLoading}
          className="w-full flex items-center justify-center gap-2 rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Envoi...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Envoyer comme client
            </>
          )}
        </button>

        {/* Help text */}
        <div className="rounded bg-muted/30 p-2 text-xs text-muted-foreground">
          <div className="font-medium mb-1">💡 Raccourci clavier:</div>
          <code className="block bg-background px-2 py-1 rounded text-xs font-mono">
            Cmd/Ctrl + Shift + I
          </code>
        </div>
      </div>
    </div>
  );
}
