export const IntegrationsRow = () => {
  const integrations = [
    { name: "WhatsApp", subtitle: "Cloud API" },
    { name: "Twilio", subtitle: "SMS & Voice" },
    { name: "Shopify", subtitle: "E-commerce" },
    { name: "Zendesk", subtitle: "Support" },
    { name: "Colissimo", subtitle: "Livraison" },
    { name: "DHL", subtitle: "Express" }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Intégrations
          </h2>
          <p className="text-lg text-muted-foreground">
            Connectez vos outils existants en quelques clics
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg"
            >
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-foreground">
                  {integration.name.charAt(0)}
                </span>
              </div>
              <div className="text-center">
                <div className="font-semibold text-sm text-foreground">
                  {integration.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {integration.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
