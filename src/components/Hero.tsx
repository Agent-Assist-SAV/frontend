import { Button } from "@/components/ui/button";
import { MessageSquare, CheckCircle2, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 -z-10" />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4" />
            <span>Assistant IA pour équipes SAV</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Assistant de réponse pour<br />équipes SAV — WhatsApp & co
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Autocomplétion instantanée, fondée sur vos documents et vos règles. 
            Respect des templates et de la fenêtre 24h. Actions SAV prêtes à l'emploi.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link to="/demo">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Essayer la démo interactive
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              onClick={scrollToContact}
            >
              Demander une démo
            </Button>
          </div>
          
          {/* Value bullets */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-5 h-5 text-secondary" />
              <span>Jusqu'à <strong className="text-foreground">-30% de temps</strong> de réponse</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
              <span>Réponses avec <strong className="text-foreground">citations vérifiables</strong></span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-5 h-5 text-secondary" />
              <span>Intégrations <strong className="text-foreground">WhatsApp, e-commerce</strong> et transporteurs</span>
            </div>
          </div>
        </div>
        
        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <span className="px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium">
            WhatsApp Business ready
          </span>
          <span className="px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium">
            RAG avec citations
          </span>
          <span className="px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium">
            Hébergement EU (OVHcloud)
          </span>
        </div>
      </div>
    </section>
  );
};
