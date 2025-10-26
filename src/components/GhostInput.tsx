import { useState, useEffect, useRef } from "react";

interface Source {
  title: string;
  snippet: string;
  url: string;
}

interface Suggestion {
  text: string;
  sources: Source[];
}

interface GhostInputProps {
  suggestions: Suggestion[];
  onAccept: (suggestion: Suggestion) => void;
  onNextVariant: () => void;
  onDismiss: () => void;
  placeholder?: string;
}

export const GhostInput = ({ 
  suggestions, 
  onAccept, 
  onNextVariant, 
  onDismiss,
  placeholder = "Commencez à taper..."
}: GhostInputProps) => {
  const [value, setValue] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentSuggestion = suggestions[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" && currentSuggestion) {
        e.preventDefault();
        setValue(currentSuggestion.text);
        onAccept(currentSuggestion);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onDismiss();
        setValue("");
      } else if (e.ctrlKey && e.key === "Tab" && suggestions.length > 1) {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % suggestions.length;
        setCurrentIndex(nextIndex);
        onNextVariant();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSuggestion, currentIndex, suggestions.length, onAccept, onDismiss, onNextVariant]);

  return (
    <div className="relative w-full">
      <div className="relative">
        {/* Ghost text */}
        {currentSuggestion && !value && (
          <div className="absolute inset-0 pointer-events-none px-4 py-3 text-muted-foreground/50 whitespace-pre-wrap break-words font-mono text-sm">
            {currentSuggestion.text}
          </div>
        )}
        
        {/* Actual input */}
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={currentSuggestion ? "" : placeholder}
          className="w-full min-h-[120px] px-4 py-3 bg-background border border-input rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
          style={{ transition: "var(--transition-smooth)" }}
        />
      </div>
      
      {/* Keyboard hints */}
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="px-2 py-1 bg-muted rounded">
          <kbd className="font-semibold">Tab</kbd> pour accepter
        </span>
        <span className="px-2 py-1 bg-muted rounded">
          <kbd className="font-semibold">Esc</kbd> pour ignorer
        </span>
        {suggestions.length > 1 && (
          <span className="px-2 py-1 bg-muted rounded">
            <kbd className="font-semibold">Ctrl+Tab</kbd> pour variante suivante ({currentIndex + 1}/{suggestions.length})
          </span>
        )}
      </div>
    </div>
  );
};
