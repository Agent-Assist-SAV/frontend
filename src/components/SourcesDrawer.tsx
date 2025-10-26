import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Source {
  title: string;
  snippet: string;
  url: string;
}

interface SourcesDrawerProps {
  sources: Source[];
  isOpen: boolean;
  onClose: () => void;
}

export const SourcesDrawer = ({ sources, isOpen, onClose }: SourcesDrawerProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sources ({sources.length})</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {sources.map((source, index) => (
            <div 
              key={index} 
              className="p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
            >
              <h3 className="font-semibold text-sm text-foreground mb-2">
                {source.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {source.snippet}
              </p>
              <a 
                href={source.url}
                className="text-xs text-primary hover:underline font-medium"
              >
                Voir le document →
              </a>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
