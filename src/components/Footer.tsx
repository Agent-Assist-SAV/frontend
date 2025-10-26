import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-border bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © 2025 Agent Assist SAV. Tous droits réservés.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              WhatsApp est une marque déposée de Meta Platforms, Inc.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/legal/confidentialite" className="text-muted-foreground hover:text-primary transition-colors">
              Confidentialité
            </Link>
            <a href="mailto:contact@agentassist.example.com" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
